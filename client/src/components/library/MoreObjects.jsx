import React from 'react';

// Voxel helper function
const VoxelBox = ({ position, size = [1, 1, 1], color }) => (
    <mesh position={position}>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} />
    </mesh>
);

const scale = 1.8;

export const VoxelTV = ({ color = '#1a1a1a' }) => (
    <group>
        {/* Screen */}
        <VoxelBox position={[0, 0.8 * scale, 0]} size={[2.5 * scale, 1.8 * scale, 0.2 * scale]} color={color} />
        {/* Screen glow */}
        <VoxelBox position={[0, 0.8 * scale, 0.11 * scale]} size={[2.3 * scale, 1.6 * scale, 0.05]} color="#4a9eff" />
        {/* Stand */}
        <VoxelBox position={[0, 0.2 * scale, 0]} size={[0.4 * scale, 0.4 * scale, 0.4 * scale]} color="#333" />
        {/* Base */}
        <VoxelBox position={[0, 0.05 * scale, 0]} size={[1.2 * scale, 0.1 * scale, 0.6 * scale]} color="#333" />
    </group>
);

export const VoxelComputer = ({ color = '#2c2c2c' }) => (
    <group>
        {/* Monitor */}
        <VoxelBox position={[0, 0.6 * scale, 0]} size={[1.8 * scale, 1.2 * scale, 0.15 * scale]} color={color} />
        <VoxelBox position={[0, 0.6 * scale, 0.08 * scale]} size={[1.6 * scale, 1 * scale, 0.05]} color="#87ceeb" />
        {/* Stand */}
        <VoxelBox position={[0, 0.3 * scale, 0]} size={[0.3 * scale, 0.3 * scale, 0.3 * scale]} color="#1a1a1a" />
        {/* Keyboard */}
        <VoxelBox position={[0, 0.1 * scale, 0.5 * scale]} size={[1.2 * scale, 0.1 * scale, 0.4 * scale]} color="#1a1a1a" />
    </group>
);

export const VoxelClock = ({ color = '#f5f5f5' }) => (
    <group>
        {/* Clock body */}
        <VoxelBox position={[0, 1.2 * scale, 0]} size={[0.8 * scale, 0.8 * scale, 0.2 * scale]} color={color} />
        {/* Clock face */}
        <VoxelBox position={[0, 1.2 * scale, 0.11 * scale]} size={[0.7 * scale, 0.7 * scale, 0.05]} color="#fff" />
        {/* Hands */}
        <VoxelBox position={[0, 1.3 * scale, 0.13 * scale]} size={[0.05, 0.2 * scale, 0.02]} color="#000" />
        <VoxelBox position={[0.15 * scale, 1.2 * scale, 0.13 * scale]} size={[0.2 * scale, 0.05, 0.02]} color="#000" />
    </group>
);

export const VoxelCactus = ({ color = '#4caf50' }) => (
    <group>
        {/* Pot */}
        <VoxelBox position={[0, 0.15 * scale, 0]} size={[0.4 * scale, 0.3 * scale, 0.4 * scale]} color="#8d6e63" />
        {/* Main body */}
        <VoxelBox position={[0, 0.5 * scale, 0]} size={[0.3 * scale, 0.8 * scale, 0.3 * scale]} color={color} />
        {/* Arms */}
        <VoxelBox position={[-0.2 * scale, 0.7 * scale, 0]} size={[0.25 * scale, 0.4 * scale, 0.25 * scale]} color={color} />
        <VoxelBox position={[0.2 * scale, 0.7 * scale, 0]} size={[0.25 * scale, 0.4 * scale, 0.25 * scale]} color={color} />
        {/* Top */}
        <VoxelBox position={[0, 1.1 * scale, 0]} size={[0.25 * scale, 0.3 * scale, 0.25 * scale]} color={color} />
    </group>
);

export const VoxelLamp = ({ color = '#ffeb3b' }) => (
    <group>
        {/* Base */}
        <VoxelBox position={[0, 0.1 * scale, 0]} size={[0.3 * scale, 0.2 * scale, 0.3 * scale]} color="#212121" />
        {/* Pole */}
        <VoxelBox position={[0, 0.6 * scale, 0]} size={[0.08 * scale, 1 * scale, 0.08 * scale]} color="#212121" />
        {/* Shade */}
        <VoxelBox position={[0, 1.3 * scale, 0]} size={[0.6 * scale, 0.4 * scale, 0.6 * scale]} color={color} />
        {/* Light */}
        <VoxelBox position={[0, 1.1 * scale, 0]} size={[0.2 * scale, 0.2 * scale, 0.2 * scale]} color="#fff" />
    </group>
);

export const VoxelVase = ({ color = '#e91e63' }) => (
    <group>
        {/* Vase body */}
        <VoxelBox position={[0, 0.3 * scale, 0]} size={[0.4 * scale, 0.6 * scale, 0.4 * scale]} color={color} />
        {/* Top rim */}
        <VoxelBox position={[0, 0.65 * scale, 0]} size={[0.35 * scale, 0.1 * scale, 0.35 * scale]} color={color} />
        {/* Flowers */}
        <VoxelBox position={[0, 0.9 * scale, 0]} size={[0.15 * scale, 0.2 * scale, 0.15 * scale]} color="#ff6b9d" />
        <VoxelBox position={[-0.1 * scale, 0.85 * scale, 0]} size={[0.1 * scale, 0.15 * scale, 0.1 * scale]} color="#ff6b9d" />
        <VoxelBox position={[0.1 * scale, 0.85 * scale, 0]} size={[0.1 * scale, 0.15 * scale, 0.1 * scale]} color="#ff6b9d" />
    </group>
);

export const VoxelBooks = ({ color = '#8b4513' }) => (
    <group>
        {/* Stack of books */}
        <VoxelBox position={[0, 0.15 * scale, 0]} size={[0.6 * scale, 0.3 * scale, 0.4 * scale]} color="#8b4513" />
        <VoxelBox position={[0, 0.35 * scale, 0]} size={[0.55 * scale, 0.25 * scale, 0.35 * scale]} color="#a0522d" />
        <VoxelBox position={[0, 0.55 * scale, 0]} size={[0.5 * scale, 0.2 * scale, 0.3 * scale]} color="#cd853f" />
    </group>
);

export const VoxelPillow = ({ color = '#f8bbd0' }) => (
    <group>
        <VoxelBox position={[0, 0.1 * scale, 0]} size={[1.2 * scale, 0.2 * scale, 1.2 * scale]} color={color} />
    </group>
);

