import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, SSAO } from '@react-three/postprocessing';
import useStore from '../store/useStore';
import Room from './Room';
import EditorObject from './EditorObject';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';
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

// Shadow Catcher Plane for drop shadow - positioned below the room
const ShadowCatcher = ({ enabled }) => {
    if (!enabled) return null;
    
    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1, 0]}
            receiveShadow
        >
            <planeGeometry args={[60, 60]} />
            <shadowMaterial transparent opacity={0.4} color="#000000" />
        </mesh>
    );
};

// Performance Monitor Component (inside Canvas)
const PerformanceMonitor = () => {
    const performanceState = usePerformanceMonitor();
    const adjustPerformanceSettings = useStore((state) => state.adjustPerformanceSettings);
    const setPerformanceNotification = useStore((state) => state.setPerformanceNotification);
    
    const previousPerformanceState = useRef({ isCritical: false, isLowPerformance: false });

    useEffect(() => {
        const wasLowPerformance = previousPerformanceState.current.isLowPerformance || previousPerformanceState.current.isCritical;
        const isNowLowPerformance = performanceState.isLowPerformance || performanceState.isCritical;

        // Only adjust settings when transitioning TO low performance
        if (isNowLowPerformance && !wasLowPerformance) {
            if (performanceState.isCritical) {
                adjustPerformanceSettings('low');
            } else if (performanceState.isLowPerformance) {
                adjustPerformanceSettings('medium');
            }
        }

        // Update notification in store for UI - only show when transitioning
        if (performanceState.showNotification) {
            setPerformanceNotification({
                show: true,
                message: performanceState.notificationMessage,
                isCritical: performanceState.isCritical
            });
        } else {
            setPerformanceNotification(null);
        }

        // Update previous state
        previousPerformanceState.current = {
            isCritical: performanceState.isCritical,
            isLowPerformance: performanceState.isLowPerformance
        };
    }, [performanceState, adjustPerformanceSettings, setPerformanceNotification]);

    return null;
};

const Scene = () => {
    const objects = useStore((state) => state.objects);
    const selectedId = useStore((state) => state.selectedId);
    const selectObject = useStore((state) => state.selectObject);
    const mode = useStore((state) => state.mode);
    const shadowQuality = useStore((state) => state.shadowQuality);
    const enableShadows = useStore((state) => state.enableShadows);
    const ssaoSamples = useStore((state) => state.ssaoSamples);
    const ssaoRadius = useStore((state) => state.ssaoRadius);
    const ssaoIntensity = useStore((state) => state.ssaoIntensity);
    const bloomIntensity = useStore((state) => state.bloomIntensity);
    const enablePostProcessing = useStore((state) => state.enablePostProcessing);
    const isEditMode = mode === 'edit';

    return (
        <Canvas 
            shadows={enableShadows}
            gl={{ antialias: true, alpha: true }}
            dpr={1}
            performance={{ min: 0.5 }}
        >
            {/* Performance Monitor */}
            <PerformanceMonitor />

            {/* Setup orthographic camera */}
            <OrthographicCamera />

            {/* Ambient light - subtle */}
            <ambientLight intensity={0.3} color="#FFFFFF" />
            
            {/* Main directional light - from top-left like sun */}
            <directionalLight
                position={[15, 20, 10]}
                intensity={1.5}
                color="#FFFFFF"
                castShadow={enableShadows}
                shadow-mapSize={enableShadows ? [shadowQuality, shadowQuality] : [512, 512]}
                shadow-camera-far={60}
                shadow-camera-left={-20}
                shadow-camera-right={20}
                shadow-camera-top={20}
                shadow-camera-bottom={-20}
                shadow-bias={-0.0001}
                shadow-normalBias={0.02}
            />
            
            {/* Fill light from opposite side - subtle */}
            <directionalLight
                position={[-10, 8, -10]}
                intensity={0.2}
                color="#FFFFFF"
            />

            {/* Post Processing Effects - Dynamically adjusted for performance */}
            {enablePostProcessing && (
                <EffectComposer>
                    {/* SSAO only works well with shadows enabled */}
                    {enableShadows && (
                        <SSAO
                            samples={ssaoSamples}
                            radius={ssaoRadius}
                            intensity={ssaoIntensity}
                            luminanceInfluence={0.1}
                            color="#000000"
                        />
                    )}
                    <Bloom
                        luminanceThreshold={0.95}
                        intensity={bloomIntensity}
                        radius={0.4}
                    />
                </EffectComposer>
            )}

            {/* Shadow catcher for drop shadow */}
            <ShadowCatcher enabled={enableShadows} />

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
