import React from 'react';

export const Bed = ({ color = '#ffffff' }) => (
    <group>
        {/* Frame */}
        <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[2, 0.5, 3]} />
            <meshStandardMaterial color="#5d4037" />
        </mesh>
        {/* Mattress */}
        <mesh position={[0, 0.6, 0]}>
            <boxGeometry args={[1.9, 0.3, 2.9]} />
            <meshStandardMaterial color="white" />
        </mesh>
        {/* Blanket */}
        <mesh position={[0, 0.65, 0.5]}>
            <boxGeometry args={[1.95, 0.32, 1.9]} />
            <meshStandardMaterial color={color} />
        </mesh>
        {/* Pillow */}
        <mesh position={[0, 0.8, -1.2]}>
            <boxGeometry args={[1.5, 0.2, 0.5]} />
            <meshStandardMaterial color="#eeeeee" />
        </mesh>
    </group>
);

export const Sofa = ({ color = '#78909c' }) => (
    <group>
        {/* Base */}
        <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[2.5, 0.5, 1]} />
            <meshStandardMaterial color={color} />
        </mesh>
        {/* Back */}
        <mesh position={[0, 0.75, -0.4]}>
            <boxGeometry args={[2.5, 1, 0.2]} />
            <meshStandardMaterial color={color} />
        </mesh>
        {/* Arms */}
        <mesh position={[-1.15, 0.5, 0]}>
            <boxGeometry args={[0.2, 0.5, 1]} />
            <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[1.15, 0.5, 0]}>
            <boxGeometry args={[0.2, 0.5, 1]} />
            <meshStandardMaterial color={color} />
        </mesh>
    </group>
);

export const Table = ({ color = '#8d6e63' }) => (
    <group>
        {/* Top */}
        <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[1.5, 0.1, 1.5]} />
            <meshStandardMaterial color={color} />
        </mesh>
        {/* Legs */}
        <mesh position={[-0.6, 0.35, -0.6]}>
            <cylinderGeometry args={[0.05, 0.05, 0.7]} />
            <meshStandardMaterial color="#5d4037" />
        </mesh>
        <mesh position={[0.6, 0.35, -0.6]}>
            <cylinderGeometry args={[0.05, 0.05, 0.7]} />
            <meshStandardMaterial color="#5d4037" />
        </mesh>
        <mesh position={[-0.6, 0.35, 0.6]}>
            <cylinderGeometry args={[0.05, 0.05, 0.7]} />
            <meshStandardMaterial color="#5d4037" />
        </mesh>
        <mesh position={[0.6, 0.35, 0.6]}>
            <cylinderGeometry args={[0.05, 0.05, 0.7]} />
            <meshStandardMaterial color="#5d4037" />
        </mesh>
    </group>
);

export const Chair = ({ color = '#ffcc80' }) => (
    <group>
        {/* Seat */}
        <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[0.5, 0.05, 0.5]} />
            <meshStandardMaterial color={color} />
        </mesh>
        {/* Back */}
        <mesh position={[0, 0.95, -0.225]}>
            <boxGeometry args={[0.5, 0.5, 0.05]} />
            <meshStandardMaterial color={color} />
        </mesh>
        {/* Legs */}
        <mesh position={[-0.2, 0.225, -0.2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.45]} />
            <meshStandardMaterial color="#5d4037" />
        </mesh>
        <mesh position={[0.2, 0.225, -0.2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.45]} />
            <meshStandardMaterial color="#5d4037" />
        </mesh>
        <mesh position={[-0.2, 0.225, 0.2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.45]} />
            <meshStandardMaterial color="#5d4037" />
        </mesh>
        <mesh position={[0.2, 0.225, 0.2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.45]} />
            <meshStandardMaterial color="#5d4037" />
        </mesh>
    </group>
);

export const Bookshelf = ({ color = '#5d4037' }) => (
    <group>
        {/* Frame */}
        <mesh position={[0, 1, 0]}>
            <boxGeometry args={[1.2, 2, 0.4]} />
            <meshStandardMaterial color={color} />
        </mesh>
        {/* Shelves (Visual only, simple texture or boxes) */}
        <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[1.1, 0.05, 0.38]} />
            <meshStandardMaterial color="#4e342e" />
        </mesh>
        <mesh position={[0, 1, 0]}>
            <boxGeometry args={[1.1, 0.05, 0.38]} />
            <meshStandardMaterial color="#4e342e" />
        </mesh>
        <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[1.1, 0.05, 0.38]} />
            <meshStandardMaterial color="#4e342e" />
        </mesh>
        {/* Books (Random boxes) */}
        <mesh position={[-0.3, 1.15, 0]}>
            <boxGeometry args={[0.1, 0.25, 0.3]} />
            <meshStandardMaterial color="red" />
        </mesh>
        <mesh position={[-0.15, 1.15, 0]}>
            <boxGeometry args={[0.1, 0.22, 0.3]} />
            <meshStandardMaterial color="blue" />
        </mesh>
    </group>
);
