import React, { useRef, useEffect } from 'react';
import { TransformControls } from '@react-three/drei';
import useStore from '../store/useStore';
import { Registry } from './library/Registry';

const EditorObject = ({ id, type, position, rotation, scale, color, data }) => {
    const selectedId = useStore((state) => state.selectedId);
    const selectObject = useStore((state) => state.selectObject);
    const updateObject = useStore((state) => state.updateObject);
    const mode = useStore((state) => state.mode);
    const isEditMode = mode === 'edit';

    const isSelected = selectedId === id;
    const groupRef = useRef();

    const handleClick = (e) => {
        if (!isEditMode) return;
        e.stopPropagation();
        selectObject(id);
    };

    const handleTransformChange = () => {
        if (groupRef.current) {
            const { position, rotation, scale } = groupRef.current;
            updateObject(id, {
                position: [position.x, position.y, position.z],
                rotation: [rotation.x, rotation.y, rotation.z],
                scale: [scale.x, scale.y, scale.z],
            });
        }
    };

    const handleObjectChange = () => {
        // Update on every change for real-time boundary clamping
        handleTransformChange();
    };

    const handleUpdate = (props) => {
        updateObject(id, props);
    };

    // Sync group position with store position
    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.position.set(...position);
            groupRef.current.rotation.set(...rotation);
            groupRef.current.scale.set(...scale);
        }
    }, [position, rotation, scale]);

    const registryItem = Registry[type];
    const Component = registryItem ? registryItem.component : null;

    return (
        <>
            {isEditMode && isSelected && (
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
                    <Component color={color} data={data} onUpdate={handleUpdate} />
                ) : (
                    // Fallback for legacy objects
                    <mesh castShadow receiveShadow>
                        <boxGeometry />
                        <meshStandardMaterial color={color} />
                    </mesh>
                )}
            </group>
        </>
    );
};

export default EditorObject;
