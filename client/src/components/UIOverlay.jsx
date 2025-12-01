import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import useStore from '../store/useStore';
import { Leva } from 'leva';
import { Registry, Categories } from './library/Registry';
import ObjectPreview from './ObjectPreview';
import PerformanceNotification from './PerformanceNotification';
import WalletConnect from './WalletConnect';
import PublishPanel from './PublishPanel';
import NFTLibrary from './NFTLibrary';
import ObjectTransformPanel from './ObjectTransformPanel';
import blockchainService from '../services/blockchainService';
import { COLOR_THEMES, LIGHTING_PRESETS, WALL_COLOR_PRESETS, FLOOR_COLOR_PRESETS } from '../config/roomThemes';
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
    Eye,
    Palette,
    Settings,
    Package
} from 'lucide-react';

const CategoryIcons = {
    Furniture: Armchair,
    Decor: Flower2,
    Lighting: Lamp,
    Cute: Smile,
    Electronics: Box,
    Characters: Smile,
};

const UIOverlay = () => {
    const { isConnected } = useAccount();
    const addObject = useStore((state) => state.addObject);
    const objects = useStore((state) => state.objects);
    const loadScene = useStore((state) => state.loadScene);
    const mode = useStore((state) => state.mode);
    const setMode = useStore((state) => state.setMode);
    const selectedId = useStore((state) => state.selectedId);
    const performanceNotification = useStore((state) => state.performanceNotification);
    const setPerformanceNotification = useStore((state) => state.setPerformanceNotification);
    const currentChamberTokenId = useStore((state) => state.currentChamberTokenId);

    const [activeCategory, setActiveCategory] = useState('Furniture');
    const [libraryOpen, setLibraryOpen] = useState(true);
    const [customizeOpen, setCustomizeOpen] = useState(false);
    const [showNFTLibrary, setShowNFTLibrary] = useState(false);
    const [chamberName, setChamberName] = useState('My Room');

    const roomConfig = useStore((state) => state.roomConfig);
    const setColorTheme = useStore((state) => state.setColorTheme);
    
    // Fetch littleworld name if editing/viewing an existing littleworld
    useEffect(() => {
        const fetchChamberName = async () => {
            if (currentChamberTokenId !== null && window.ethereum) {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    await blockchainService.initialize(provider);
                    const metadata = await blockchainService.getSceneByTokenId(currentChamberTokenId);
                    setChamberName(metadata.name || 'My Room');
                } catch (error) {
                    console.error('Error fetching littleworld name:', error);
                    setChamberName('My Room');
                }
            } else {
                setChamberName('My Room');
            }
        };
        
        fetchChamberName();
    }, [currentChamberTokenId, mode]); // Also depend on mode to refresh when switching
    const setLighting = useStore((state) => state.setLighting);
    const updateRoomConfig = useStore((state) => state.updateRoomConfig);

    const isEditMode = mode === 'edit';
    const selectObject = useStore((state) => state.selectObject);

    // Close customize panel when object is selected
    useEffect(() => {
        if (selectedId && customizeOpen) {
            setCustomizeOpen(false);
        }
    }, [selectedId, customizeOpen]);

    const handleSave = () => {
        const data = JSON.stringify({ objects, roomConfig });
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
        ([, item]) => item.category === activeCategory
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
                        LittleWorlds
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
                    <>
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
                        <button
                            onClick={() => {
                                if (selectedId) {
                                    // If object is selected, deselect it (transform panel will close)
                                    selectObject(null);
                                } else {
                                    // Toggle customize panel
                                    setCustomizeOpen(!customizeOpen);
                                }
                            }}
                            style={{
                                background: (customizeOpen || selectedId) ? '#1A202C' : 'rgba(255, 255, 255, 0.95)',
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
                                if (!customizeOpen && !selectedId) {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!customizeOpen && !selectedId) {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                                }
                            }}
                        >
                            <Palette size={14} color={(customizeOpen || selectedId) ? "#FFFFFF" : "#1A202C"} />
                        </button>
                    </>
                )}

                {/* Wallet Connect - In Navbar */}
                <WalletConnect />
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

            {/* Bottom Horizontal Section - Publish Panel & My Rooms - only in edit mode */}
            {isEditMode && (
                <div style={{
                    position: 'absolute',
                    bottom: 24,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    pointerEvents: 'auto',
                    zIndex: 100
                }}>
                    <PublishPanel />
                    <button
                        onClick={() => setShowNFTLibrary(true)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(16px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            padding: '8px 14px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 11,
                            fontWeight: 500,
                            color: '#1A202C',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            transition: 'all 0.15s ease',
                            whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <Package size={12} />
                        My Rooms
                    </button>
                </div>
            )}

            {/* Right Sidebar - Object Transform Panel - only in edit mode when object is selected */}
            {isEditMode && selectedId && (
                <ObjectTransformPanel onClose={() => selectObject(null)} />
            )}

            {/* Right Sidebar - Customization Panel - only in edit mode when no object selected */}
            {isEditMode && customizeOpen && !selectedId && (
                <div style={{
                    position: 'absolute',
                    top: 72,
                    right: 24,
                    bottom: 24,
                    width: 320,
                    maxHeight: 'calc(100vh - 96px)',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(250,252,255,0.98) 100%)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    pointerEvents: 'auto',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    zIndex: 90
                }}>
                    <div style={{
                        padding: '16px',
                        borderBottom: '1px solid rgba(0,0,0,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                    }}>
                        <Settings size={16} color="#1A202C" />
                        <span style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: '#1A202C'
                        }}>
                            Customize Room
                        </span>
                    </div>

                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 20
                    }}>
                        {/* Color Theme */}
                        <div>
                            <label style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: '#1A202C',
                                marginBottom: 8,
                                display: 'block'
                            }}>
                                Color Theme
                            </label>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: 8
                            }}>
                                {Object.entries(COLOR_THEMES).map(([key, theme]) => (
                                    <button
                                        key={key}
                                        onClick={() => setColorTheme(key)}
                                        style={{
                                            padding: '10px 12px',
                                            borderRadius: '8px',
                                            border: roomConfig.colorTheme === key
                                                ? '2px solid #1A202C'
                                                : '1px solid rgba(0,0,0,0.1)',
                                            background: roomConfig.colorTheme === key
                                                ? '#1A202C'
                                                : 'rgba(0,0,0,0.02)',
                                            color: roomConfig.colorTheme === key ? '#FFFFFF' : '#1A202C',
                                            cursor: 'pointer',
                                            fontSize: 11,
                                            fontWeight: 500,
                                            transition: 'all 0.15s ease',
                                            textAlign: 'left'
                                        }}
                                    >
                                        {theme.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Lighting */}
                        <div>
                            <label style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: '#1A202C',
                                marginBottom: 8,
                                display: 'block'
                            }}>
                                Lighting
                            </label>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 8
                            }}>
                                {Object.entries(LIGHTING_PRESETS).map(([key, preset]) => (
                                    <button
                                        key={key}
                                        onClick={() => setLighting(key)}
                                        style={{
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            border: roomConfig.lighting === key
                                                ? '2px solid #1A202C'
                                                : '1px solid rgba(0,0,0,0.1)',
                                            background: roomConfig.lighting === key
                                                ? '#1A202C'
                                                : 'rgba(0,0,0,0.02)',
                                            color: roomConfig.lighting === key ? '#FFFFFF' : '#1A202C',
                                            cursor: 'pointer',
                                            fontSize: 11,
                                            fontWeight: 500,
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        {preset.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Wall Colors */}
                        <div>
                            <label style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: '#1A202C',
                                marginBottom: 8,
                                display: 'block'
                            }}>
                                Wall Colors
                            </label>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: 8
                            }}>
                                {WALL_COLOR_PRESETS.map((preset, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            updateRoomConfig({
                                                leftWall: {
                                                    ...roomConfig.leftWall,
                                                    color: preset.color,
                                                    topColor: preset.topColor
                                                },
                                                rightWall: {
                                                    ...roomConfig.rightWall,
                                                    color: preset.color,
                                                    topColor: preset.topColor
                                                },
                                                backWall: {
                                                    ...roomConfig.backWall,
                                                    color: preset.color,
                                                    topColor: preset.topColor
                                                }
                                            });
                                        }}
                                        style={{
                                            aspectRatio: '1',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            background: preset.color,
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease',
                                            position: 'relative'
                                        }}
                                        title={preset.name}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Floor Colors */}
                        <div>
                            <label style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: '#1A202C',
                                marginBottom: 8,
                                display: 'block'
                            }}>
                                Floor Colors
                            </label>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: 8
                            }}>
                                {FLOOR_COLOR_PRESETS.map((preset, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            updateRoomConfig({
                                                floor: {
                                                    ...roomConfig.floor,
                                                    color: preset.color,
                                                    color2: preset.color2
                                                }
                                            });
                                        }}
                                        style={{
                                            aspectRatio: '1',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            background: `linear-gradient(135deg, ${preset.color} 0%, ${preset.color2} 100%)`,
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease'
                                        }}
                                        title={preset.name}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Wall Visibility Toggle */}
                        <div>
                            <label style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: '#1A202C',
                                marginBottom: 8,
                                display: 'block'
                            }}>
                                Wall Visibility
                            </label>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8
                            }}>
                                {[
                                    { key: 'leftWall', label: 'Left Wall' },
                                    { key: 'rightWall', label: 'Right Wall' },
                                    { key: 'backWall', label: 'Back Wall' }
                                ].map(({ key, label }) => (
                                    <label
                                        key={key}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            fontSize: 11,
                                            color: '#1A202C',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <span>{label}</span>
                                        <input
                                            type="checkbox"
                                            checked={roomConfig[key]?.visible !== false}
                                            onChange={(e) => {
                                                updateRoomConfig({
                                                    [key]: {
                                                        ...roomConfig[key],
                                                        visible: e.target.checked
                                                    }
                                                });
                                            }}
                                            style={{
                                                cursor: 'pointer'
                                            }}
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Left Sidebar - Floating Library Card - only in edit mode */}
            {isEditMode && libraryOpen && (
                <div style={{
                    position: 'absolute',
                    top: 72,
                    left: 24,
                    bottom: 24,
                    width: 300,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(250,252,255,0.98) 100%)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    pointerEvents: 'auto',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.5)'
                }}>
                    {/* Categories - Beautiful */}
                    <div style={{
                        display: 'flex',
                        gap: 6,
                        padding: '14px',
                        overflowX: 'auto',
                        borderBottom: '1px solid rgba(0,0,0,0.06)',
                        background: 'rgba(248,250,252,0.5)'
                    }}>
                        {Categories.map((cat) => {
                            const Icon = CategoryIcons[cat] || Box;
                            const isActive = activeCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    style={{
                                        padding: '8px 14px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: isActive
                                            ? 'linear-gradient(135deg, #1A202C 0%, #2D3748 100%)'
                                            : 'rgba(255,255,255,0.8)',
                                        color: isActive ? '#FFFFFF' : '#1A202C',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        fontSize: 11,
                                        fontWeight: isActive ? 600 : 500,
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                        boxShadow: isActive ? '0 2px 8px rgba(26,32,44,0.2)' : 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = 'rgba(255,255,255,1)';
                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.8)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }
                                    }}
                                >
                                    <Icon size={13} />
                                    {cat}
                                </button>
                            );
                        })}
                    </div>

                    {/* Grid - Minimal with 3D Previews */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '12px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 10,
                        alignContent: 'start'
                    }}>
                        {filteredItems.map(([type, item]) => (
                            <div
                                key={type}
                                onClick={() => addObject(type)}
                                style={{
                                    aspectRatio: '1',
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid rgba(0,0,0,0.08)',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    padding: 8,
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(241,245,249,1) 100%)';
                                    e.currentTarget.style.borderColor = 'rgba(26,32,44,0.2)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)';
                                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                {/* 3D Preview */}
                                <div style={{
                                    width: '100%',
                                    height: '70%',
                                    position: 'relative',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    background: 'rgba(255,255,255,0.5)'
                                }}>
                                    <ObjectPreview type={type} />
                                </div>
                                {/* Label */}
                                <span style={{
                                    fontSize: 10,
                                    textAlign: 'center',
                                    color: '#1A202C',
                                    fontWeight: 600,
                                    marginTop: 6,
                                    letterSpacing: '-0.01em'
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
                background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(250,252,255,0.98) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '10px 16px',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                pointerEvents: 'auto',
                zIndex: 100
            }}>
                <div style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#1A202C',
                    letterSpacing: '-0.01em',
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {chamberName}
                </div>
            </div>

            {/* Human Controls Hint - only in view mode when human exists */}
            {!isEditMode && objects.some(obj => obj.type === 'human') && (
                <div style={{
                    position: 'absolute',
                    bottom: 24,
                    right: 24,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(250,252,255,0.98) 100%)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    padding: '12px 16px',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    pointerEvents: 'auto',
                    zIndex: 100,
                    maxWidth: 250
                }}>
                    <div style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#1A202C',
                        marginBottom: 6
                    }}>
                        🎮 Human Controls
                    </div>
                    <div style={{
                        fontSize: 10,
                        color: '#6B7280',
                        lineHeight: 1.5
                    }}>
                        <div>WASD - Move</div>
                        <div>Space - Jump</div>
                    </div>
                </div>
            )}

            {/* Leva Panel (Properties) - only in edit mode when object selected and transform panel not shown */}
            {isEditMode && selectedId && false && (
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

            {/* NFT Library Modal */}
            <NFTLibrary isOpen={showNFTLibrary} onClose={() => setShowNFTLibrary(false)} />

            {/* Performance Notification */}
            {performanceNotification && (
                <PerformanceNotification
                    show={performanceNotification.show}
                    message={performanceNotification.message}
                    isCritical={performanceNotification.isCritical}
                    onDismiss={() => setPerformanceNotification(null)}
                />
            )}

            {/* Custom Scrollbar & Animations */}
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
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default UIOverlay;
