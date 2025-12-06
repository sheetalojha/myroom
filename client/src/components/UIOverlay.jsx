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
import { Button, Card } from './ui';
import theme from '../styles/theme';
import useIsMobile from '../hooks/useIsMobile';
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
    const isMobile = useIsMobile();
    
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

    // On mobile, if library is open, close customize and vice versa
    useEffect(() => {
        if (isMobile) {
            if (libraryOpen && customizeOpen) {
                setCustomizeOpen(false);
            }
        }
    }, [libraryOpen, isMobile]);

    useEffect(() => {
        if (isMobile) {
            if (customizeOpen && libraryOpen) {
                setLibraryOpen(false);
            }
        }
    }, [customizeOpen, isMobile]);


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
            {/* Top Navbar - Fixed and Clean */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: 56,
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderBottom: `1px solid rgba(0, 0, 0, 0.08)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: `0 ${isMobile ? theme.spacing[3] : theme.spacing[6]}`,
                pointerEvents: 'auto',
                zIndex: theme.zIndex.fixed
            }}>
                {/* Left Section */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? theme.spacing[2] : theme.spacing[4]
                }}>
                    {/* Logo */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing[2],
                        cursor: 'pointer'
                    }} onClick={() => window.location.href = '/'}>
                        <span style={{
                            fontSize: theme.typography.fontSize.lg,
                            fontWeight: theme.typography.fontWeight.semibold,
                            color: theme.colors.text.primary,
                            letterSpacing: theme.typography.letterSpacing.tight,
                            display: isMobile ? 'none' : 'block'
                        }}>
                            LittleWorlds
                        </span>
                        {isMobile && (
                            <span style={{
                                fontSize: theme.typography.fontSize.lg,
                                fontWeight: theme.typography.fontWeight.bold,
                                color: theme.colors.text.primary,
                            }}>
                                LW
                            </span>
                        )}
                    </div>

                    {/* Mode Toggle */}
                    <div style={{
                        display: 'flex',
                        background: theme.colors.neutral[100],
                        borderRadius: theme.borderRadius.md,
                        padding: theme.spacing[1],
                        gap: theme.spacing[1]
                    }}>
                        <button
                            onClick={() => setMode('edit')}
                            style={{
                                padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
                                borderRadius: theme.borderRadius.sm,
                                border: 'none',
                                background: isEditMode ? theme.colors.text.primary : 'transparent',
                                color: isEditMode ? theme.colors.text.inverse : theme.colors.text.secondary,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: theme.spacing[1],
                                fontSize: theme.typography.fontSize.sm,
                                fontWeight: theme.typography.fontWeight.medium,
                                transition: `all ${theme.transitions.fast} ${theme.easing.easeOut}`
                            }}
                        >
                            <Edit3 size={14} />
                            {isMobile ? '' : 'Edit'}
                        </button>
                        <button
                            onClick={() => setMode('view')}
                            style={{
                                padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
                                borderRadius: theme.borderRadius.sm,
                                border: 'none',
                                background: !isEditMode ? theme.colors.text.primary : 'transparent',
                                color: !isEditMode ? theme.colors.text.inverse : theme.colors.text.secondary,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: theme.spacing[1],
                                fontSize: theme.typography.fontSize.sm,
                                fontWeight: theme.typography.fontWeight.medium,
                                transition: `all ${theme.transitions.fast} ${theme.easing.easeOut}`
                            }}
                        >
                            <Eye size={14} />
                            {isMobile ? '' : 'View'}
                        </button>
                    </div>

                    {/* Library Toggle - only in edit mode */}
                    {isEditMode && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setLibraryOpen(!libraryOpen)}
                                icon={libraryOpen ? X : Menu}
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    if (selectedId) {
                                        selectObject(null);
                                    } else {
                                        setCustomizeOpen(!customizeOpen);
                                    }
                                }}
                                icon={Palette}
                                style={{
                                    background: customizeOpen || selectedId ? theme.colors.neutral[200] : 'transparent'
                                }}
                            />
                        </>
                    )}
                </div>

                {/* Right Section */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing[3]
                }}>
                    {/* Wallet Connect */}
                    <WalletConnect />
                </div>
            </div>

            {/* Top Right - Floating Save/Load Buttons - only in edit mode */}
            {isEditMode && !isMobile && (
                <div style={{
                    position: 'absolute',
                    top: 72,
                    right: theme.spacing[6],
                    display: 'flex',
                    gap: theme.spacing[2],
                    pointerEvents: 'auto',
                    zIndex: theme.zIndex.fixed
                }}>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSave}
                        icon={Save}
                    >
                        Save
                    </Button>
                    <label style={{ cursor: 'pointer' }}>
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={Upload}
                            style={{ pointerEvents: 'none' }}
                        >
                            Load
                        </Button>
                        <input type="file" accept=".json" onChange={handleLoad} style={{ display: 'none' }} />
                    </label>
                </div>
            )}

            {/* Mobile Save/Load - In a simplified location or menu */}
             {isEditMode && isMobile && (
                 <div style={{
                    position: 'fixed',
                    bottom: 80, // Above bottom panel
                    right: theme.spacing[3],
                    display: 'flex',
                    flexDirection: 'column',
                    gap: theme.spacing[2],
                    pointerEvents: 'auto',
                    zIndex: theme.zIndex.fixed
                 }}>
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSave}
                        icon={Save}
                        style={{ backgroundColor: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                    />
                 </div>
             )}

            {/* Bottom Horizontal Section - Publish Panel & My Rooms - only in edit mode */}
            {isEditMode && (
                <div style={{
                    position: 'absolute',
                    bottom: theme.spacing[6],
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing[3],
                    pointerEvents: 'auto',
                    zIndex: theme.zIndex.fixed,
                    width: isMobile ? '90%' : 'auto',
                    justifyContent: 'center',
                    flexWrap: isMobile ? 'wrap' : 'nowrap'
                }}>
                    <PublishPanel />
                    <Button
                        variant="ghost"
                        size="md"
                        onClick={() => setShowNFTLibrary(true)}
                        icon={Package}
                    >
                        My Rooms
                    </Button>
                </div>
            )}

            {/* Right Sidebar - Object Transform Panel - only in edit mode when object is selected */}
            {isEditMode && selectedId && (
                <ObjectTransformPanel onClose={() => selectObject(null)} />
            )}

            {/* Customization Panel - only in edit mode when no object selected */}
            {isEditMode && customizeOpen && !selectedId && (
                <Card
                    variant="simple"
                    padding="none"
                    style={{
                        position: 'absolute',
                        top: isMobile ? 'auto' : 72,
                        right: isMobile ? 0 : theme.spacing[6],
                        bottom: isMobile ? 0 : theme.spacing[6],
                        left: isMobile ? 0 : 'auto',
                        width: isMobile ? '100%' : 320,
                        height: isMobile ? '50vh' : 'auto',
                        maxHeight: isMobile ? '50vh' : 'calc(100vh - 96px)',
                        borderRadius: isMobile ? '20px 20px 0 0' : theme.borderRadius.md,
                        display: 'flex',
                        flexDirection: 'column',
                        pointerEvents: 'auto',
                        overflow: 'hidden',
                        zIndex: theme.zIndex.dropdown,
                        border: `1px solid ${theme.colors.border.medium}`,
                        borderBottom: isMobile ? 'none' : `1px solid ${theme.colors.border.medium}`,
                        boxShadow: isMobile ? '0 -4px 20px rgba(0,0,0,0.1)' : 'none'
                    }}
                >
                    <div style={{
                        padding: theme.spacing[4],
                        borderBottom: `1px solid ${theme.colors.border.medium}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: theme.spacing[2]
                    }}>
                        <div style={{display: 'flex', alignItems: 'center', gap: theme.spacing[2]}}>
                            <Settings size={16} color={theme.colors.text.primary} />
                            <span style={{
                                fontSize: theme.typography.fontSize.md,
                                fontWeight: theme.typography.fontWeight.semibold,
                                color: theme.colors.text.primary
                            }}>
                                Customize Room
                            </span>
                        </div>
                         {isMobile && (
                            <button 
                                onClick={() => setCustomizeOpen(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 4
                                }}
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: theme.spacing[4],
                        display: 'flex',
                        flexDirection: 'column',
                        gap: theme.spacing[5]
                    }}>
                        {/* Color Theme */}
                        <div>
                            <label style={{
                                fontSize: theme.typography.fontSize.base,
                                fontWeight: theme.typography.fontWeight.semibold,
                                color: theme.colors.text.primary,
                                marginBottom: theme.spacing[2],
                                display: 'block'
                            }}>
                                Color Theme
                            </label>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: theme.spacing[2]
                            }}>
                                {Object.entries(COLOR_THEMES).map(([key, themeConfig]) => (
                                    <button
                                        key={key}
                                        onClick={() => setColorTheme(key)}
                                        style={{
                                            padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                                            borderRadius: theme.borderRadius.md,
                                            border: roomConfig.colorTheme === key
                                                ? `2px solid ${theme.colors.text.primary}`
                                                : theme.borders.cardOuter,
                                            background: roomConfig.colorTheme === key
                                                ? theme.colors.text.primary
                                                : 'transparent',
                                            color: roomConfig.colorTheme === key ? theme.colors.text.inverse : theme.colors.text.primary,
                                            cursor: 'pointer',
                                            fontSize: theme.typography.fontSize.sm,
                                            fontWeight: theme.typography.fontWeight.medium,
                                            transition: `all ${theme.transitions.fast} ${theme.easing.easeOut}`,
                                            textAlign: 'left'
                                        }}
                                    >
                                        {themeConfig.name}
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
                </Card>
            )}

            {/* Library Card - only in edit mode */}
            {isEditMode && libraryOpen && (
                <Card
                    variant="simple"
                    padding="none"
                    style={{
                        position: 'absolute',
                        top: isMobile ? 'auto' : 72,
                        left: isMobile ? 0 : theme.spacing[6],
                        bottom: isMobile ? 0 : theme.spacing[6],
                        right: isMobile ? 0 : 'auto',
                        width: isMobile ? '100%' : 300,
                        height: isMobile ? '50vh' : 'auto',
                        maxHeight: isMobile ? '50vh' : 'calc(100vh - 96px)',
                        borderRadius: isMobile ? '20px 20px 0 0' : theme.borderRadius.md,
                        display: 'flex',
                        flexDirection: 'column',
                        pointerEvents: 'auto',
                        overflow: 'hidden',
                        zIndex: theme.zIndex.dropdown,
                        border: `1px solid ${theme.colors.border.medium}`,
                        borderBottom: isMobile ? 'none' : `1px solid ${theme.colors.border.medium}`,
                        boxShadow: isMobile ? '0 -4px 20px rgba(0,0,0,0.1)' : 'none'
                    }}
                >
                     {isMobile && (
                         <div style={{
                            padding: theme.spacing[2],
                            display: 'flex',
                            justifyContent: 'flex-end',
                            borderBottom: `1px solid ${theme.colors.border.medium}`
                         }}>
                             <button 
                                onClick={() => setLibraryOpen(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 4
                                }}
                            >
                                <X size={20} />
                            </button>
                         </div>
                     )}
                    {/* Categories */}
                    <div style={{
                        display: 'flex',
                        gap: theme.spacing[2],
                        padding: theme.spacing[3],
                        overflowX: 'auto',
                        borderBottom: `1px solid ${theme.colors.border.medium}`,
                        background: theme.colors.neutral[50]
                    }}>
                        {Categories.map((cat) => {
                            const Icon = CategoryIcons[cat] || Box;
                            const isActive = activeCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    style={{
                                        padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                                        borderRadius: theme.borderRadius.md,
                                        border: 'none',
                                        background: isActive
                                            ? theme.colors.text.primary
                                            : 'transparent',
                                        color: isActive ? theme.colors.text.inverse : theme.colors.text.primary,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: theme.spacing[2],
                                        fontSize: theme.typography.fontSize.sm,
                                        fontWeight: isActive ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium,
                                        whiteSpace: 'nowrap',
                                        transition: `all ${theme.transitions.fast} ${theme.easing.easeOut}`,
                                        boxShadow: 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = theme.colors.neutral[100];
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = 'transparent';
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
                        padding: theme.spacing[3],
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: theme.spacing[2],
                        alignContent: 'start'
                    }}>
                        {filteredItems.map(([type, item]) => (
                            <Card
                                key={type}
                                variant="simple"
                                padding="sm"
                                hover
                                onClick={() => addObject(type)}
                                style={{
                                    aspectRatio: '1',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: theme.spacing[2],
                                    position: 'relative',
                                    overflow: 'hidden',
                                    border: `1px solid ${theme.colors.border.medium}`
                                }}
                            >
                                {/* 3D Preview */}
                                <div style={{
                                    width: '100%',
                                    height: '70%',
                                    position: 'relative',
                                    borderRadius: theme.borderRadius.md,
                                    overflow: 'hidden',
                                    background: theme.colors.background.overlay
                                }}>
                                    <ObjectPreview type={type} />
                                </div>
                                {/* Label */}
                                <span style={{
                                    fontSize: theme.typography.fontSize.xs,
                                    textAlign: 'center',
                                    color: theme.colors.text.primary,
                                    fontWeight: theme.typography.fontWeight.semibold,
                                    marginTop: theme.spacing[2],
                                    letterSpacing: theme.typography.letterSpacing.tight
                                }}>
                                    {item.label}
                                </span>
                            </Card>
                        ))}
                    </div>
                </Card>
            )}

            {/* Bottom Left - Floating Room Info - hide on mobile edit mode if covered */}
            {(!isMobile || !isEditMode) && (
                <Card
                    variant="simple"
                    padding="sm"
                    style={{
                        position: 'absolute',
                        bottom: theme.spacing[6],
                        left: theme.spacing[6],
                        pointerEvents: 'auto',
                        zIndex: theme.zIndex.fixed,
                        border: `1px solid ${theme.colors.border.medium}`
                    }}
                >
                    <div style={{
                        fontSize: theme.typography.fontSize.base,
                        fontWeight: theme.typography.fontWeight.semibold,
                        color: theme.colors.text.primary,
                        letterSpacing: theme.typography.letterSpacing.tight,
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {chamberName}
                    </div>
                </Card>
            )}

            {/* Human Controls Hint - only in view mode when human exists */}
            {!isEditMode && objects.some(obj => obj.type === 'human') && !isMobile && (
                <Card
                    variant="simple"
                    padding="md"
                    style={{
                        position: 'absolute',
                        bottom: theme.spacing[6],
                        right: theme.spacing[6],
                        pointerEvents: 'auto',
                        zIndex: theme.zIndex.fixed,
                        maxWidth: 250,
                        border: `1px solid ${theme.colors.border.medium}`
                    }}
                >
                    <div style={{
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.semibold,
                        color: theme.colors.text.primary,
                        marginBottom: theme.spacing[2]
                    }}>
                        🎮 Human Controls
                    </div>
                    <div style={{
                        fontSize: theme.typography.fontSize.xs,
                        color: theme.colors.text.secondary,
                        lineHeight: theme.typography.lineHeight.normal
                    }}>
                        <div>WASD - Move</div>
                        <div>Space - Jump</div>
                    </div>
                </Card>
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
