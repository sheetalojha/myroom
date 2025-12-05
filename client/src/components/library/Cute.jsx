import React from 'react';
import { RoundedBox } from '@react-three/drei';

// Voxel helper function with rounded edges for cuter look
const VoxelBox = ({ position, size = [1, 1, 1], color, radius = 0.05 }) => (
    <RoundedBox position={position} args={size} radius={radius} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.05} />
    </RoundedBox>
);

export const Plushie = ({ color = '#FFB6C1' }) => {
    const scale = 1.8;
    return (
        <group>
            {/* Body - Voxelated with very rounded edges */}
            <VoxelBox position={[0, 0.25 * scale, 0]} size={[0.4 * scale, 0.4 * scale, 0.4 * scale]} color={color} radius={0.15} />
            {/* Head */}
            <VoxelBox position={[0, 0.55 * scale, 0]} size={[0.3 * scale, 0.3 * scale, 0.3 * scale]} color={color} radius={0.12} />
            {/* Ears - cute rounded ears */}
            <VoxelBox position={[-0.15 * scale, 0.65 * scale, 0]} size={[0.15 * scale, 0.15 * scale, 0.1 * scale]} color={color} radius={0.08} />
            <VoxelBox position={[0.15 * scale, 0.65 * scale, 0]} size={[0.15 * scale, 0.15 * scale, 0.1 * scale]} color={color} radius={0.08} />
            {/* Eyes - cute big eyes */}
            <VoxelBox position={[-0.08 * scale, 0.55 * scale, 0.16 * scale]} size={[0.06 * scale, 0.06 * scale, 0.02]} color="#000" radius={0.03} />
            <VoxelBox position={[0.08 * scale, 0.55 * scale, 0.16 * scale]} size={[0.06 * scale, 0.06 * scale, 0.02]} color="#000" radius={0.03} />
            {/* Nose - tiny pink nose */}
            <VoxelBox position={[0, 0.52 * scale, 0.16 * scale]} size={[0.03 * scale, 0.03 * scale, 0.01]} color="#FF69B4" radius={0.02} />
        </group>
    );
};

export const Mug = ({ color = '#FFE4E1' }) => {
    const scale = 1.8;
    return (
        <group>
            {/* Cup body - Voxelated with rounded edges */}
            <VoxelBox position={[0, 0.15 * scale, 0]} size={[0.2 * scale, 0.3 * scale, 0.2 * scale]} color={color} radius={0.08} />
            {/* Handle - Voxelated with rounded edges */}
            <VoxelBox position={[0.15 * scale, 0.15 * scale, 0]} size={[0.08 * scale, 0.25 * scale, 0.08 * scale]} color={color} radius={0.04} />
            {/* Steam - cute detail */}
            <mesh position={[0, 0.35 * scale, 0]} rotation={[0, 0, 0]}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshStandardMaterial color="#E0E0E0" transparent opacity={0.6} />
            </mesh>
            <mesh position={[-0.03, 0.38 * scale, 0]} rotation={[0, 0, 0]}>
                <sphereGeometry args={[0.015, 8, 8]} />
                <meshStandardMaterial color="#E0E0E0" transparent opacity={0.5} />
            </mesh>
            <mesh position={[0.03, 0.38 * scale, 0]} rotation={[0, 0, 0]}>
                <sphereGeometry args={[0.015, 8, 8]} />
                <meshStandardMaterial color="#E0E0E0" transparent opacity={0.5} />
            </mesh>
        </group>
    );
};
