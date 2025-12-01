import React from 'react';

// Voxel helper function
const VoxelBox = ({ position, size = [1, 1, 1], color }) => (
    <mesh position={position}>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} />
    </mesh>
);

export const Rug = ({ color = '#e0f7fa' }) => {
    const scale = 1.8;
    // Create voxelated rug pattern
    return (
        <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            {/* Base rug - made of voxels */}
            {Array.from({ length: 8 }).map((_, i) => 
                Array.from({ length: 8 }).map((_, j) => (
                    <VoxelBox
                        key={`${i}-${j}`}
                        position={[(i - 3.5) * 0.4 * scale, 0, (j - 3.5) * 0.4 * scale]}
                        size={[0.35 * scale, 0.02, 0.35 * scale]}
                        color={color}
                    />
                ))
            )}
        </group>
    );
};

export const WallArt = ({ color = '#ffcc80' }) => {
    const scale = 1.8;
    return (
        <group>
            {/* Frame - Voxelated */}
            <VoxelBox position={[0, 1.8 * scale, -0.08 * scale]} size={[1.8 * scale, 2.2 * scale, 0.1 * scale]} color="#5d4037" />
            {/* Canvas - Voxelated pattern */}
            {Array.from({ length: 6 }).map((_, i) => 
                Array.from({ length: 5 }).map((_, j) => (
                    <VoxelBox
                        key={`${i}-${j}`}
                        position={[(i - 2.5) * 0.25 * scale, 1.8 * scale + (j - 2) * 0.3 * scale, -0.05 * scale]}
                        size={[0.2 * scale, 0.25 * scale, 0.02]}
                        color={color}
                    />
                ))
            )}
        </group>
    );
};

export const Mirror = () => {
    const scale = 1.8;
    return (
        <group>
            {/* Mirror frame - Voxelated */}
            <VoxelBox position={[0, 1.8 * scale, -0.08 * scale]} size={[1.2 * scale, 1.2 * scale, 0.1 * scale]} color="#333" />
            {/* Mirror surface - Voxelated */}
            <VoxelBox position={[0, 1.8 * scale, -0.05 * scale]} size={[1.1 * scale, 1.1 * scale, 0.02]} color="#c0c0c0" />
        </group>
    );
};

export const Plant = ({ color = '#4caf50' }) => {
    const scale = 1.8;
    return (
        <group>
            {/* Pot - Voxelated */}
            <VoxelBox position={[0, 0.25 * scale, 0]} size={[0.5 * scale, 0.5 * scale, 0.5 * scale]} color="#ff7043" />
            {/* Soil */}
            <VoxelBox position={[0, 0.45 * scale, 0]} size={[0.4 * scale, 0.1 * scale, 0.4 * scale]} color="#3e2723" />
            {/* Stem - Voxelated */}
            <VoxelBox position={[0, 0.75 * scale, 0]} size={[0.08 * scale, 0.6 * scale, 0.08 * scale]} color="#388e3c" />
            {/* Leaves - Voxelated */}
            <VoxelBox position={[0, 1.1 * scale, 0]} size={[0.5 * scale, 0.5 * scale, 0.5 * scale]} color={color} />
            <VoxelBox position={[-0.2 * scale, 1.2 * scale, 0]} size={[0.4 * scale, 0.4 * scale, 0.4 * scale]} color={color} />
            <VoxelBox position={[0.2 * scale, 1.2 * scale, 0]} size={[0.4 * scale, 0.4 * scale, 0.4 * scale]} color={color} />
        </group>
    );
};
