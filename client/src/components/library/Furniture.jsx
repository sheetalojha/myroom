import React from 'react';
import { RoundedBox } from '@react-three/drei';

// Voxel helper function with rounded edges for cuter look
const VoxelBox = ({ position, size = [1, 1, 1], color, radius = 0.05 }) => (
    <RoundedBox position={position} args={size} radius={radius} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
    </RoundedBox>
);

export const Bed = ({ color = '#FFB6C1' }) => {
    const scale = 1.8; // Increased size
    return (
        <group>
            {/* Frame - Voxelated with rounded edges */}
            <VoxelBox position={[0, 0.3 * scale, 0]} size={[3.6 * scale, 0.6 * scale, 5.4 * scale]} color="#8B6F47" radius={0.08} />
            {/* Mattress */}
            <VoxelBox position={[0, 0.7 * scale, 0]} size={[3.4 * scale, 0.4 * scale, 5.2 * scale]} color="#FFF8F0" radius={0.1} />
            {/* Blanket - cute pastel color */}
            <VoxelBox position={[0, 0.8 * scale, 0.8 * scale]} size={[3.5 * scale, 0.4 * scale, 3.4 * scale]} color={color} radius={0.1} />
            {/* Pillow - soft pink */}
            <VoxelBox position={[0, 1 * scale, -2.2 * scale]} size={[2.7 * scale, 0.3 * scale, 0.9 * scale]} color="#FFE4E1" radius={0.12} />
        </group>
    );
};

export const Sofa = ({ color = '#B8E6B8' }) => {
    const scale = 1.8;
    return (
        <group>
            {/* Base - Voxelated with rounded edges */}
            <VoxelBox position={[0, 0.3 * scale, 0]} size={[4.5 * scale, 0.6 * scale, 1.8 * scale]} color={color} radius={0.1} />
            {/* Back */}
            <VoxelBox position={[0, 0.9 * scale, -0.7 * scale]} size={[4.5 * scale, 1.2 * scale, 0.4 * scale]} color={color} radius={0.08} />
            {/* Arms */}
            <VoxelBox position={[-2.1 * scale, 0.6 * scale, 0]} size={[0.4 * scale, 0.6 * scale, 1.8 * scale]} color={color} radius={0.08} />
            <VoxelBox position={[2.1 * scale, 0.6 * scale, 0]} size={[0.4 * scale, 0.6 * scale, 1.8 * scale]} color={color} radius={0.08} />
        </group>
    );
};

export const Table = ({ color = '#D4A574' }) => {
    const scale = 1.8;
    return (
        <group>
            {/* Top - Voxelated with rounded edges */}
            <VoxelBox position={[0, 0.8 * scale, 0]} size={[2.7 * scale, 0.2 * scale, 2.7 * scale]} color={color} radius={0.12} />
            {/* Legs - Voxelated with rounded edges */}
            <VoxelBox position={[-1.1 * scale, 0.4 * scale, -1.1 * scale]} size={[0.15 * scale, 0.8 * scale, 0.15 * scale]} color="#8B6F47" radius={0.06} />
            <VoxelBox position={[1.1 * scale, 0.4 * scale, -1.1 * scale]} size={[0.15 * scale, 0.8 * scale, 0.15 * scale]} color="#8B6F47" radius={0.06} />
            <VoxelBox position={[-1.1 * scale, 0.4 * scale, 1.1 * scale]} size={[0.15 * scale, 0.8 * scale, 0.15 * scale]} color="#8B6F47" radius={0.06} />
            <VoxelBox position={[1.1 * scale, 0.4 * scale, 1.1 * scale]} size={[0.15 * scale, 0.8 * scale, 0.15 * scale]} color="#8B6F47" radius={0.06} />
        </group>
    );
};

export const Chair = ({ color = '#FFD4A3' }) => {
    const scale = 1.8;
    return (
        <group>
            {/* Seat - Voxelated with rounded edges */}
            <VoxelBox position={[0, 0.5 * scale, 0]} size={[0.9 * scale, 0.1 * scale, 0.9 * scale]} color={color} radius={0.08} />
            {/* Back */}
            <VoxelBox position={[0, 1.1 * scale, -0.4 * scale]} size={[0.9 * scale, 0.6 * scale, 0.1 * scale]} color={color} radius={0.08} />
            {/* Legs - Voxelated with rounded edges */}
            <VoxelBox position={[-0.36 * scale, 0.25 * scale, -0.36 * scale]} size={[0.08 * scale, 0.5 * scale, 0.08 * scale]} color="#8B6F47" radius={0.04} />
            <VoxelBox position={[0.36 * scale, 0.25 * scale, -0.36 * scale]} size={[0.08 * scale, 0.5 * scale, 0.08 * scale]} color="#8B6F47" radius={0.04} />
            <VoxelBox position={[-0.36 * scale, 0.25 * scale, 0.36 * scale]} size={[0.08 * scale, 0.5 * scale, 0.08 * scale]} color="#8B6F47" radius={0.04} />
            <VoxelBox position={[0.36 * scale, 0.25 * scale, 0.36 * scale]} size={[0.08 * scale, 0.5 * scale, 0.08 * scale]} color="#8B6F47" radius={0.04} />
        </group>
    );
};

export const Bookshelf = ({ color = '#A67C52' }) => {
    const scale = 1.8;
    return (
        <group>
            {/* Frame - Voxelated with rounded edges */}
            <VoxelBox position={[0, 1.2 * scale, 0]} size={[2.2 * scale, 3.6 * scale, 0.7 * scale]} color={color} radius={0.06} />
            {/* Shelves - Voxelated */}
            <VoxelBox position={[0, 0.9 * scale, 0]} size={[2 * scale, 0.1 * scale, 0.7 * scale]} color="#8B6F47" radius={0.05} />
            <VoxelBox position={[0, 1.8 * scale, 0]} size={[2 * scale, 0.1 * scale, 0.7 * scale]} color="#8B6F47" radius={0.05} />
            <VoxelBox position={[0, 2.7 * scale, 0]} size={[2 * scale, 0.1 * scale, 0.7 * scale]} color="#8B6F47" radius={0.05} />
            {/* Books - Voxelated with cute pastel colors */}
            <VoxelBox position={[-0.5 * scale, 2.1 * scale, 0]} size={[0.2 * scale, 0.45 * scale, 0.5 * scale]} color="#FFB6C1" radius={0.03} />
            <VoxelBox position={[-0.25 * scale, 2.1 * scale, 0]} size={[0.2 * scale, 0.4 * scale, 0.5 * scale]} color="#B8E6FF" radius={0.03} />
            <VoxelBox position={[0, 2.1 * scale, 0]} size={[0.2 * scale, 0.42 * scale, 0.5 * scale]} color="#B8E6B8" radius={0.03} />
            <VoxelBox position={[0.25 * scale, 2.1 * scale, 0]} size={[0.2 * scale, 0.38 * scale, 0.5 * scale]} color="#FFD4A3" radius={0.03} />
        </group>
    );
};
