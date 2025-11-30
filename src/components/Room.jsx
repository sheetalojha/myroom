import React, { useMemo } from 'react';
import * as THREE from 'three';
import useStore from '../store/useStore';

const ROOM_SIZE = 20;
const WALL_HEIGHT = 10;
const WALL_THICKNESS = 1.5; // Thick voxel-style walls
const FLOOR_THICKNESS = 1.0; // Thick floor slab
const VOXEL_SIZE = 1.0; // Size of each voxel block - chunkier blocks
const GRID_DIVISIONS = 20; // 1x1 grid cells for coordinate placement

// Create vertical noise texture for walls - continuous vertical pattern
const createNoiseTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 512; // Taller for vertical continuity
    const ctx = canvas.getContext('2d');
    
    const imageData = ctx.createImageData(64, 512);
    const data = imageData.data;
    
    // Create vertical noise pattern - continuous vertically
    for (let y = 0; y < 512; y++) {
        for (let x = 0; x < 64; x++) {
            const index = (y * 64 + x) * 4;
            const noise = Math.random() * 0.08 + 0.96; // Subtle noise (0.96-1.04)
            data[index] = 255 * noise;     // R
            data[index + 1] = 255 * noise; // G
            data[index + 2] = 255 * noise; // B
            data[index + 3] = 255;         // A
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1); // No repeating, use full texture
    return texture;
};

// Thick Floor Slab with Medium Oak/Chestnut Wood
const ThickFloor = ({ config }) => {
    const plankWidth = 1.0;
    // Extend floor to cover under walls
    const floorExtend = WALL_THICKNESS;
    const floorSize = ROOM_SIZE + floorExtend * 2;
    const planks = Math.ceil(floorSize / plankWidth);
    // Use config colors or defaults
    const woodColor1 = config?.color || "#8B5A3C"; // Medium chestnut
    const woodColor2 = config?.color2 || "#A06647"; // Lighter chestnut
    
    return (
        <group>
            {/* Thick floor slab - bottom */}
            <mesh 
                rotation={[-Math.PI / 2, 0, 0]} 
                position={[0, -FLOOR_THICKNESS / 2, 0]} 
            >
                <boxGeometry args={[floorSize, floorSize, FLOOR_THICKNESS]} />
                <meshStandardMaterial
                    color="#7A4F35"
                    roughness={0.85}
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
                    >
                        <planeGeometry args={[plankWidth - 0.02, floorSize]} />
                        <meshStandardMaterial
                            color={i % 2 === 0 ? woodColor1 : woodColor2}
                            roughness={0.8}
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
const VoxelWall = ({ position, rotation, width, height, wallColor, wallTopColor }) => {
    const noiseTexture = useMemo(() => createNoiseTexture(), []);
    const voxelsPerWidth = Math.ceil(width / VOXEL_SIZE);
    
    // Create stepped top pattern (jagged like stairs) - chunkier blocks
    const createSteppedTop = (voxelIndex) => {
        // Create a pattern: some voxels are taller, creating steps
        const stepPattern = Math.sin(voxelIndex * 0.2) * 0.5 + 0.5; // 0 to 1
        return stepPattern > 0.6 ? 1 : 0; // Some voxels are 1 block taller
    };
    
    return (
        <group position={position} rotation={rotation || [0, 0, 0]}>
            {/* Main wall body - thick box */}
            <mesh>
                <boxGeometry args={[width, height, WALL_THICKNESS]} />
                <meshStandardMaterial
                    color={wallColor}
                    roughness={0.9}
                    metalness={0.0}
                    map={noiseTexture}
                />
            </mesh>
            
            {/* Stepped top - chunkier voxel blocks */}
            {Array.from({ length: voxelsPerWidth }).map((_, i) => {
                const x = (i * VOXEL_SIZE) - (width / 2) + (VOXEL_SIZE / 2);
                const extraHeight = createSteppedTop(i) * VOXEL_SIZE;
                const blockHeight = extraHeight || VOXEL_SIZE;
                
                return (
                    <group key={`top-${i}`} position={[x, height / 2 + blockHeight / 2, 0]}>
                        {/* Top face - lighter color */}
                        <mesh
                            position={[0, blockHeight / 2, 0]}
                            rotation={[Math.PI / 2, 0, 0]}
                        >
                            <planeGeometry args={[VOXEL_SIZE - 0.02, WALL_THICKNESS]} />
                            <meshStandardMaterial
                                color={wallTopColor || wallColor}
                                roughness={0.85}
                                metalness={0.0}
                            />
                        </mesh>
                        
                        {/* Side block - with proper UV mapping */}
                        <mesh>
                            <boxGeometry args={[VOXEL_SIZE - 0.02, blockHeight, WALL_THICKNESS]} />
                            <meshStandardMaterial
                                color={wallColor}
                                roughness={0.9}
                                metalness={0.0}
                                map={noiseTexture}
                            />
                        </mesh>
                    </group>
                );
            })}
            
            {/* Inner face with texture */}
            <mesh position={[0, 0, WALL_THICKNESS / 2]}>
                <planeGeometry args={[width, height]} />
                <meshStandardMaterial
                    color={wallColor}
                    roughness={0.9}
                    metalness={0.0}
                    map={noiseTexture}
                />
            </mesh>
        </group>
    );
};

// Back Wall with Window - Voxel style
const BackWall = ({ config }) => {
    const wallColor = config?.color || "#E8E8E5";
    const wallTopColor = config?.topColor || "#F0F0ED";
    const visible = config?.visible !== false;
    const windowWidth = 4;
    const windowHeight = 3;
    const windowY = 2;
    
    if (!visible) return null;
    
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
                wallTopColor={wallTopColor}
            />
            
            {/* Window opening */}
            <mesh position={[0, windowY - WALL_HEIGHT / 2, WALL_THICKNESS / 2 + 0.01]}>
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
const RightWall = ({ config }) => {
    const wallColor = config?.color || "#D8D8D5";
    const wallTopColor = config?.topColor || "#E5E5E2";
    const visible = config?.visible !== false;
    
    if (!visible) return null;
    
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
                wallTopColor={wallTopColor}
            />
        </group>
    );
};

// Left Wall - Voxel style with stepped border
const LeftWall = ({ config }) => {
    const wallColor = config?.color || "#D8D8D5";
    const wallTopColor = config?.topColor || "#E5E5E2";
    const visible = config?.visible !== false;
    
    if (!visible) return null;
    
    // Extend wall to match extended floor
    const floorExtend = WALL_THICKNESS;
    const extendedRoomSize = ROOM_SIZE + floorExtend * 2;
    const wallX = extendedRoomSize / 2 + WALL_THICKNESS / 2;
    
    return (
        <group position={[wallX, WALL_HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <VoxelWall
                position={[0, 0, 0]}
                width={extendedRoomSize}
                height={WALL_HEIGHT}
                wallColor={wallColor}
                wallTopColor={wallTopColor}
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
            <mesh>
                <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, WALL_THICKNESS]} />
                <meshStandardMaterial color="#9AABC6" roughness={0.7} />
            </mesh>
        </group>
    );
};

const Room = () => {
    const roomConfig = useStore((state) => state.roomConfig);
    
    return (
        <group>
            {/* Thick Floor Slab */}
            <ThickFloor config={roomConfig.floor} />
            
            {/* Floor Grid */}
            <FloorGrid />
            
            {/* Back Wall with Window - Voxel style */}
            <BackWall config={roomConfig.backWall} />
            
            {/* Right Wall - Voxel style */}
            <RightWall config={roomConfig.rightWall} />
            
            {/* Left Wall - Voxel style */}
            <LeftWall config={roomConfig.leftWall} />
            
            {/* Corner Details */}
            <CornerDetail />
        </group>
    );
};

export default Room;
