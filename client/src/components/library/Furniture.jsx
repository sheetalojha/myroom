import React from 'react';

// Voxel helper function
const VoxelBox = ({ position, size = [1, 1, 1], color }) => (
    <mesh position={position}>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} />
    </mesh>
);

export const Bed = ({ color = '#ffffff' }) => {
    const scale = 1.8; // Increased size
    return (
        <group>
            {/* Frame - Voxelated */}
            <VoxelBox position={[0, 0.3 * scale, 0]} size={[3.6 * scale, 0.6 * scale, 5.4 * scale]} color="#5d4037" />
            {/* Mattress */}
            <VoxelBox position={[0, 0.7 * scale, 0]} size={[3.4 * scale, 0.4 * scale, 5.2 * scale]} color="white" />
            {/* Blanket */}
            <VoxelBox position={[0, 0.8 * scale, 0.8 * scale]} size={[3.5 * scale, 0.4 * scale, 3.4 * scale]} color={color} />
            {/* Pillow */}
            <VoxelBox position={[0, 1 * scale, -2.2 * scale]} size={[2.7 * scale, 0.3 * scale, 0.9 * scale]} color="#eeeeee" />
        </group>
    );
};

export const Sofa = ({ color = '#78909c' }) => {
    const scale = 1.8;
    return (
        <group>
            {/* Base - Voxelated */}
            <VoxelBox position={[0, 0.3 * scale, 0]} size={[4.5 * scale, 0.6 * scale, 1.8 * scale]} color={color} />
            {/* Back */}
            <VoxelBox position={[0, 0.9 * scale, -0.7 * scale]} size={[4.5 * scale, 1.2 * scale, 0.4 * scale]} color={color} />
            {/* Arms */}
            <VoxelBox position={[-2.1 * scale, 0.6 * scale, 0]} size={[0.4 * scale, 0.6 * scale, 1.8 * scale]} color={color} />
            <VoxelBox position={[2.1 * scale, 0.6 * scale, 0]} size={[0.4 * scale, 0.6 * scale, 1.8 * scale]} color={color} />
        </group>
    );
};

export const Table = ({ color = '#8d6e63' }) => {
    const scale = 1.8;
    return (
        <group>
            {/* Top - Voxelated */}
            <VoxelBox position={[0, 0.8 * scale, 0]} size={[2.7 * scale, 0.2 * scale, 2.7 * scale]} color={color} />
            {/* Legs - Voxelated */}
            <VoxelBox position={[-1.1 * scale, 0.4 * scale, -1.1 * scale]} size={[0.15 * scale, 0.8 * scale, 0.15 * scale]} color="#5d4037" />
            <VoxelBox position={[1.1 * scale, 0.4 * scale, -1.1 * scale]} size={[0.15 * scale, 0.8 * scale, 0.15 * scale]} color="#5d4037" />
            <VoxelBox position={[-1.1 * scale, 0.4 * scale, 1.1 * scale]} size={[0.15 * scale, 0.8 * scale, 0.15 * scale]} color="#5d4037" />
            <VoxelBox position={[1.1 * scale, 0.4 * scale, 1.1 * scale]} size={[0.15 * scale, 0.8 * scale, 0.15 * scale]} color="#5d4037" />
        </group>
    );
};

export const Chair = ({ color = '#ffcc80' }) => {
    const scale = 1.8;
    return (
        <group>
            {/* Seat - Voxelated */}
            <VoxelBox position={[0, 0.5 * scale, 0]} size={[0.9 * scale, 0.1 * scale, 0.9 * scale]} color={color} />
            {/* Back */}
            <VoxelBox position={[0, 1.1 * scale, -0.4 * scale]} size={[0.9 * scale, 0.6 * scale, 0.1 * scale]} color={color} />
            {/* Legs - Voxelated */}
            <VoxelBox position={[-0.36 * scale, 0.25 * scale, -0.36 * scale]} size={[0.08 * scale, 0.5 * scale, 0.08 * scale]} color="#5d4037" />
            <VoxelBox position={[0.36 * scale, 0.25 * scale, -0.36 * scale]} size={[0.08 * scale, 0.5 * scale, 0.08 * scale]} color="#5d4037" />
            <VoxelBox position={[-0.36 * scale, 0.25 * scale, 0.36 * scale]} size={[0.08 * scale, 0.5 * scale, 0.08 * scale]} color="#5d4037" />
            <VoxelBox position={[0.36 * scale, 0.25 * scale, 0.36 * scale]} size={[0.08 * scale, 0.5 * scale, 0.08 * scale]} color="#5d4037" />
        </group>
    );
};

export const Bookshelf = ({ color = '#5d4037' }) => {
    const scale = 1.8;
    return (
        <group>
            {/* Frame - Voxelated */}
            <VoxelBox position={[0, 1.2 * scale, 0]} size={[2.2 * scale, 3.6 * scale, 0.7 * scale]} color={color} />
            {/* Shelves - Voxelated */}
            <VoxelBox position={[0, 0.9 * scale, 0]} size={[2 * scale, 0.1 * scale, 0.7 * scale]} color="#4e342e" />
            <VoxelBox position={[0, 1.8 * scale, 0]} size={[2 * scale, 0.1 * scale, 0.7 * scale]} color="#4e342e" />
            <VoxelBox position={[0, 2.7 * scale, 0]} size={[2 * scale, 0.1 * scale, 0.7 * scale]} color="#4e342e" />
            {/* Books - Voxelated */}
            <VoxelBox position={[-0.5 * scale, 2.1 * scale, 0]} size={[0.2 * scale, 0.45 * scale, 0.5 * scale]} color="#e53935" />
            <VoxelBox position={[-0.25 * scale, 2.1 * scale, 0]} size={[0.2 * scale, 0.4 * scale, 0.5 * scale]} color="#1e88e5" />
            <VoxelBox position={[0, 2.1 * scale, 0]} size={[0.2 * scale, 0.42 * scale, 0.5 * scale]} color="#43a047" />
            <VoxelBox position={[0.25 * scale, 2.1 * scale, 0]} size={[0.2 * scale, 0.38 * scale, 0.5 * scale]} color="#fb8c00" />
        </group>
    );
};
