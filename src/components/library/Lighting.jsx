import React from 'react';

export const Lamp = ({ color = '#ffeb3b', data = {}, onUpdate }) => {
    const isOn = data.isOn ?? true;

    const toggle = (e) => {
        e.stopPropagation();
        onUpdate({ data: { ...data, isOn: !isOn } });
    };

    return (
        <group onClick={toggle}>
            {/* Base */}
            <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.2, 0.25, 0.1]} />
                <meshStandardMaterial color="#212121" />
            </mesh>
            {/* Pole */}
            <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.02, 0.02, 1]} />
                <meshStandardMaterial color="#212121" />
            </mesh>
            {/* Shade */}
            <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
                <coneGeometry args={[0.3, 0.4, 32, 1, true]} />
                <meshStandardMaterial color={color} side={2} transparent opacity={0.9} />
            </mesh>
            {/* Bulb/Light */}
            <mesh position={[0, 1, 0]}>
                <sphereGeometry args={[0.1]} />
                <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={isOn ? 2 : 0} />
            </mesh>
            {isOn && (
                <pointLight position={[0, 0.9, 0]} intensity={1} distance={5} color="#ffaa00" castShadow />
            )}
        </group>
    );
};

export const FairyLights = ({ color = '#ffcc00', data = {}, onUpdate }) => {
    const isOn = data.isOn ?? true;

    const toggle = (e) => {
        e.stopPropagation();
        onUpdate({ data: { ...data, isOn: !isOn } });
    };

    // Generate positions for lights along a curve
    const count = 20;
    const lights = Array.from({ length: count }).map((_, i) => {
        const t = i / (count - 1);
        const x = (t - 0.5) * 4;
        const y = Math.sin(t * Math.PI * 2) * 0.5 + 1.5; // Hang down
        return [x, y, 0];
    });

    return (
        <group onClick={toggle}>
            {/* String */}
            <line>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={lights.length}
                        array={new Float32Array(lights.flat())}
                        itemSize={3}
                    />
                </bufferGeometry>
                <lineBasicMaterial color="#333" />
            </line>

            {/* Bulbs */}
            {lights.map((pos, i) => (
                <mesh key={i} position={pos}>
                    <sphereGeometry args={[0.05]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={isOn ? 3 : 0}
                        toneMapped={false}
                    />
                    {isOn && i % 5 === 0 && (
                        <pointLight intensity={0.2} distance={2} color={color} />
                    )}
                </mesh>
            ))}
        </group>
    );
};
