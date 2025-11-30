import React from 'react';

export const Rug = ({ color = '#e0f7fa' }) => (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[1.5, 64]} />
        <meshStandardMaterial color={color} />
    </mesh>
);

export const WallArt = ({ color = '#ffcc80' }) => (
    <group>
        {/* Frame */}
        <mesh position={[0, 1.5, -0.05]}>
            <boxGeometry args={[1, 1.2, 0.05]} />
            <meshStandardMaterial color="#5d4037" />
        </mesh>
        {/* Canvas */}
        <mesh position={[0, 1.5, -0.02]}>
            <planeGeometry args={[0.8, 1]} />
            <meshStandardMaterial color={color} />
        </mesh>
    </group>
);

export const Mirror = () => (
    <group>
        <mesh position={[0, 1.5, -0.05]}>
            <cylinderGeometry args={[0.6, 0.6, 0.05, 64]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#silver" metalness={1} roughness={0} />
        </mesh>
        <mesh position={[0, 1.5, -0.06]}>
            <cylinderGeometry args={[0.65, 0.65, 0.02, 64]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#333" />
        </mesh>
    </group>
);

export const Plant = ({ color = '#4caf50' }) => (
    <group>
        {/* Pot */}
        <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.25, 0.2, 0.4]} />
            <meshStandardMaterial color="#ff7043" />
        </mesh>
        {/* Soil */}
        <mesh position={[0, 0.38, 0]}>
            <circleGeometry args={[0.22]} rotation={[-Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#3e2723" />
        </mesh>
        {/* Stem */}
        <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.5]} />
            <meshStandardMaterial color="#388e3c" />
        </mesh>
        {/* Leaves */}
        <mesh position={[0, 0.8, 0]}>
            <dodecahedronGeometry args={[0.3]} />
            <meshStandardMaterial color={color} />
        </mesh>
    </group>
);
