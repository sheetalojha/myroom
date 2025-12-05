import React from 'react';
import { RoundedBox } from '@react-three/drei';

// Voxel helper function with rounded edges for cuter look
const VoxelBox = ({ position, size = [1, 1, 1], color, radius = 0.05 }) => (
    <RoundedBox position={position} args={size} radius={radius} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
    </RoundedBox>
);

export const Rug = ({ color = '#FFE4E1' }) => {
    const scale = 1.8;
    // Create voxelated rug pattern with rounded edges
    return (
        <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            {/* Base rug - made of voxels with rounded edges */}
            {Array.from({ length: 8 }).map((_, i) => 
                Array.from({ length: 8 }).map((_, j) => (
                    <VoxelBox
                        key={`${i}-${j}`}
                        position={[(i - 3.5) * 0.4 * scale, 0, (j - 3.5) * 0.4 * scale]}
                        size={[0.35 * scale, 0.02, 0.35 * scale]}
                        color={color}
                        radius={0.03}
                    />
                ))
            )}
        </group>
    );
};

export const WallArt = ({ color = '#FFD4A3' }) => {
    const scale = 1.8;
    return (
        <group>
            {/* Frame - Voxelated with rounded edges */}
            <VoxelBox position={[0, 1.8 * scale, -0.08 * scale]} size={[1.8 * scale, 2.2 * scale, 0.1 * scale]} color="#8B6F47" radius={0.06} />
            {/* Canvas - Voxelated pattern with rounded edges */}
            {Array.from({ length: 6 }).map((_, i) => 
                Array.from({ length: 5 }).map((_, j) => (
                    <VoxelBox
                        key={`${i}-${j}`}
                        position={[(i - 2.5) * 0.25 * scale, 1.8 * scale + (j - 2) * 0.3 * scale, -0.05 * scale]}
                        size={[0.2 * scale, 0.25 * scale, 0.02]}
                        color={color}
                        radius={0.02}
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
            {/* Mirror frame - Voxelated with rounded edges */}
            <VoxelBox position={[0, 1.8 * scale, -0.08 * scale]} size={[1.2 * scale, 1.2 * scale, 0.1 * scale]} color="#8B6F47" radius={0.08} />
            {/* Mirror surface - Voxelated with rounded edges */}
            <VoxelBox position={[0, 1.8 * scale, -0.05 * scale]} size={[1.1 * scale, 1.1 * scale, 0.02]} color="#E0E0E0" radius={0.06} />
        </group>
    );
};

export const Plant = ({ color = '#90EE90' }) => {
    const scale = 1.8;
    return (
        <group>
            {/* Pot - Voxelated with rounded edges */}
            <VoxelBox position={[0, 0.25 * scale, 0]} size={[0.5 * scale, 0.5 * scale, 0.5 * scale]} color="#FFB6C1" radius={0.1} />
            {/* Soil */}
            <VoxelBox position={[0, 0.45 * scale, 0]} size={[0.4 * scale, 0.1 * scale, 0.4 * scale]} color="#8B6F47" radius={0.08} />
            {/* Stem - Voxelated with rounded edges */}
            <VoxelBox position={[0, 0.75 * scale, 0]} size={[0.08 * scale, 0.6 * scale, 0.08 * scale]} color="#66BB6A" radius={0.04} />
            {/* Leaves - Voxelated with rounded edges */}
            <VoxelBox position={[0, 1.1 * scale, 0]} size={[0.5 * scale, 0.5 * scale, 0.5 * scale]} color={color} radius={0.2} />
            <VoxelBox position={[-0.2 * scale, 1.2 * scale, 0]} size={[0.4 * scale, 0.4 * scale, 0.4 * scale]} color={color} radius={0.15} />
            <VoxelBox position={[0.2 * scale, 1.2 * scale, 0]} size={[0.4 * scale, 0.4 * scale, 0.4 * scale]} color={color} radius={0.15} />
        </group>
    );
};
