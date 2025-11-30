import React, { useState } from 'react';
import useStore from '../store/useStore';
import { Leva } from 'leva';
import { Registry, Categories } from './library/Registry';
import {
    Armchair,
    Lamp,
    Flower2,
    Smile,
    Save,
    Upload,
    Menu,
    X,
    Box,
    Edit3,
    Eye
} from 'lucide-react';

const CategoryIcons = {
    Furniture: Armchair,
    Decor: Flower2,
    Lighting: Lamp,
    Cute: Smile,
};

const UIOverlay = () => {
    const addObject = useStore((state) => state.addObject);
    const objects = useStore((state) => state.objects);
    const loadScene = useStore((state) => state.loadScene);
    const mode = useStore((state) => state.mode);
    const setMode = useStore((state) => state.setMode);
    const selectedId = useStore((state) => state.selectedId);

    const [activeCategory, setActiveCategory] = useState('Furniture');
    const [libraryOpen, setLibraryOpen] = useState(true);
    
    const isEditMode = mode === 'edit';

    const handleSave = () => {
        const data = JSON.stringify({ objects });
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'room-scene.json';
        a.click();
    };

    const handleLoad = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    loadScene(data);
                } catch (err) {
                    console.error('Failed to load scene', err);
                }
            };
            reader.readAsText(file);
        }
    };

    const filteredItems = Object.entries(Registry).filter(
        ([key, item]) => item.category === activeCategory
    );

    return (
        <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            pointerEvents: 'none',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}>
            {/* Top Left - Floating Navbar */}
            <div style={{
                position: 'absolute',
                top: 24,
                left: 24,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                pointerEvents: 'auto',
                zIndex: 100
            }}>
                {/* Logo - Floating pill */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: '20px',
                    padding: '6px 14px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    <span style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: '#1A202C',
                        letterSpacing: '-0.01em'
                    }}>
                        kamra
                    </span>
                </div>

                {/* Mode Toggle - Floating pill */}
                <div style={{
                    display: 'flex',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: '20px',
                    padding: '2px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    <button
                        onClick={() => setMode('edit')}
                        style={{
                            padding: '4px 12px',
                            borderRadius: '18px',
                            border: 'none',
                            background: isEditMode ? '#1A202C' : 'transparent',
                            color: isEditMode ? '#FFFFFF' : '#6B7280',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 11,
                            fontWeight: 500,
                            transition: 'all 0.15s ease'
                        }}
                    >
                        <Edit3 size={12} />
                        Edit
                    </button>
                    <button
                        onClick={() => setMode('view')}
                        style={{
                            padding: '4px 12px',
                            borderRadius: '18px',
                            border: 'none',
                            background: !isEditMode ? '#1A202C' : 'transparent',
                            color: !isEditMode ? '#FFFFFF' : '#6B7280',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 11,
                            fontWeight: 500,
                            transition: 'all 0.15s ease'
                        }}
                    >
                        <Eye size={12} />
                        View
                    </button>
                </div>

                {/* Library Toggle - only in edit mode */}
                {isEditMode && (
                    <button
                        onClick={() => setLibraryOpen(!libraryOpen)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(16px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '20px',
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                        }}
                    >
                        {libraryOpen ? <X size={14} color="#1A202C" /> : <Menu size={14} color="#1A202C" />}
                    </button>
                )}
            </div>

            {/* Top Right - Floating Save/Load Buttons - only in edit mode */}
            {isEditMode && (
                <div style={{
                    position: 'absolute',
                    top: 24,
                    right: 24,
                    display: 'flex',
                    gap: 8,
                    pointerEvents: 'auto',
                    zIndex: 100
                }}>
                    <button 
                        onClick={handleSave}
                        style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(16px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 11,
                            fontWeight: 500,
                            color: '#1A202C',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                        }}
                    >
                        <Save size={12} /> Save
                    </button>
                    <label 
                        style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(16px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 11,
                            fontWeight: 500,
                            color: '#1A202C',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                        }}
                    >
                        <Upload size={12} /> Load
                        <input type="file" accept=".json" onChange={handleLoad} style={{ display: 'none' }} />
                    </label>
                </div>
            )}

            {/* Left Sidebar - Floating Library Card - only in edit mode */}
            {isEditMode && libraryOpen && (
                <div style={{
                    position: 'absolute',
                    top: 72,
                    left: 24,
                    bottom: 24,
                    width: 280,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    pointerEvents: 'auto',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                    {/* Categories - Minimal */}
                    <div style={{ 
                        display: 'flex', 
                        gap: 4, 
                        padding: '12px', 
                        overflowX: 'auto',
                        borderBottom: '1px solid rgba(0,0,0,0.06)'
                    }}>
                        {Categories.map((cat) => {
                            const Icon = CategoryIcons[cat] || Box;
                            const isActive = activeCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: isActive 
                                            ? '#1A202C'
                                            : 'transparent',
                                        color: isActive ? '#FFFFFF' : '#1A202C',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        fontSize: 12,
                                        fontWeight: isActive ? 600 : 500,
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    <Icon size={14} />
                                    {cat}
                                </button>
                            );
                        })}
                    </div>

                    {/* Grid - Minimal */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '12px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 8,
                        alignContent: 'start'
                    }}>
                        {filteredItems.map(([type, item]) => (
                            <div
                                key={type}
                                onClick={() => addObject(type)}
                                style={{
                                    aspectRatio: '1',
                                    background: 'rgba(0, 0, 0, 0.02)',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid rgba(0,0,0,0.06)',
                                    transition: 'all 0.15s ease',
                                    padding: 12
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)';
                                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)';
                                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)';
                                }}
                            >
                                <div style={{ 
                                    marginBottom: 8,
                                    color: '#1A202C',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Box size={32} strokeWidth={1.5} />
                                </div>
                                <span style={{ 
                                    fontSize: 11, 
                                    textAlign: 'center', 
                                    color: '#1A202C',
                                    fontWeight: 500
                                }}>
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Bottom Left - Floating Room Info */}
            <div style={{
                position: 'absolute',
                bottom: 24,
                left: 24,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(16px)',
                borderRadius: '20px',
                padding: '8px 14px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                pointerEvents: 'auto',
                zIndex: 100
            }}>
                <div style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: '#6B7280',
                    letterSpacing: '-0.01em'
                }}>
                    My Room
                </div>
            </div>

            {/* Leva Panel (Properties) - only in edit mode when object selected */}
            {isEditMode && selectedId && (
                <div style={{ 
                    position: 'absolute', 
                    top: 52, 
                    right: 16, 
                    pointerEvents: 'auto',
                    zIndex: 50
                }}>
                    <Leva 
                        fill 
                        flat 
                        titleBar={false} 
                        theme={{
                            colors: {
                                elevation1: 'rgba(255, 255, 255, 0.98)',
                                elevation2: 'rgba(248, 250, 252, 0.98)',
                                elevation3: 'rgba(241, 245, 249, 0.98)',
                                accent1: '#1A202C',
                                accent2: '#2D3748',
                                accent3: '#4A5568',
                                highlight1: '#1A202C',
                                highlight2: '#2D3748',
                                highlight3: '#4A5568',
                                vivid1: '#1A202C',
                            },
                            radii: {
                                xs: '4px',
                                sm: '6px',
                                lg: '8px',
                            },
                        }} 
                    />
                </div>
            )}

            {/* Custom Scrollbar */}
            <style>{`
                ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                }
                ::-webkit-scrollbar-thumb {
                    background: rgba(26, 32, 44, 0.3);
                    border-radius: 4px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(26, 32, 44, 0.5);
                }
            `}</style>
        </div>
    );
};

export default UIOverlay;
