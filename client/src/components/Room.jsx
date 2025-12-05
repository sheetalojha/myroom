import React, { useMemo } from 'react';
import * as THREE from 'three';
import useStore from '../store/useStore';

const ROOM_SIZE = 20;
const WALL_HEIGHT = 10;
const WALL_THICKNESS = 1.5; // Thick voxel-style walls
const FLOOR_THICKNESS = 1.5; // Thick floor slab to match walls
const VOXEL_SIZE = 1.0; // Size of each voxel block

// Create a cleaner, subtle noise texture for the walls
const createNoiseTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    const imageData = ctx.createImageData(64, 512);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        // Very subtle noise for a cleaner look
        const noise = Math.random() * 0.03 + 0.985; 
        data[i] = 255 * noise;     // R
        data[i + 1] = 255 * noise; // G
        data[i + 2] = 255 * noise; // B
        data[i + 3] = 255;         // A
    }
    
    ctx.putImageData(imageData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    return texture;
};

// Beautiful Floor Slab - Cleaner look
const ThickFloor = ({ config }) => {
    // Use config colors or defaults
    const floorColor = config?.color || "#8B5A3C"; 
    const floorColor2 = config?.color2 || "#A06647";
    
    // In the image, the floor fits perfectly inside the walls
    // But we want the walls to look like they sit ON or AROUND the floor.
    // Given the isometric view, extending the floor slightly under the walls avoids gaps.
    const floorSize = ROOM_SIZE + WALL_THICKNESS * 2; // Extend to outer edge of walls
    
    return (
        <group position={[0, -FLOOR_THICKNESS / 2, 0]}>
            {/* Main Floor Slab */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <boxGeometry args={[floorSize, floorSize, FLOOR_THICKNESS]} />
                <meshStandardMaterial
                    color={floorColor}
                    roughness={0.8}
                    metalness={0.0}
                />
            </mesh>
        </group>
    );
};


// Styled Wall - Simplified (No steps or windows for now)
const StyledWall = ({ position, rotation, width, height, wallColor, wallTopColor }) => {
    const noiseTexture = useMemo(() => createNoiseTexture(), []);
    
    // We'll build the wall out of columns to allow for future stepping effects
    // The wall extends from -width/2 to +width/2 in its local X axis
    
    const renderColumn = (index, totalColumns) => {
        const x = (index * VOXEL_SIZE) - (width / 2) + (VOXEL_SIZE / 2);
        
        // Simplified: Uniform height for now
        const columnHeight = height;
        
        return (
            <group key={index} position={[x, 0, 0]}>
                 {/* Main Column Body */}
                <mesh position={[0, columnHeight / 2, 0]} castShadow receiveShadow>
                    <boxGeometry args={[VOXEL_SIZE, columnHeight, WALL_THICKNESS]} />
                    <meshStandardMaterial
                        color={wallColor}
                        roughness={0.9}
                        metalness={0.0}
                        map={noiseTexture}
                    />
                </mesh>
                
                {/* Top Cap (Lighter Color) */}
                <mesh position={[0, columnHeight + 0.05, 0]} rotation={[-Math.PI/2, 0, 0]}>
                     <planeGeometry args={[VOXEL_SIZE, WALL_THICKNESS]} />
                     <meshStandardMaterial
                        color={wallTopColor}
                        roughness={0.8}
                        metalness={0.0}
                     />
                </mesh>

                {/* Front Highlight (Simulate Edge Bevel) */}
                <mesh position={[0, columnHeight - 0.1, WALL_THICKNESS/2 + 0.01]}>
                     <planeGeometry args={[VOXEL_SIZE, 0.2]} />
                     <meshStandardMaterial
                        color={wallTopColor}
                        transparent
                        opacity={0.3}
                     />
                </mesh>
            </group>
        );
    };

    const columns = Math.ceil(width / VOXEL_SIZE);

    return (
        <group position={position} rotation={rotation || [0, 0, 0]}>
            {Array.from({ length: columns }).map((_, i) => renderColumn(i, columns))}
        </group>
    );
};

const Room = () => {
    const roomConfig = useStore((state) => state.roomConfig);
    
    // Offsets to align walls perfectly at the corners
    const offset = ROOM_SIZE / 2 + WALL_THICKNESS / 2;
    
    return (
        <group>
            {/* Floor */}
            <ThickFloor config={roomConfig.floor} />
            
            {/* Back Wall (Right in image) - Extends along X */}
            {roomConfig.backWall?.visible !== false && (
                <StyledWall
                    position={[0, 0, -ROOM_SIZE / 2 - WALL_THICKNESS / 2]}
                    width={ROOM_SIZE + WALL_THICKNESS*2} // Extend to cover corner
                    height={WALL_HEIGHT}
                    wallColor={roomConfig.backWall?.color || "#E8E8E5"}
                    wallTopColor={roomConfig.backWall?.topColor || "#F0F0ED"}
                    rotation={[0, 0, 0]} // Along X axis
                />
            )}
            
            {/* Right Wall (Left in image) - Extends along Z */}
            {/* We rotate it 90 deg around Y. It sits at -X. */}
            {roomConfig.rightWall?.visible !== false && (
                 <StyledWall
                    position={[-ROOM_SIZE / 2 - WALL_THICKNESS / 2, 0, 0]}
                    width={ROOM_SIZE + WALL_THICKNESS*2}
                    height={WALL_HEIGHT}
                    wallColor={roomConfig.rightWall?.color || "#D8D8D5"}
                    wallTopColor={roomConfig.rightWall?.topColor || "#E5E5E2"}
                    rotation={[0, Math.PI / 2, 0]} // Along Z axis
                />
            )}
            
            {/* Left Wall - usually hidden in iso view, but keeping config */}
            {roomConfig.leftWall?.visible && (
                <StyledWall
                    position={[ROOM_SIZE / 2 + WALL_THICKNESS / 2, 0, 0]}
                    width={ROOM_SIZE}
                    height={WALL_HEIGHT}
                    wallColor={roomConfig.leftWall?.color}
                    wallTopColor={roomConfig.leftWall?.topColor}
                    rotation={[0, -Math.PI / 2, 0]}
                />
            )}
        </group>
    );
};

export default Room;
