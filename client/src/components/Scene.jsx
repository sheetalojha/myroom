import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, SSAO } from '@react-three/postprocessing';
import useStore from '../store/useStore';
import Room from './Room';
import EditorObject from './EditorObject';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';
import { LIGHTING_PRESETS } from '../config/roomThemes';
import * as THREE from 'three';

// True isometric camera configuration
// 45° Y-axis rotation, ~35.264° X-axis rotation (arctan(1/sqrt(2)))
const ISOMETRIC_POLAR_ANGLE = Math.PI / 2 - Math.atan(1 / Math.sqrt(2)); // ~35.264° from horizontal
const ISOMETRIC_AZIMUTH_ANGLE = Math.PI / 4; // 45° rotation
const ISOMETRIC_ZOOM = 38; // Orthographic zoom level

// Custom Orthographic Camera Setup
const OrthographicCamera = () => {
    const { size, set } = useThree();
    
    useEffect(() => {
        // Create orthographic camera
        const orthoCamera = new THREE.OrthographicCamera(
            -size.width / ISOMETRIC_ZOOM,
            size.width / ISOMETRIC_ZOOM,
            size.height / ISOMETRIC_ZOOM,
            -size.height / ISOMETRIC_ZOOM,
            0.1,
            100
        );
        
        // Set isometric position
        const distance = 25;
        const x = distance * Math.sin(ISOMETRIC_POLAR_ANGLE) * Math.cos(ISOMETRIC_AZIMUTH_ANGLE);
        const y = distance * Math.cos(ISOMETRIC_POLAR_ANGLE);
        const z = distance * Math.sin(ISOMETRIC_POLAR_ANGLE) * Math.sin(ISOMETRIC_AZIMUTH_ANGLE);
        
        orthoCamera.position.set(x, y, z);
        orthoCamera.lookAt(0, 0, 0);
        orthoCamera.updateProjectionMatrix();
        
        // Replace camera in the scene
        set({ camera: orthoCamera });
        
        // Handle resize
        const handleResize = () => {
            orthoCamera.left = -size.width / ISOMETRIC_ZOOM;
            orthoCamera.right = size.width / ISOMETRIC_ZOOM;
            orthoCamera.top = size.height / ISOMETRIC_ZOOM;
            orthoCamera.bottom = -size.height / ISOMETRIC_ZOOM;
            orthoCamera.updateProjectionMatrix();
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [size, set]);
    
    return null;
};

// Custom OrbitControls with fixed isometric view
const IsometricOrbitControls = ({ enabled }) => {
    const controlsRef = useRef();
    const isDragging = useRef(false);
    const springFactor = 0.15;
    const frameCount = useRef(0);
    
    useFrame(() => {
        if (!controlsRef.current || !enabled) return;
        
        // Skip every other frame for better performance
        frameCount.current++;
        if (frameCount.current % 2 !== 0 && !isDragging.current) return;
        
        const controls = controlsRef.current;
        
        // If not dragging, smoothly return to isometric view
        if (!isDragging.current) {
            const currentAzimuth = controls.getAzimuthalAngle();
            const currentPolar = controls.getPolarAngle();
            
            let azimuthDiff = ISOMETRIC_AZIMUTH_ANGLE - currentAzimuth;
            let polarDiff = ISOMETRIC_POLAR_ANGLE - currentPolar;
            
            if (azimuthDiff > Math.PI) azimuthDiff -= Math.PI * 2;
            if (azimuthDiff < -Math.PI) azimuthDiff += Math.PI * 2;
            
            const newAzimuth = currentAzimuth + azimuthDiff * springFactor;
            const newPolar = currentPolar + polarDiff * springFactor;
            
            controls.setAzimuthalAngle(newAzimuth);
            controls.setPolarAngle(newPolar);
            
            if (Math.abs(azimuthDiff) < 0.005 && Math.abs(polarDiff) < 0.005) {
                controls.setAzimuthalAngle(ISOMETRIC_AZIMUTH_ANGLE);
                controls.setPolarAngle(ISOMETRIC_POLAR_ANGLE);
            }
        }
        
        // Constrain to isometric view
        const currentAzimuth = controls.getAzimuthalAngle();
        const currentPolar = controls.getPolarAngle();
        
        const maxAzimuthDeviation = Math.PI / 12;
        const maxPolarDeviation = Math.PI / 12;
        
        if (Math.abs(currentAzimuth - ISOMETRIC_AZIMUTH_ANGLE) > maxAzimuthDeviation) {
            const constrainedAzimuth = ISOMETRIC_AZIMUTH_ANGLE + 
                Math.sign(currentAzimuth - ISOMETRIC_AZIMUTH_ANGLE) * maxAzimuthDeviation;
            controls.setAzimuthalAngle(constrainedAzimuth);
        }
        
        if (Math.abs(currentPolar - ISOMETRIC_POLAR_ANGLE) > maxPolarDeviation) {
            const constrainedPolar = ISOMETRIC_POLAR_ANGLE + 
                Math.sign(currentPolar - ISOMETRIC_POLAR_ANGLE) * maxPolarDeviation;
            controls.setPolarAngle(constrainedPolar);
        }
    });
    
    return (
        <OrbitControls
            ref={controlsRef}
            makeDefault
            enabled={enabled}
            minPolarAngle={ISOMETRIC_POLAR_ANGLE - Math.PI / 12}
            maxPolarAngle={ISOMETRIC_POLAR_ANGLE + Math.PI / 12}
            minAzimuthAngle={ISOMETRIC_AZIMUTH_ANGLE - Math.PI / 12}
            maxAzimuthAngle={ISOMETRIC_AZIMUTH_ANGLE + Math.PI / 12}
            minDistance={25}
            maxDistance={25}
            enableZoom={false}
            enableDamping
            dampingFactor={0.08}
            onStart={() => {
                isDragging.current = true;
            }}
            onEnd={() => {
                isDragging.current = false;
            }}
        />
    );
};


// Performance Monitor Component (inside Canvas)
const PerformanceMonitor = () => {
    const performanceState = usePerformanceMonitor();
    const adjustPerformanceSettings = useStore((state) => state.adjustPerformanceSettings);
    const setPerformanceNotification = useStore((state) => state.setPerformanceNotification);
    
    const previousPerformanceState = useRef({ 
        isCritical: false, 
        isLowPerformance: false,
        showNotification: false 
    });
    const notificationCooldown = useRef(0);
    const lastNotificationTime = useRef(0);
    const COOLDOWN_PERIOD = 10000; // 10 seconds cooldown between notifications

    useEffect(() => {
        const wasLowPerformance = previousPerformanceState.current.isLowPerformance || previousPerformanceState.current.isCritical;
        const isNowLowPerformance = performanceState.isLowPerformance || performanceState.isCritical;
        const wasShowingNotification = previousPerformanceState.current.showNotification;
        const isShowingNotification = performanceState.showNotification;
        const now = Date.now();

        // Only adjust settings when transitioning TO low performance
        if (isNowLowPerformance && !wasLowPerformance) {
            if (performanceState.isCritical) {
                adjustPerformanceSettings('low');
            } else if (performanceState.isLowPerformance) {
                adjustPerformanceSettings('medium');
            }
        }

        // Only show notification if:
        // 1. It's requesting to show
        // 2. It wasn't showing before
        // 3. Enough time has passed since last notification (cooldown)
        if (isShowingNotification && !wasShowingNotification) {
            const timeSinceLastNotification = now - lastNotificationTime.current;
            
            if (timeSinceLastNotification >= COOLDOWN_PERIOD) {
                lastNotificationTime.current = now;
                setPerformanceNotification({
                    show: true,
                    message: performanceState.notificationMessage,
                    isCritical: performanceState.isCritical
                });
            }
        } else if (!isShowingNotification && wasShowingNotification) {
            // Clear notification when it's dismissed
            setPerformanceNotification(null);
        }

        // Update previous state
        previousPerformanceState.current = {
            isCritical: performanceState.isCritical,
            isLowPerformance: performanceState.isLowPerformance,
            showNotification: performanceState.showNotification
        };
    }, [performanceState, adjustPerformanceSettings, setPerformanceNotification]);

    return null;
};

// Helper component to expose the scene and camera globally for export functionality
const SceneExporter = () => {
    const { scene, camera } = useThree();

    useEffect(() => {
        // Store scene and camera references globally for export functionality
        window.__THREE_SCENE__ = scene;
        window.__THREE_CAMERA__ = camera;

        return () => {
            // Cleanup on unmount
            delete window.__THREE_SCENE__;
            delete window.__THREE_CAMERA__;
        };
    }, [scene, camera]);

    return null;
};


const Scene = () => {
    const objects = useStore((state) => state.objects);
    const selectedId = useStore((state) => state.selectedId);
    const selectObject = useStore((state) => state.selectObject);
    const mode = useStore((state) => state.mode);
    const roomConfig = useStore((state) => state.roomConfig);
    const ssaoSamples = useStore((state) => state.ssaoSamples);
    const ssaoRadius = useStore((state) => state.ssaoRadius);
    const ssaoIntensity = useStore((state) => state.ssaoIntensity);
    const bloomIntensity = useStore((state) => state.bloomIntensity);
    const enablePostProcessing = useStore((state) => state.enablePostProcessing);
    const enableShadows = useStore((state) => state.enableShadows);
    const isEditMode = mode === 'edit';

    // Get lighting preset
    const lightingPreset = LIGHTING_PRESETS[roomConfig?.lighting] || LIGHTING_PRESETS.medium;

    return (
        <Canvas 
            shadows={enableShadows}
            gl={{ antialias: true, alpha: true }}
            dpr={1}
            performance={{ min: 0.5 }}
        >
            {/* Performance Monitor */}
            <PerformanceMonitor />
            <SceneExporter />

            {/* Setup orthographic camera */}
            <OrthographicCamera />

            {/* Ambient light - from config */}
            <ambientLight intensity={lightingPreset.ambientIntensity} color={lightingPreset.color} />
            
            {/* Main directional light - from top-left like sun */}
            <directionalLight
                position={[15, 20, 10]}
                intensity={lightingPreset.directionalIntensity}
                color={lightingPreset.color}
                castShadow={enableShadows}
                shadow-mapSize={[2048, 2048]}
                shadow-bias={-0.0001}
            />
            
            {/* Fill light from opposite side - subtle */}
            <directionalLight
                position={[-10, 8, -10]}
                intensity={lightingPreset.fillIntensity}
                color={lightingPreset.color}
            />

            {/* Post Processing Effects - Dynamically adjusted for performance */}
            {enablePostProcessing && (
                <EffectComposer>
                    <Bloom
                        luminanceThreshold={0.95}
                        intensity={bloomIntensity}
                        radius={0.4}
                    />
                </EffectComposer>
            )}

            <Room />

            {objects.map((obj) => (
                <EditorObject key={obj.id} {...obj} />
            ))}

            {/* Fixed isometric controls - disabled in view mode */}
            <IsometricOrbitControls enabled={isEditMode && !selectedId} />

            {/* Deselect on background click - only in edit mode */}
            {isEditMode && (
                <mesh
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, -0.01, 0]}
                    onClick={() => selectObject(null)}
                    visible={false}
                >
                    <planeGeometry args={[100, 100]} />
                </mesh>
            )}
        </Canvas>
    );
};

export default Scene;
