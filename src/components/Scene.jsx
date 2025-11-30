import React, { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import useStore from '../store/useStore';
import Room from './Room';
import EditorObject from './EditorObject';

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

    return (
        <Canvas shadows camera={{ position: [8, 8, 8], fov: 45 }}>
            <SceneExporter />
            {/* Lighting & Environment */}
            <ambientLight intensity={0.4} />
            <directionalLight
                position={[5, 8, 5]}
                intensity={1.5}
                castShadow
                shadow-mapSize={[1024, 1024]}
            />
            <Environment preset="apartment" background={false} />
            <color attach="background" args={['#202020']} />

            {/* Post Processing */}
            <EffectComposer>
                <Bloom luminanceThreshold={1} intensity={1} radius={0.5} />
            </EffectComposer>

            <Room />

            {objects.map((obj) => (
                <EditorObject key={obj.id} {...obj} />
            ))}

            {/* <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={20} blur={2} far={4} /> */}

            <OrbitControls makeDefault enabled={!selectedId} minPolarAngle={0} maxPolarAngle={Math.PI / 2.2} />

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
