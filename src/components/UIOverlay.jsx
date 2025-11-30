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
    Box
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

    const [activeCategory, setActiveCategory] = useState('Furniture');
    const [libraryOpen, setLibraryOpen] = useState(true);

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
            {/* Top Left - Minimal Navbar */}
            <div style={{
                position: 'absolute',
                top: 20,
                left: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                pointerEvents: 'auto',
                zIndex: 100
            }}>
                <button
                    onClick={() => setLibraryOpen(!libraryOpen)}
                    style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        borderRadius: '8px',
                        width: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                    }}
                >
                    {libraryOpen ? <X size={18} color="#1A202C" /> : <Menu size={18} color="#1A202C" />}
                </button>
                
                {/* Logo/Title */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    border: '1px solid rgba(0, 0, 0, 0.08)'
                }}>
                    <span style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: '#1A202C',
                        letterSpacing: '-0.01em'
                    }}>
                        kamra
                    </span>
                </div>
            </div>

            {/* Top Right - Save/Load Buttons */}
            <div style={{
                position: 'absolute',
                top: 24,
                right: 24,
                display: 'flex',
                gap: 12,
                pointerEvents: 'auto',
                zIndex: 100
            }}>
                <button 
                    onClick={handleSave}
                    style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: 'none',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#1A202C',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                >
                    <Save size={16} /> Save
                </button>
                <label 
                    style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: 'none',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#1A202C',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                >
                    <Upload size={16} /> Load
                    <input type="file" accept=".json" onChange={handleLoad} style={{ display: 'none' }} />
                </label>
            </div>

            {/* Left Sidebar - Minimal Library */}
            {libraryOpen && (
                <div style={{
                    position: 'absolute',
                    top: 88,
                    left: 24,
                    bottom: 24,
                    width: 280,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    pointerEvents: 'auto',
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.08)'
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

            {/* Bottom Left - Room Info Card (Floating) */}
            <div style={{
                position: 'absolute',
                bottom: 24,
                left: 24,
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '16px 20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                pointerEvents: 'auto',
                zIndex: 100
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: 16
                    }}>
                        M
                    </div>
                    <div>
                        <div style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: '#1A202C',
                            marginBottom: 2
                        }}>
                            My Room
                        </div>
                        <div style={{
                            fontSize: 12,
                            fontWeight: 500,
                            color: '#718096'
                        }}>
                            by You
                        </div>
                    </div>
                </div>
            </div>

            {/* Leva Panel (Properties) - Styled to match */}
            <div style={{ 
                position: 'absolute', 
                top: 100, 
                right: 24, 
                pointerEvents: 'auto',
                zIndex: 50
            }}>
                <Leva 
                    fill 
                    flat 
                    titleBar={false} 
                    theme={{
                        colors: {
                            elevation1: 'rgba(255, 255, 255, 0.9)',
                            elevation2: 'rgba(248, 250, 252, 0.9)',
                            elevation3: 'rgba(241, 245, 249, 0.9)',
                            accent1: '#1A202C',
                            accent2: '#2D3748',
                            accent3: '#4A5568',
                            highlight1: '#1A202C',
                            highlight2: '#2D3748',
                            highlight3: '#4A5568',
                            vivid1: '#1A202C',
                        },
                        radii: {
                            xs: '6px',
                            sm: '10px',
                            lg: '16px',
                        },
                    }} 
                />
            </div>

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
