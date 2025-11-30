import React, { useMemo } from 'react';
import * as THREE from 'three';

const ROOM_SIZE = 20;
const WALL_HEIGHT = 10;
const WALL_THICKNESS = 1.5; // Thick voxel-style walls
const FLOOR_THICKNESS = 1.0; // Thick floor slab
const VOXEL_SIZE = 0.5; // Size of each voxel block for stepped walls
const GRID_DIVISIONS = 20; // 1x1 grid cells for coordinate placement

// Create noise texture for walls
const createNoiseTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    const imageData = ctx.createImageData(256, 256);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 0.1 + 0.95; // Subtle noise (0.95-1.05)
        data[i] = 255 * noise;     // R
        data[i + 1] = 255 * noise; // G
        data[i + 2] = 255 * noise; // B
        data[i + 3] = 255;         // A
    }
    
    ctx.putImageData(imageData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
};

// Thick Floor Slab with Dark Chocolate Wood
const ThickFloor = () => {
    const plankWidth = 1.0;
    // Extend floor to cover under walls
    const floorExtend = WALL_THICKNESS;
    const floorSize = ROOM_SIZE + floorExtend * 2;
    const planks = Math.ceil(floorSize / plankWidth);
    const darkWoodColor = "#3E2723"; // Dark chocolate brown
    
    return (
        <group>
            {/* Thick floor slab - bottom */}
            <mesh 
                rotation={[-Math.PI / 2, 0, 0]} 
                position={[0, -FLOOR_THICKNESS / 2, 0]} 
                castShadow
                receiveShadow
            >
                <boxGeometry args={[floorSize, floorSize, FLOOR_THICKNESS]} />
                <meshStandardMaterial
                    color="#2C1810"
                    roughness={0.9}
                    metalness={0.0}
                />
            </mesh>
            
            {/* Top surface - dark chocolate wood planks */}
            {Array.from({ length: planks }).map((_, i) => {
                const x = (i * plankWidth) - (floorSize / 2) + (plankWidth / 2);
                return (
                    <mesh
                        key={i}
                        rotation={[-Math.PI / 2, 0, 0]}
                        position={[x, 0.001, 0]}
                        receiveShadow
                        castShadow
                    >
                        <planeGeometry args={[plankWidth - 0.02, floorSize]} />
                        <meshStandardMaterial
                            color={i % 2 === 0 ? darkWoodColor : "#2E1F1A"}
                            roughness={0.85}
                            metalness={0.0}
                        />
                    </mesh>
                );
            })}
            
            {/* Plank grain lines - darker */}
            {Array.from({ length: planks }).map((_, i) => {
                const x = (i * plankWidth) - (floorSize / 2);
                return (
                    <line key={`grain-${i}`}>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                count={2}
                                array={new Float32Array([
                                    x, 0.002, -floorSize / 2,
                                    x, 0.002, floorSize / 2
                                ])}
                                itemSize={3}
                            />
                        </bufferGeometry>
                        <lineBasicMaterial color="#1A0F0A" transparent opacity={0.4} />
                    </line>
                );
            })}
        </group>
    );
};

// Floor Grid Component - Subtle coordinate system
const FloorGrid = () => {
    // Extend grid to match extended floor
    const floorExtend = WALL_THICKNESS;
    const gridSize = ROOM_SIZE + floorExtend * 2;
    const divisions = GRID_DIVISIONS;
    const cellSize = gridSize / divisions;

    const gridGeometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];

        for (let i = 0; i <= divisions; i++) {
            const pos = (i * cellSize) - (gridSize / 2);
            
            vertices.push(-gridSize / 2, 0.003, pos);
            vertices.push(gridSize / 2, 0.003, pos);
            
            vertices.push(pos, 0.003, -gridSize / 2);
            vertices.push(pos, 0.003, gridSize / 2);
        }

        geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(vertices, 3)
        );
        return geometry;
    }, [cellSize, divisions, gridSize]);

    return (
        <group>
            <lineSegments geometry={gridGeometry}>
                <lineBasicMaterial
                    color="#2C1810"
                    transparent
                    opacity={0.15}
                />
            </lineSegments>
            
            {/* Major grid lines */}
            {Array.from({ length: Math.floor(divisions / 5) + 1 }).map((_, i) => {
                const pos = (i * 5 * cellSize) - (gridSize / 2);
                return (
                    <group key={`major-${i}`}>
                        <line>
                            <bufferGeometry>
                                <bufferAttribute
                                    attach="attributes-position"
                                    count={2}
                                    array={new Float32Array([
                                        -gridSize / 2, 0.004, pos,
                                        gridSize / 2, 0.004, pos
                                    ])}
                                    itemSize={3}
                                />
                            </bufferGeometry>
                            <lineBasicMaterial color="#1A0F0A" transparent opacity={0.3} />
                        </line>
                        <line>
                            <bufferGeometry>
                                <bufferAttribute
                                    attach="attributes-position"
                                    count={2}
                                    array={new Float32Array([
                                        pos, 0.004, -gridSize / 2,
                                        pos, 0.004, gridSize / 2
                                    ])}
                                    itemSize={3}
                                />
                            </bufferGeometry>
                            <lineBasicMaterial color="#1A0F0A" transparent opacity={0.3} />
                        </line>
                    </group>
                );
            })}
            
            {/* Origin marker */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
                <ringGeometry args={[0.15, 0.2, 16]} />
                <meshBasicMaterial color="#1A0F0A" transparent opacity={0.5} />
            </mesh>
        </group>
    );
};

// Voxel Wall - Stacked blocks for stepped/jagged top
const VoxelWall = ({ position, rotation, width, height, wallColor }) => {
    const noiseTexture = useMemo(() => createNoiseTexture(), []);
    const voxelsPerWidth = Math.ceil(width / VOXEL_SIZE);
    
    // Create stepped top pattern (jagged like stairs)
    const createSteppedTop = (voxelIndex) => {
        // Create a pattern: some voxels are taller, creating steps
        const stepPattern = Math.sin(voxelIndex * 0.3) * 0.5 + 0.5; // 0 to 1
        return stepPattern > 0.6 ? 1 : 0; // Some voxels are 1 block taller
    };
    
    return (
        <group position={position} rotation={rotation || [0, 0, 0]}>
            {/* Main wall body - thick box */}
            <mesh receiveShadow castShadow>
                <boxGeometry args={[width, height, WALL_THICKNESS]} />
                <meshStandardMaterial
                    color={wallColor}
                    roughness={0.95}
                    metalness={0.0}
                    map={noiseTexture}
                />
            </mesh>
            
            {/* Stepped top - stacked voxel blocks */}
            {Array.from({ length: voxelsPerWidth }).map((_, i) => {
                const x = (i * VOXEL_SIZE) - (width / 2) + (VOXEL_SIZE / 2);
                const extraHeight = createSteppedTop(i) * VOXEL_SIZE;
                
                return (
                    <mesh
                        key={`top-${i}`}
                        position={[x, height / 2 + extraHeight / 2, 0]}
                        castShadow
                    >
                        <boxGeometry args={[VOXEL_SIZE - 0.05, extraHeight || VOXEL_SIZE, WALL_THICKNESS]} />
                        <meshStandardMaterial
                            color={wallColor}
                            roughness={0.95}
                            metalness={0.0}
                            map={noiseTexture}
                        />
                    </mesh>
                );
            })}
            
            {/* Inner face with texture */}
            <mesh position={[0, 0, WALL_THICKNESS / 2]} receiveShadow>
                <planeGeometry args={[width, height]} />
                <meshStandardMaterial
                    color={wallColor}
                    roughness={0.95}
                    metalness={0.0}
                    map={noiseTexture}
                />
            </mesh>
        </group>
    );
};

// Back Wall with Window - Voxel style
const BackWall = () => {
    const wallColor = "#F5F5F0";
    const windowWidth = 4;
    const windowHeight = 3;
    const windowY = 2;
    // Extend wall to match extended floor
    const floorExtend = WALL_THICKNESS;
    const extendedRoomSize = ROOM_SIZE + floorExtend * 2;
    const wallZ = -extendedRoomSize / 2 - WALL_THICKNESS / 2;
    
    return (
        <group position={[0, WALL_HEIGHT / 2, wallZ]}>
            <VoxelWall
                position={[0, 0, 0]}
                width={extendedRoomSize}
                height={WALL_HEIGHT}
                wallColor={wallColor}
            />
            
            {/* Window opening */}
            <mesh position={[0, windowY - WALL_HEIGHT / 2, WALL_THICKNESS / 2 + 0.01]} castShadow>
                <boxGeometry args={[windowWidth + 0.3, windowHeight + 0.3, 0.2]} />
                <meshStandardMaterial color="#D4C5B9" roughness={0.8} />
            </mesh>
            
            {/* Window glass */}
            <mesh position={[0, windowY - WALL_HEIGHT / 2, WALL_THICKNESS / 2 + 0.11]}>
                <planeGeometry args={[windowWidth, windowHeight]} />
                <meshStandardMaterial
                    color="#E8F4F8"
                    transparent
                    opacity={0.7}
                    roughness={0.1}
                    metalness={0.1}
                />
            </mesh>
            
            {/* Window view */}
            <mesh position={[0, windowY - WALL_HEIGHT / 2, WALL_THICKNESS / 2 + 0.12]}>
                <planeGeometry args={[windowWidth - 0.1, windowHeight - 0.1]} />
                <meshStandardMaterial color="#87CEEB" />
            </mesh>
            <mesh position={[0, windowY - WALL_HEIGHT / 2 + 0.5, WALL_THICKNESS / 2 + 0.13]}>
                <planeGeometry args={[windowWidth - 0.1, (windowHeight - 0.1) * 0.6]} />
                <meshStandardMaterial color="#E0F6FF" transparent opacity={0.8} />
            </mesh>
            <mesh position={[0, windowY - WALL_HEIGHT / 2 - 0.8, WALL_THICKNESS / 2 + 0.13]}>
                <planeGeometry args={[windowWidth - 0.1, (windowHeight - 0.1) * 0.4]} />
                <meshStandardMaterial color="#228B22" />
            </mesh>
        </group>
    );
};

// Right Wall - Voxel style with stepped border
const RightWall = () => {
    const wallColor = "#B8C5D6";
    // Extend wall to match extended floor
    const floorExtend = WALL_THICKNESS;
    const extendedRoomSize = ROOM_SIZE + floorExtend * 2;
    const wallX = -extendedRoomSize / 2 - WALL_THICKNESS / 2;
    
    return (
        <group position={[wallX, WALL_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
            <VoxelWall
                position={[0, 0, 0]}
                width={extendedRoomSize}
                height={WALL_HEIGHT}
                wallColor={wallColor}
            />
        </group>
    );
};

// Front Wall (Bottom wall in isometric view) - Voxel style
const FrontWall = () => {
    const wallColor = "#F5F5F0"; // Same as back wall
    const wallZ = ROOM_SIZE / 2 + WALL_THICKNESS / 2;
    
    return (
        <group position={[0, WALL_HEIGHT / 2, wallZ]}>
            <VoxelWall
                position={[0, 0, 0]}
                width={ROOM_SIZE}
                height={WALL_HEIGHT}
                wallColor={wallColor}
            />
        </group>
    );
};

// Corner detail - Voxel style
const CornerDetail = () => {
    // Extend corner to match extended floor
    const floorExtend = WALL_THICKNESS;
    const extendedRoomSize = ROOM_SIZE + floorExtend * 2;
    const cornerX = -extendedRoomSize / 2 - WALL_THICKNESS / 2;
    const cornerZ = -extendedRoomSize / 2 - WALL_THICKNESS / 2;
    
    return (
        <group position={[cornerX, WALL_HEIGHT / 2, cornerZ]}>
            <mesh castShadow>
                <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, WALL_THICKNESS]} />
                <meshStandardMaterial color="#9AABC6" roughness={0.7} />
            </mesh>
        </group>
    );
};

const Room = () => {
    return (
        <group>
            {/* Thick Floor Slab */}
            <ThickFloor />
            
            {/* Floor Grid */}
            <FloorGrid />
            
            {/* Back Wall with Window - Voxel style */}
            <BackWall />
            
            {/* Right Wall - Voxel style */}
            <RightWall />
            
            {/* Corner Details */}
            <CornerDetail />
        </group>
    );
};

export default Room;
