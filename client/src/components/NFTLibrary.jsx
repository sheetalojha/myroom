import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { Package, Image as ImageIcon, Loader, X, Home, Clock, ChevronRight } from 'lucide-react';
import blockchainService from '../services/blockchainService';
import { deserializeScene } from '../utils/sceneSerializer';
import useStore from '../store/useStore';

const NFTLibrary = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { address, isConnected } = useAccount();
    const loadScene = useStore((state) => state.loadScene);
    const setMode = useStore((state) => state.setMode);
    const setCurrentChamberTokenId = useStore((state) => state.setCurrentChamberTokenId);

    const [objects, setObjects] = useState([]);
    const [scenes, setScenes] = useState([]);
    const [groupedScenes, setGroupedScenes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('scenes');

    useEffect(() => {
        if (isConnected && address && isOpen) {
            fetchUserNFTs();
        }
    }, [isConnected, address, isOpen]);

    const fetchUserNFTs = async () => {
        setLoading(true);
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            await blockchainService.initialize(provider);

            const [userObjects, userScenes] = await Promise.all([
                blockchainService.getUserObjects(address),
                blockchainService.getUserScenes(address),
            ]);

            setObjects(userObjects);
            setScenes(userScenes);
            
            const grouped = groupScenesByVersion(userScenes);
            setGroupedScenes(grouped);
        } catch (error) {
            console.error('Error fetching NFTs:', error);
        } finally {
            setLoading(false);
        }
    };

    const groupScenesByVersion = (scenesList) => {
        const groups = new Map();
        const processed = new Set();
        
        const nameGroups = new Map();
        scenesList.forEach(scene => {
            const name = scene.name || `Chamber #${scene.tokenId}`;
            if (!nameGroups.has(name)) {
                nameGroups.set(name, []);
            }
            nameGroups.get(name).push(scene);
        });
        
        nameGroups.forEach((scenesWithSameName, name) => {
            const nameGroupMap = new Map();
            
            scenesWithSameName.forEach(scene => {
                const parentId = scene.parentTokenId || 0;
                if (parentId === 0 && !processed.has(scene.tokenId)) {
                    const groupKey = `${name}-${scene.tokenId}`;
                    nameGroupMap.set(groupKey, {
                        root: scene,
                        versions: [scene]
                    });
                    processed.add(scene.tokenId);
                }
            });
            
            scenesWithSameName.forEach(scene => {
                if (processed.has(scene.tokenId)) return;
                
                const parentId = scene.parentTokenId || 0;
                if (parentId !== 0) {
                    let currentParentId = parentId;
                    let rootId = null;
                    
                    while (currentParentId !== 0) {
                        const parentScene = scenesWithSameName.find(s => s.tokenId === currentParentId);
                        if (!parentScene) break;
                        if (parentScene.parentTokenId === 0 || !parentScene.parentTokenId) {
                            rootId = parentScene.tokenId;
                            break;
                        }
                        currentParentId = parentScene.parentTokenId;
                    }
                    
                    const groupKey = `${name}-${rootId}`;
                    if (rootId && nameGroupMap.has(groupKey)) {
                        nameGroupMap.get(groupKey).versions.push(scene);
                        processed.add(scene.tokenId);
                    } else if (rootId) {
                        const rootScene = scenesWithSameName.find(s => s.tokenId === rootId);
                        if (rootScene) {
                            nameGroupMap.set(groupKey, {
                                root: rootScene,
                                versions: [rootScene, scene]
                            });
                            processed.add(scene.tokenId);
                            processed.add(rootId);
                        }
                    }
                }
            });
            
            const unprocessed = scenesWithSameName.filter(s => !processed.has(s.tokenId));
            if (unprocessed.length > 0) {
                const firstScene = unprocessed[0];
                const groupKey = `${name}-${firstScene.tokenId}`;
                if (!nameGroupMap.has(groupKey)) {
                    nameGroupMap.set(groupKey, {
                        root: firstScene,
                        versions: unprocessed
                    });
                    unprocessed.forEach(s => processed.add(s.tokenId));
                } else {
                    nameGroupMap.get(groupKey).versions.push(...unprocessed);
                    unprocessed.forEach(s => processed.add(s.tokenId));
                }
            }
            
            nameGroupMap.forEach((group, key) => {
                groups.set(key, group);
            });
        });
        
        groups.forEach(group => {
            group.versions.sort((a, b) => (a.version || 1) - (b.version || 1));
        });
        
        return Array.from(groups.values());
    };

    const handleLoadScene = async (scene) => {
        try {
            setLoading(true);
            const provider = new ethers.BrowserProvider(window.ethereum);
            await blockchainService.initialize(provider);
            
            const sceneData = await blockchainService.fetchSceneFromIPFS(scene.sceneCID);
            const deserializedData = deserializeScene(sceneData);
            loadScene(deserializedData);
            setMode('edit');
            setCurrentChamberTokenId(scene.tokenId);
            
            navigate('/editor');
            onClose();
        } catch (error) {
            console.error('Error loading chamber:', error);
            alert('Failed to load chamber: ' + (error.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const modalContent = (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                pointerEvents: 'auto',
            }} 
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div 
                style={{
                    background: '#ffffff',
                    borderRadius: '8px',
                    width: '90%',
                    maxWidth: 800,
                    maxHeight: '85vh',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                    overflow: 'hidden',
                    position: 'relative',
                    pointerEvents: 'auto',
                }} 
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    padding: '24px',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#111827',
                    }}>
                        My Chambers
                    </h2>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Close button clicked');
                            onClose();
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            width: 32,
                            height: 32,
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#6b7280',
                            pointerEvents: 'auto',
                            zIndex: 10001,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f3f4f6';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    gap: 0,
                    borderBottom: '1px solid #e5e7eb',
                }}>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Scenes tab clicked');
                            setActiveTab('scenes');
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === 'scenes' ? '2px solid #111827' : '2px solid transparent',
                            padding: '12px 20px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: '14px',
                            fontWeight: activeTab === 'scenes' ? 600 : 400,
                            color: activeTab === 'scenes' ? '#111827' : '#6b7280',
                            transition: 'all 0.15s',
                            pointerEvents: 'auto',
                        }}
                    >
                        <ImageIcon size={16} />
                        Chambers ({scenes.length})
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Objects tab clicked');
                            setActiveTab('objects');
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === 'objects' ? '2px solid #111827' : '2px solid transparent',
                            padding: '12px 20px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: '14px',
                            fontWeight: activeTab === 'objects' ? 600 : 400,
                            color: activeTab === 'objects' ? '#111827' : '#6b7280',
                            transition: 'all 0.15s',
                            pointerEvents: 'auto',
                        }}
                    >
                        <Package size={16} />
                        Objects ({objects.length})
                    </button>
                </div>

                {/* Content */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '24px',
                }}>
                    {loading ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '60px 20px',
                        }}>
                            <Loader style={{
                                animation: 'spin 1s linear infinite'
                            }} size={24} color="#6b7280" />
                            <p style={{
                                marginTop: 16,
                                fontSize: '14px',
                                color: '#6b7280',
                            }}>
                                Loading...
                            </p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'scenes' && (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 16,
                                }}>
                                    {groupedScenes.length === 0 ? (
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '60px 20px',
                                        }}>
                                            <Home size={32} color="#9ca3af" />
                                            <p style={{
                                                marginTop: 16,
                                                fontSize: '14px',
                                                color: '#6b7280',
                                            }}>
                                                No chambers yet
                                            </p>
                                        </div>
                                    ) : (
                                        groupedScenes.map((group) => (
                                            <div
                                                key={group.root.tokenId}
                                                style={{
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '6px',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {/* Chamber Header */}
                                                <div style={{
                                                    padding: '16px',
                                                    borderBottom: '1px solid #e5e7eb',
                                                    background: '#f9fafb',
                                                }}>
                                                    <div style={{
                                                        fontSize: '15px',
                                                        fontWeight: 600,
                                                        color: '#111827',
                                                        marginBottom: 4,
                                                    }}>
                                                        {group.root.name || `Chamber #${group.root.tokenId}`}
                                                    </div>
                                                    <div style={{
                                                        fontSize: '12px',
                                                        color: '#6b7280',
                                                    }}>
                                                        {group.versions.length} {group.versions.length === 1 ? 'version' : 'versions'} • #{group.root.tokenId}
                                                    </div>
                                                </div>
                                                
                                                {/* Versions */}
                                                <div>
                                                    {group.versions.map((scene, index) => (
                                                        <div
                                                            key={scene.tokenId}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                console.log('Version clicked:', scene.tokenId);
                                                                handleLoadScene(scene);
                                                            }}
                                                            style={{
                                                                padding: '16px',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                borderBottom: index < group.versions.length - 1 ? '1px solid #e5e7eb' : 'none',
                                                                transition: 'background 0.15s',
                                                                pointerEvents: 'auto',
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.background = '#f9fafb';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.background = 'transparent';
                                                            }}
                                                        >
                                                            <div style={{ flex: 1, pointerEvents: 'none' }}>
                                                                <div style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 8,
                                                                    marginBottom: 6,
                                                                }}>
                                                                    <span style={{
                                                                        fontSize: '14px',
                                                                        fontWeight: 500,
                                                                        color: '#111827',
                                                                    }}>
                                                                        Version {scene.version}
                                                                    </span>
                                                                    {index === group.versions.length - 1 && (
                                                                        <span style={{
                                                                            fontSize: '11px',
                                                                            padding: '2px 6px',
                                                                            background: '#111827',
                                                                            color: '#ffffff',
                                                                            borderRadius: '4px',
                                                                            fontWeight: 500,
                                                                        }}>
                                                                            Latest
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 16,
                                                                    fontSize: '12px',
                                                                    color: '#6b7280',
                                                                }}>
                                                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                        <Package size={12} />
                                                                        {scene.objectTokenIds.length} {scene.objectTokenIds.length === 1 ? 'item' : 'items'}
                                                                    </span>
                                                                    {scene.createdAtDate && (
                                                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                            <Clock size={12} />
                                                                            {new Date(scene.createdAtDate).toLocaleDateString('en-US', { 
                                                                                month: 'short', 
                                                                                day: 'numeric',
                                                                                year: 'numeric'
                                                                            })}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <ChevronRight size={16} color="#9ca3af" style={{ pointerEvents: 'none' }} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === 'objects' && (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 8,
                                }}>
                                    {objects.length === 0 ? (
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '60px 20px',
                                        }}>
                                            <Package size={32} color="#9ca3af" />
                                            <p style={{
                                                marginTop: 16,
                                                fontSize: '14px',
                                                color: '#6b7280',
                                            }}>
                                                No objects yet
                                            </p>
                                        </div>
                                    ) : (
                                        objects.map((obj) => (
                                            <div
                                                key={obj.tokenId}
                                                style={{
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '6px',
                                                    padding: '16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 12,
                                                }}
                                            >
                                                <div style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '6px',
                                                    background: '#f3f4f6',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                }}>
                                                    <Package size={18} color="#6b7280" />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{
                                                        fontSize: '14px',
                                                        fontWeight: 500,
                                                        color: '#111827',
                                                        marginBottom: 4,
                                                    }}>
                                                        #{obj.tokenId}
                                                    </div>
                                                    <div style={{
                                                        display: 'flex',
                                                        gap: 8,
                                                        alignItems: 'center',
                                                        fontSize: '12px',
                                                        color: '#6b7280',
                                                    }}>
                                                        <span>{obj.objectType}</span>
                                                        <span>•</span>
                                                        <span>v{obj.version}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default NFTLibrary;
