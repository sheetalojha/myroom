import React from 'react';

// Voxel helper function
const VoxelBox = ({ position, size = [1, 1, 1], color }) => (
    <mesh position={position}>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} />
    </mesh>
);

export const Plushie = ({ color = '#f48fb1' }) => {
    const scale = 1.8;
    return (
        <group>
            {/* Body - Voxelated */}
            <VoxelBox position={[0, 0.25 * scale, 0]} size={[0.4 * scale, 0.4 * scale, 0.4 * scale]} color={color} />
            {/* Head */}
            <VoxelBox position={[0, 0.55 * scale, 0]} size={[0.3 * scale, 0.3 * scale, 0.3 * scale]} color={color} />
            {/* Ears */}
            <VoxelBox position={[-0.15 * scale, 0.65 * scale, 0]} size={[0.15 * scale, 0.15 * scale, 0.1 * scale]} color={color} />
            <VoxelBox position={[0.15 * scale, 0.65 * scale, 0]} size={[0.15 * scale, 0.15 * scale, 0.1 * scale]} color={color} />
            {/* Eyes */}
            <VoxelBox position={[-0.08 * scale, 0.55 * scale, 0.16 * scale]} size={[0.05 * scale, 0.05 * scale, 0.02]} color="#000" />
            <VoxelBox position={[0.08 * scale, 0.55 * scale, 0.16 * scale]} size={[0.05 * scale, 0.05 * scale, 0.02]} color="#000" />
        </group>
    );
};

export const Mug = ({ color = '#ffffff' }) => {
    const scale = 1.8;
    return (
        <group>
            {/* Cup body - Voxelated */}
            <VoxelBox position={[0, 0.15 * scale, 0]} size={[0.2 * scale, 0.3 * scale, 0.2 * scale]} color={color} />
            {/* Handle - Voxelated */}
            <VoxelBox position={[0.15 * scale, 0.15 * scale, 0]} size={[0.08 * scale, 0.25 * scale, 0.08 * scale]} color={color} />
        </group>
    );
};
