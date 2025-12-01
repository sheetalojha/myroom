import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Registry } from './library/Registry';

const PreviewObject = ({ type, color }) => {
    const registryItem = Registry[type];
    const Component = registryItem ? registryItem.component : null;
    
    if (!Component) {
        return (
            <mesh>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color={color || '#ffffff'} />
            </mesh>
        );
    }
    
    // Handle physics objects (like Human) differently for preview - pass no id for preview mode
    if (registryItem.isPhysics) {
        return <Component color={color} />;
    }
    
    // Pass color only if provided, otherwise let component use its default
    return color ? <Component color={color} /> : <Component />;
};

const ObjectPreview = ({ type, color }) => {
    return (
        <div style={{ width: '100%', height: '100%', background: 'transparent' }}>
            <Canvas
                camera={{ position: [7, 7, 7], fov: 28 }}
                gl={{ 
                    alpha: true, 
                    antialias: true,
                    powerPreference: 'low-power',
                    stencil: false,
                    depth: true,
                    toneMappingExposure: 1.2
                }}
                dpr={Math.min(window.devicePixelRatio, 1.5)}
                performance={{ min: 0.2 }}
            >
                <ambientLight intensity={1.0} />
                <directionalLight position={[8, 12, 8]} intensity={1.8} />
                <directionalLight position={[-6, 5, -6]} intensity={0.6} />
                <pointLight position={[0, 10, 0]} intensity={0.5} />
                <Suspense fallback={null}>
                    <PreviewObject type={type} color={color} />
                </Suspense>
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={1.5}
                    minPolarAngle={Math.PI / 3.5}
                    maxPolarAngle={Math.PI / 1.4}
                    enableDamping={false}
                />
            </Canvas>
        </div>
    );
};

export default ObjectPreview;

