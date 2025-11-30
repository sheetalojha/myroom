import React from 'react';

export const Plushie = ({ color = '#f48fb1' }) => (
    <group>
        {/* Body */}
        <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.2]} />
            <meshStandardMaterial color={color} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.45, 0]}>
            <sphereGeometry args={[0.15]} />
            <meshStandardMaterial color={color} />
        </mesh>
        {/* Ears */}
        <mesh position={[-0.1, 0.55, 0]}>
            <sphereGeometry args={[0.05]} />
            <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0.1, 0.55, 0]}>
            <sphereGeometry args={[0.05]} />
            <meshStandardMaterial color={color} />
        </mesh>
    </group>
);

export const Mug = ({ color = '#ffffff' }) => (
    <group>
        <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.2]} />
            <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0.12, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.06, 0.02, 8, 16]} />
            <meshStandardMaterial color={color} />
        </mesh>
    </group>
);
