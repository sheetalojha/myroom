import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { TransformControls } from '@react-three/drei';
import useStore from '../store/useStore';
import { Registry } from './library/Registry';

const EditorObject = React.memo(({ id, type, position, rotation, scale, color, data }) => {
    // Optimize store subscriptions - only subscribe to what this component needs
    const selectedId = useStore((state) => state.selectedId);
    const selectObject = useStore((state) => state.selectObject);
    const updateObject = useStore((state) => state.updateObject);
    const mode = useStore((state) => state.mode);

    const isEditMode = mode === 'edit';
    const isSelected = selectedId === id;
    const groupRef = useRef();
    const updateTimeoutRef = useRef(null);

    // Store object ID in userData for export functionality
    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.userData.objectId = id;
        }
    }, [id, groupRef]);

    const handleClick = useCallback((e) => {
        if (!isEditMode) return;
        e.stopPropagation();
        selectObject(id);
    }, [isEditMode, selectObject, id]);

    const handleTransformChange = useCallback(() => {
        if (groupRef.current) {
            const { position, rotation, scale } = groupRef.current;
            updateObject(id, {
                position: [position.x, position.y, position.z],
                rotation: [rotation.x, rotation.y, rotation.z],
                scale: [scale.x, scale.y, scale.z],
            });
        }
    }, [id, updateObject]);

    // CRITICAL FIX: Debounce onChange to prevent expensive updates on every frame
    // Only update on mouseUp, not during dragging
    const handleObjectChange = useCallback(() => {
        // Clear any pending updates
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
        }
        // Don't update during drag - only visual feedback
        // The onMouseUp handler will do the final update
    }, []);

    const handleUpdate = useCallback((props) => {
        updateObject(id, props);
    }, [id, updateObject]);

    // Sync group position with store position
    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.position.set(...position);
            groupRef.current.rotation.set(...rotation);
            groupRef.current.scale.set(...scale);
        }
    }, [position, rotation, scale]);

    // Memoize registry lookup
    const registryItem = useMemo(() => Registry[type], [type]);
    const Component = registryItem ? registryItem.component : null;

    const isPhysicsObject = registryItem?.isPhysics;
    
    return (
        <>
            {isEditMode && isSelected && !isPhysicsObject && (
                <TransformControls
                    object={groupRef}
                    mode="translate"
                    onChange={handleObjectChange}
                    onMouseUp={handleTransformChange}
                />
            )}
            <group
                ref={groupRef}
                position={position}
                rotation={rotation}
                scale={scale}
                onClick={handleClick}
            >
                {Component ? (
                    isPhysicsObject ? (
                        <Component id={id} color={color} data={data} />
                    ) : (
                        <Component color={color} data={data} onUpdate={handleUpdate} />
                    )
                ) : (
                    // Fallback for legacy objects
                    <mesh>
                        <boxGeometry />
                        <meshStandardMaterial color={color} />
                    </mesh>
                )}
            </group>
        </>
    );
});

EditorObject.displayName = 'EditorObject';

export default EditorObject;
