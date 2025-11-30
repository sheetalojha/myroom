import React from 'react';

const Room = () => {
    return (
        <group>
            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#f5f5f5" roughness={0.8} />
            </mesh>

            {/* Floor Grid Pattern (Subtle) */}
            <gridHelper args={[20, 20, 0xcccccc, 0xe0e0e0]} position={[0, 0.001, 0]} />

            {/* Back Wall */}
            <mesh position={[0, 5, -10]} receiveShadow>
                <planeGeometry args={[20, 10]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>

            {/* Left Wall */}
            <mesh rotation={[0, Math.PI / 2, 0]} position={[-10, 5, 0]} receiveShadow>
                <planeGeometry args={[20, 10]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>

            {/* Baseboards */}
            <mesh position={[0, 0.25, -9.95]}>
                <boxGeometry args={[20, 0.5, 0.1]} />
                <meshStandardMaterial color="#eeeeee" />
            </mesh>
            <mesh position={[-9.95, 0.25, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[20, 0.5, 0.1]} />
                <meshStandardMaterial color="#eeeeee" />
            </mesh>
        </group>
    );
};

export default Room;
