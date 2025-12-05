import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../../store/useStore';

// Voxel helper function
const VoxelBox = ({ position, size = [1, 1, 1], color }) => (
    <mesh position={position} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} />
    </mesh>
);

const HUMAN_SCALE = 1.8;
const WALK_SPEED = 0.05;
const JUMP_FORCE = 0.15;
const GRAVITY = -0.01;
const GROUND_Y = 0.5; // Floor level + half human height

export const Human = ({ id, color = '#ffdbac' }) => {
    const groupRef = useRef();
    const [velocity, setVelocity] = useState({ x: 0, z: 0, y: 0 });
    const [isGrounded, setIsGrounded] = useState(true);
    const [isJumping, setIsJumping] = useState(false);
    const mode = useStore((state) => state.mode);
    const updateObject = useStore((state) => state.updateObject);
    const objects = useStore((state) => state.objects);
    const objectData = id ? objects.find(obj => obj.id === id) : null;
    const initialPosition = objectData?.position || [0, 0.5, 0];
    const isPreview = !id; // If no id, it's a preview
    
    const isEditMode = mode === 'edit';
    
    // Keyboard controls
    useEffect(() => {
        if (isEditMode || isPreview) return; // Disable controls in edit mode or preview
        
        const keys = {};
        
        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase();
            keys[key] = true;
            
            // Jump (only spacebar, not W)
            if (key === ' ' && isGrounded && !isJumping) {
                e.preventDefault();
                setIsJumping(true);
                setIsGrounded(false);
                setVelocity(prev => ({ ...prev, y: JUMP_FORCE }));
            }
        };
        
        const handleKeyUp = (e) => {
            keys[e.key.toLowerCase()] = false;
        };
        
        const updateMovement = () => {
            const moveX = (keys['a'] ? -1 : 0) + (keys['d'] ? 1 : 0);
            const moveZ = (keys['w'] ? 1 : 0) + (keys['s'] ? -1 : 0);
            
            setVelocity(prev => ({
                ...prev,
                x: moveX * WALK_SPEED,
                z: moveZ * WALK_SPEED
            }));
        };
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        const interval = setInterval(updateMovement, 16); // ~60fps
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            clearInterval(interval);
        };
    }, [isEditMode, isGrounded, isJumping]);
    
    // Initialize position
    useEffect(() => {
        if (groupRef.current && isEditMode) {
            groupRef.current.position.set(...initialPosition);
        }
    }, [initialPosition, isEditMode]);
    
    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
        };
    }, []);
    
    // Debounced update function
    const updateTimeoutRef = useRef(null);
    const lastUpdateTime = useRef(0);
    
    // Physics update - optimized with throttling
    useFrame(() => {
        if (!groupRef.current) return;
        
        if (isEditMode || isPreview) {
            // In edit mode or preview, sync with store position or use initial
            if (objectData?.position) {
                groupRef.current.position.set(...objectData.position);
            } else if (isPreview) {
                groupRef.current.position.set(...initialPosition);
            }
            return;
        }
        
        // In view mode, apply physics
        const currentPos = groupRef.current.position;
        let newY = currentPos.y + velocity.y;
        
        // Apply gravity
        if (!isGrounded) {
            const newVelocityY = velocity.y + GRAVITY;
            setVelocity(prev => ({ ...prev, y: newVelocityY }));
            newY = currentPos.y + newVelocityY;
        }
        
        // Ground collision
        if (newY <= GROUND_Y) {
            newY = GROUND_Y;
            setIsGrounded(true);
            setIsJumping(false);
            setVelocity(prev => ({ ...prev, y: 0 }));
        }
        
        // Move human
        const newX = currentPos.x + velocity.x;
        const newZ = currentPos.z + velocity.z;
        
        // Room bounds check
        const ROOM_SIZE = 20;
        const clampedX = Math.max(-ROOM_SIZE / 2 + 0.5, Math.min(ROOM_SIZE / 2 - 0.5, newX));
        const clampedZ = Math.max(-ROOM_SIZE / 2 + 0.5, Math.min(ROOM_SIZE / 2 - 0.5, newZ));
        
        groupRef.current.position.set(clampedX, newY, clampedZ);
        
        // Rotate towards movement direction
        if (velocity.x !== 0 || velocity.z !== 0) {
            const angle = Math.atan2(velocity.x, velocity.z);
            groupRef.current.rotation.y = angle;
        }
        
        // Throttle store updates to every 100ms (10fps) instead of every frame
        const now = Date.now();
        if (now - lastUpdateTime.current > 100) {
            lastUpdateTime.current = now;
            
            // Clear any pending updates
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
            
            // Update store position (debounced)
            updateTimeoutRef.current = setTimeout(() => {
                if (id) {
                    updateObject(id, {
                        position: [clampedX, newY, clampedZ]
                    });
                }
            }, 50);
        }
    });
    
    return (
        <group ref={groupRef}>
            {/* Head */}
            <VoxelBox 
                position={[0, 1.4 * HUMAN_SCALE, 0]} 
                size={[0.4 * HUMAN_SCALE, 0.4 * HUMAN_SCALE, 0.4 * HUMAN_SCALE]} 
                color={color} 
            />
            
            {/* Body */}
            <VoxelBox 
                position={[0, 0.9 * HUMAN_SCALE, 0]} 
                size={[0.5 * HUMAN_SCALE, 0.8 * HUMAN_SCALE, 0.4 * HUMAN_SCALE]} 
                color="#4a90e2" 
            />
            
            {/* Arms */}
            <VoxelBox 
                position={[-0.4 * HUMAN_SCALE, 0.9 * HUMAN_SCALE, 0]} 
                size={[0.2 * HUMAN_SCALE, 0.6 * HUMAN_SCALE, 0.2 * HUMAN_SCALE]} 
                color="#4a90e2" 
            />
            <VoxelBox 
                position={[0.4 * HUMAN_SCALE, 0.9 * HUMAN_SCALE, 0]} 
                size={[0.2 * HUMAN_SCALE, 0.6 * HUMAN_SCALE, 0.2 * HUMAN_SCALE]} 
                color="#4a90e2" 
            />
            
            {/* Legs */}
            <VoxelBox 
                position={[-0.15 * HUMAN_SCALE, 0.3 * HUMAN_SCALE, 0]} 
                size={[0.2 * HUMAN_SCALE, 0.6 * HUMAN_SCALE, 0.2 * HUMAN_SCALE]} 
                color="#2c3e50" 
            />
            <VoxelBox 
                position={[0.15 * HUMAN_SCALE, 0.3 * HUMAN_SCALE, 0]} 
                size={[0.2 * HUMAN_SCALE, 0.6 * HUMAN_SCALE, 0.2 * HUMAN_SCALE]} 
                color="#2c3e50" 
            />
            
            {/* Feet */}
            <VoxelBox 
                position={[-0.15 * HUMAN_SCALE, 0.05 * HUMAN_SCALE, 0]} 
                size={[0.25 * HUMAN_SCALE, 0.1 * HUMAN_SCALE, 0.3 * HUMAN_SCALE]} 
                color="#1a1a1a" 
            />
            <VoxelBox 
                position={[0.15 * HUMAN_SCALE, 0.05 * HUMAN_SCALE, 0]} 
                size={[0.25 * HUMAN_SCALE, 0.1 * HUMAN_SCALE, 0.3 * HUMAN_SCALE]} 
                color="#1a1a1a" 
            />
        </group>
    );
};

