import React, { useRef, useEffect } from 'react';
import { TransformControls } from '@react-three/drei';
import useStore from '../store/useStore';
import { Registry } from './library/Registry';

const EditorObject = ({ id, type, position, rotation, scale, color, data }) => {
    const selectedId = useStore((state) => state.selectedId);
    const selectObject = useStore((state) => state.selectObject);
    const updateObject = useStore((state) => state.updateObject);

    const isSelected = selectedId === id;
    const meshRef = useRef();

    // Store object ID in userData for export functionality
    useEffect(() => {
        if (meshRef.current) {
            meshRef.current.userData.objectId = id;
        }
    }, [id]);

    const handleClick = (e) => {
        e.stopPropagation();
        selectObject(id);
    };

    const handleTransformChange = () => {
        if (meshRef.current) {
            const { position, rotation, scale } = meshRef.current;
            updateObject(id, {
                position: [position.x, position.y, position.z],
                rotation: [rotation.x, rotation.y, rotation.z],
                scale: [scale.x, scale.y, scale.z],
            });
        }
    };

    const handleUpdate = (props) => {
        updateObject(id, props);
    };

    const registryItem = Registry[type];
    const Component = registryItem ? registryItem.component : null;

    return (
        <>
            {isSelected && (
                <TransformControls
                    object={meshRef}
                    mode="translate"
                    onMouseUp={handleTransformChange}
                />
            )}
            <group
                ref={meshRef}
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
