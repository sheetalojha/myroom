import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, SSAO } from '@react-three/postprocessing';
import useStore from '../store/useStore';
import Room from './Room';
import EditorObject from './EditorObject';
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
    
    useFrame(() => {
        if (!controlsRef.current) return;
        
        const controls = controlsRef.current;
        
        // If not dragging and enabled, smoothly return to isometric view
        if (!isDragging.current && enabled) {
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

// Shadow Catcher Plane for drop shadow
const ShadowCatcher = () => {
    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.5, 0]}
            receiveShadow
        >
            <planeGeometry args={[50, 50]} />
            <shadowMaterial transparent opacity={0.3} />
        </mesh>
    );
};

const Scene = () => {
    const objects = useStore((state) => state.objects);
    const selectedId = useStore((state) => state.selectedId);
    const selectObject = useStore((state) => state.selectObject);

    return (
        <Canvas 
            shadows 
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
            style={{ 
                background: 'radial-gradient(circle at center, #E6F2FF 0%, #B3D9FF 50%, #87CEEB 100%)'
            }}
        >
            {/* Setup orthographic camera */}
            <OrthographicCamera />

            {/* Warm yellow-tinted sunlight */}
            <ambientLight intensity={0.4} color="#FFF8E1" />
            
            {/* Main directional light - warm yellow tint */}
            <directionalLight
                position={[10, 15, 10]}
                intensity={1.2}
                color="#FFE082"
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-far={50}
                shadow-camera-left={-15}
                shadow-camera-right={15}
                shadow-camera-top={15}
                shadow-camera-bottom={-15}
                shadow-bias={-0.0001}
            />
            
            {/* Fill light - warm tone */}
            <directionalLight
                position={[-8, 12, -8]}
                intensity={0.4}
                color="#FFF9C4"
            />

            {/* Post Processing Effects */}
            <EffectComposer>
                <SSAO
                    samples={31}
                    radius={5}
                    intensity={30}
                    luminanceInfluence={0.1}
                    color="#000000"
                />
                <Bloom
                    luminanceThreshold={0.8}
                    intensity={0.6}
                    radius={0.7}
                />
            </EffectComposer>

            {/* Shadow catcher for drop shadow */}
            <ShadowCatcher />

            <Room />

            {objects.map((obj) => (
                <EditorObject key={obj.id} {...obj} />
            ))}

            {/* Fixed isometric controls */}
            <IsometricOrbitControls enabled={!selectedId} />

            {/* Deselect on background click */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.01, 0]}
                onClick={() => selectObject(null)}
                visible={false}
            >
                <planeGeometry args={[100, 100]} />
            </mesh>
        </Canvas>
    );
};

export default Scene;
