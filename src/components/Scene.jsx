import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import useStore from '../store/useStore';
import Room from './Room';
import EditorObject from './EditorObject';

const Scene = () => {
    const objects = useStore((state) => state.objects);
    const selectedId = useStore((state) => state.selectedId);
    const selectObject = useStore((state) => state.selectObject);

    return (
        <Canvas shadows camera={{ position: [8, 8, 8], fov: 45 }}>
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
