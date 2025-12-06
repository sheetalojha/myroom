import React from 'react';
import useStore from '../store/useStore';
import { X, RotateCw, Move, Maximize2, Palette, Trash2 } from 'lucide-react';
import useIsMobile from '../hooks/useIsMobile';

const ObjectTransformPanel = ({ onClose }) => {
    const selectedId = useStore((state) => state.selectedId);
    const objects = useStore((state) => state.objects);
    const updateObject = useStore((state) => state.updateObject);
    const removeObject = useStore((state) => state.removeObject);
    const selectObject = useStore((state) => state.selectObject);
    const isMobile = useIsMobile();

    const selectedObject = objects.find(obj => obj.id === selectedId);

    if (!selectedObject) {
        return null;
    }

    const handleUpdate = (field, value) => {
        updateObject(selectedId, { [field]: value });
    };

    const handlePositionChange = (axis, value) => {
        const newPosition = [...selectedObject.position];
        const axisIndex = { x: 0, y: 1, z: 2 }[axis];
        newPosition[axisIndex] = parseFloat(value) || 0;
        handleUpdate('position', newPosition);
    };

    const handleRotationChange = (axis, value) => {
        const newRotation = [...selectedObject.rotation];
        const axisIndex = { x: 0, y: 1, z: 2 }[axis];
        // Convert degrees to radians
        newRotation[axisIndex] = (parseFloat(value) || 0) * (Math.PI / 180);
        handleUpdate('rotation', newRotation);
    };

    const handleScaleChange = (axis, value) => {
        const newScale = [...selectedObject.scale];
        const axisIndex = { x: 0, y: 1, z: 2 }[axis];
        newScale[axisIndex] = parseFloat(value) || 1;
        handleUpdate('scale', newScale);
    };

    const handleColorChange = (color) => {
        handleUpdate('color', color);
    };

    const handleDelete = () => {
        removeObject(selectedId);
        selectObject(null);
        if (onClose) onClose();
    };

    // Convert radians to degrees for display
    const rotationDegrees = selectedObject.rotation.map(r => (r * 180 / Math.PI).toFixed(1));

    return (
        <div style={{
            position: 'absolute',
            top: isMobile ? 'auto' : 72,
            right: isMobile ? 0 : 24,
            bottom: isMobile ? 0 : 24,
            left: isMobile ? 0 : 'auto',
            width: isMobile ? '100%' : 340,
            maxHeight: isMobile ? '50vh' : 'calc(100vh - 96px)',
            background: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: isMobile ? '20px 20px 0 0' : '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            pointerEvents: 'auto',
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.05)',
            borderBottom: isMobile ? 'none' : '1px solid rgba(0,0,0,0.05)',
            zIndex: 90
        }}>
            {/* Header */}
            <div style={{
                padding: '14px 16px',
                borderBottom: '1px solid rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                }}>
                    <Move size={15} color="#1A202C" />
                    <span style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#1A202C',
                        letterSpacing: '-0.01em'
                    }}>
                        Transform
                    </span>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                    }}
                >
                    <X size={15} color="#6B7280" />
                </button>
            </div>

            {/* Content */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14
            }}>
                {/* Position */}
                <div>
                    <label style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: '#6B7280',
                        marginBottom: 8,
                        display: 'block',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Position
                    </label>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 8
                    }}>
                        {['x', 'y', 'z'].map((axis) => (
                            <div key={axis} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <label style={{
                                    fontSize: 9,
                                    fontWeight: 500,
                                    color: '#9CA3AF',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    {axis}
                                </label>
                                <input
                                    type="number"
                                    value={selectedObject.position[{ x: 0, y: 1, z: 2 }[axis]].toFixed(2)}
                                    onChange={(e) => handlePositionChange(axis, e.target.value)}
                                    step="0.1"
                                    style={{
                                        width: '100%',
                                        padding: '6px 8px',
                                        borderRadius: '6px',
                                        border: '1px solid rgba(0,0,0,0.08)',
                                        background: '#FAFAFA',
                                        fontSize: 12,
                                        color: '#1A202C',
                                        outline: 'none',
                                        transition: 'all 0.15s ease',
                                        fontFamily: 'ui-monospace, monospace',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#1A202C';
                                        e.target.style.background = '#FFFFFF';
                                        e.target.style.boxShadow = '0 0 0 2px rgba(26, 32, 44, 0.05)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'rgba(0,0,0,0.08)';
                                        e.target.style.background = '#FAFAFA';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rotation */}
                <div>
                    <label style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: '#6B7280',
                        marginBottom: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        <RotateCw size={11} />
                        Rotation
                    </label>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 8
                    }}>
                        {['x', 'y', 'z'].map((axis) => (
                            <div key={axis} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <label style={{
                                    fontSize: 9,
                                    fontWeight: 500,
                                    color: '#9CA3AF',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    {axis}
                                </label>
                                <input
                                    type="number"
                                    value={rotationDegrees[{ x: 0, y: 1, z: 2 }[axis]]}
                                    onChange={(e) => handleRotationChange(axis, e.target.value)}
                                    step="1"
                                    style={{
                                        width: '100%',
                                        padding: '6px 8px',
                                        borderRadius: '6px',
                                        border: '1px solid rgba(0,0,0,0.08)',
                                        background: '#FAFAFA',
                                        fontSize: 12,
                                        color: '#1A202C',
                                        outline: 'none',
                                        transition: 'all 0.15s ease',
                                        fontFamily: 'ui-monospace, monospace',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#1A202C';
                                        e.target.style.background = '#FFFFFF';
                                        e.target.style.boxShadow = '0 0 0 2px rgba(26, 32, 44, 0.05)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'rgba(0,0,0,0.08)';
                                        e.target.style.background = '#FAFAFA';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scale */}
                <div>
                    <label style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: '#6B7280',
                        marginBottom: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        <Maximize2 size={11} />
                        Scale
                    </label>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 8
                    }}>
                        {['x', 'y', 'z'].map((axis) => (
                            <div key={axis} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <label style={{
                                    fontSize: 9,
                                    fontWeight: 500,
                                    color: '#9CA3AF',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    {axis}
                                </label>
                                <input
                                    type="number"
                                    value={selectedObject.scale[{ x: 0, y: 1, z: 2 }[axis]].toFixed(2)}
                                    onChange={(e) => handleScaleChange(axis, e.target.value)}
                                    step="0.1"
                                    min="0.1"
                                    style={{
                                        width: '100%',
                                        padding: '6px 8px',
                                        borderRadius: '6px',
                                        border: '1px solid rgba(0,0,0,0.08)',
                                        background: '#FAFAFA',
                                        fontSize: 12,
                                        color: '#1A202C',
                                        outline: 'none',
                                        transition: 'all 0.15s ease',
                                        fontFamily: 'ui-monospace, monospace',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#1A202C';
                                        e.target.style.background = '#FFFFFF';
                                        e.target.style.boxShadow = '0 0 0 2px rgba(26, 32, 44, 0.05)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'rgba(0,0,0,0.08)';
                                        e.target.style.background = '#FAFAFA';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Color */}
                <div>
                    <label style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: '#6B7280',
                        marginBottom: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        <Palette size={11} />
                        Color
                    </label>
                    <div style={{
                        display: 'flex',
                        gap: 8,
                        alignItems: 'center'
                    }}>
                        <input
                            type="color"
                            value={selectedObject.color || '#ffffff'}
                            onChange={(e) => handleColorChange(e.target.value)}
                            style={{
                                width: 52,
                                height: 36,
                                borderRadius: '6px',
                                border: '1px solid rgba(0,0,0,0.08)',
                                cursor: 'pointer',
                                outline: 'none',
                                flexShrink: 0
                            }}
                        />
                        <input
                            type="text"
                            value={selectedObject.color || '#ffffff'}
                            onChange={(e) => handleColorChange(e.target.value)}
                            placeholder="#ffffff"
                            style={{
                                flex: 1,
                                padding: '6px 10px',
                                borderRadius: '6px',
                                border: '1px solid rgba(0,0,0,0.08)',
                                background: '#FAFAFA',
                                fontSize: 11,
                                color: '#1A202C',
                                fontFamily: 'ui-monospace, monospace',
                                outline: 'none',
                                transition: 'all 0.15s ease'
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = '#1A202C';
                                e.currentTarget.style.background = '#FFFFFF';
                                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(26, 32, 44, 0.05)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)';
                                e.currentTarget.style.background = '#FAFAFA';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <label style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: '#6B7280',
                        marginBottom: 8,
                        display: 'block',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Actions
                    </label>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 5
                    }}>
                        <button
                            onClick={() => {
                                handleUpdate('rotation', [0, 0, 0]);
                            }}
                            style={{
                                padding: '7px 12px',
                                borderRadius: '6px',
                                border: '1px solid rgba(0,0,0,0.08)',
                                background: '#FAFAFA',
                                fontSize: 11,
                                fontWeight: 500,
                                color: '#1A202C',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 7,
                                justifyContent: 'flex-start'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#F3F4F6';
                                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#FAFAFA';
                                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)';
                            }}
                        >
                            <RotateCw size={12} />
                            Reset Rotation
                        </button>
                        <button
                            onClick={() => {
                                handleUpdate('scale', [1, 1, 1]);
                            }}
                            style={{
                                padding: '7px 12px',
                                borderRadius: '6px',
                                border: '1px solid rgba(0,0,0,0.08)',
                                background: '#FAFAFA',
                                fontSize: 11,
                                fontWeight: 500,
                                color: '#1A202C',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 7,
                                justifyContent: 'flex-start'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#F3F4F6';
                                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#FAFAFA';
                                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)';
                            }}
                        >
                            <Maximize2 size={12} />
                            Reset Scale
                        </button>
                        <button
                            onClick={handleDelete}
                            style={{
                                padding: '7px 12px',
                                borderRadius: '6px',
                                border: '1px solid rgba(220,38,38,0.2)',
                                background: '#FEF2F2',
                                fontSize: 11,
                                fontWeight: 500,
                                color: '#DC2626',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 7,
                                justifyContent: 'flex-start'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#FEE2E2';
                                e.currentTarget.style.borderColor = 'rgba(220,38,38,0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#FEF2F2';
                                e.currentTarget.style.borderColor = 'rgba(220,38,38,0.2)';
                            }}
                        >
                            <Trash2 size={12} />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ObjectTransformPanel;
