import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { Package, Image as ImageIcon, Loader, Download, X, Home } from 'lucide-react';
import blockchainService from '../services/blockchainService';
import { deserializeScene } from '../utils/sceneSerializer';
import useStore from '../store/useStore';

const NFTLibrary = ({ isOpen, onClose }) => {
    const { address, isConnected } = useAccount();
    const loadScene = useStore((state) => state.loadScene);

    const [objects, setObjects] = useState([]);
    const [scenes, setScenes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('objects'); // 'objects' or 'scenes'

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
        } catch (error) {
            console.error('Error fetching NFTs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadScene = async (scene) => {
        try {
            // Fetch scene data from IPFS
            const sceneData = await blockchainService.fetchSceneFromIPFS(scene.sceneCID);

            // Deserialize and load into editor
            const objects = deserializeScene(sceneData);
            loadScene({ objects });

            onClose();
        } catch (error) {
            console.error('Error loading scene:', error);
            alert('Failed to load scene from IPFS');
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            pointerEvents: 'auto'
        }} onClick={onClose}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                width: '90%',
                maxWidth: 720,
                maxHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 24px 64px rgba(0, 0, 0, 0.2)',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.3)'
            }} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(0,0,0,0.02)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10
                    }}>
                        <Home size={20} color="#1A202C" />
                        <h2 style={{
                            margin: 0,
                            fontSize: 18,
                            fontWeight: 600,
                            color: '#1A202C',
                            letterSpacing: '-0.01em'
                        }}>
                            My Rooms
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            width: 32,
                            height: 32,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#6B7280',
                            transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(0,0,0,0.06)';
                            e.currentTarget.style.color = '#1A202C';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#6B7280';
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    gap: 4,
                    padding: '12px 20px',
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                    background: 'rgba(0,0,0,0.01)'
                }}>
                    <button
                        onClick={() => setActiveTab('scenes')}
                        style={{
                            background: activeTab === 'scenes' ? '#1A202C' : 'transparent',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 12,
                            fontWeight: activeTab === 'scenes' ? 600 : 500,
                            color: activeTab === 'scenes' ? '#FFFFFF' : '#6B7280',
                            transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== 'scenes') {
                                e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== 'scenes') {
                                e.currentTarget.style.background = 'transparent';
                            }
                        }}
                    >
                        <ImageIcon size={14} />
                        Rooms ({scenes.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('objects')}
                        style={{
                            background: activeTab === 'objects' ? '#1A202C' : 'transparent',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 12,
                            fontWeight: activeTab === 'objects' ? 600 : 500,
                            color: activeTab === 'objects' ? '#FFFFFF' : '#6B7280',
                            transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== 'objects') {
                                e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== 'objects') {
                                e.currentTarget.style.background = 'transparent';
                            }
                        }}
                    >
                        <Package size={14} />
                        Objects ({objects.length})
                    </button>
                </div>

                {/* Content */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '20px'
                }}>
                    {loading ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '60px 20px',
                            color: '#6B7280'
                        }}>
                            <Loader style={{
                                animation: 'spin 1s linear infinite'
                            }} size={28} color="#6B7280" />
                            <p style={{
                                marginTop: 16,
                                fontSize: 14,
                                fontWeight: 500,
                                color: '#6B7280'
                            }}>
                                Loading your rooms...
                            </p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'scenes' && (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                    gap: 12
                                }}>
                                    {scenes.length === 0 ? (
                                        <div style={{
                                            gridColumn: '1 / -1',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '60px 20px',
                                            color: '#9CA3AF'
                                        }}>
                                            <Home size={40} color="#9CA3AF" />
                                            <p style={{
                                                marginTop: 16,
                                                fontSize: 14,
                                                fontWeight: 500,
                                                color: '#6B7280',
                                                marginBottom: 4
                                            }}>
                                                No rooms yet
                                            </p>
                                            <small style={{
                                                fontSize: 12,
                                                color: '#9CA3AF'
                                            }}>
                                                Publish a scene to create your first room
                                            </small>
                                        </div>
                                    ) : (
                                        scenes.map((scene) => (
                                            <div
                                                key={scene.tokenId}
                                                style={{
                                                    background: 'rgba(0,0,0,0.02)',
                                                    borderRadius: '16px',
                                                    padding: '16px',
                                                    border: '1px solid rgba(0,0,0,0.06)',
                                                    transition: 'all 0.2s ease',
                                                    cursor: 'pointer'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
                                                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)';
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'rgba(0,0,0,0.02)';
                                                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)';
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                }}
                                            >
                                                <div style={{
                                                    aspectRatio: '1',
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    borderRadius: '12px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginBottom: 12,
                                                    color: 'white'
                                                }}>
                                                    <Home size={28} />
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 8
                                                }}>
                                                    <div style={{
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                        color: '#1A202C'
                                                    }}>
                                                        {scene.name || `Room #${scene.tokenId}`}
                                                    </div>
                                                    <div style={{
                                                        display: 'flex',
                                                        gap: 6,
                                                        flexWrap: 'wrap'
                                                    }}>
                                                        <span style={{
                                                            fontSize: 10,
                                                            padding: '4px 8px',
                                                            background: 'rgba(0,0,0,0.06)',
                                                            borderRadius: '6px',
                                                            color: '#6B7280',
                                                            fontWeight: 500
                                                        }}>
                                                            {scene.objectTokenIds.length} items
                                                        </span>
                                                        <span style={{
                                                            fontSize: 10,
                                                            padding: '4px 8px',
                                                            background: 'rgba(0,0,0,0.06)',
                                                            borderRadius: '6px',
                                                            color: '#6B7280',
                                                            fontWeight: 500
                                                        }}>
                                                            v{scene.version}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleLoadScene(scene)}
                                                        style={{
                                                            marginTop: 4,
                                                            background: '#1A202C',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '8px 12px',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: 6,
                                                            fontSize: 11,
                                                            fontWeight: 600,
                                                            transition: 'all 0.15s ease',
                                                            width: '100%'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.background = '#2D3748';
                                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.background = '#1A202C';
                                                            e.currentTarget.style.transform = 'translateY(0)';
                                                        }}
                                                    >
                                                        <Download size={12} />
                                                        Load Room
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === 'objects' && (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                                    gap: 12
                                }}>
                                    {objects.length === 0 ? (
                                        <div style={{
                                            gridColumn: '1 / -1',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '60px 20px',
                                            color: '#9CA3AF'
                                        }}>
                                            <Package size={40} color="#9CA3AF" />
                                            <p style={{
                                                marginTop: 16,
                                                fontSize: 14,
                                                fontWeight: 500,
                                                color: '#6B7280',
                                                marginBottom: 4
                                            }}>
                                                No objects yet
                                            </p>
                                            <small style={{
                                                fontSize: 12,
                                                color: '#9CA3AF'
                                            }}>
                                                Publish an object to create your first NFT
                                            </small>
                                        </div>
                                    ) : (
                                        objects.map((obj) => (
                                            <div
                                                key={obj.tokenId}
                                                style={{
                                                    background: 'rgba(0,0,0,0.02)',
                                                    borderRadius: '16px',
                                                    padding: '16px',
                                                    border: '1px solid rgba(0,0,0,0.06)',
                                                    transition: 'all 0.2s ease',
                                                    cursor: 'default'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
                                                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'rgba(0,0,0,0.02)';
                                                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)';
                                                }}
                                            >
                                                <div style={{
                                                    aspectRatio: '1',
                                                    background: 'rgba(255,255,255,0.8)',
                                                    borderRadius: '12px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginBottom: 12,
                                                    color: '#667eea'
                                                }}>
                                                    <Package size={24} />
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 6
                                                }}>
                                                    <div style={{
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        color: '#1A202C'
                                                    }}>
                                                        #{obj.tokenId}
                                                    </div>
                                                    <div style={{
                                                        display: 'flex',
                                                        gap: 4,
                                                        flexWrap: 'wrap'
                                                    }}>
                                                        <span style={{
                                                            fontSize: 10,
                                                            padding: '3px 6px',
                                                            background: 'rgba(0,0,0,0.06)',
                                                            borderRadius: '6px',
                                                            color: '#6B7280',
                                                            fontWeight: 500
                                                        }}>
                                                            {obj.objectType}
                                                        </span>
                                                        <span style={{
                                                            fontSize: 10,
                                                            padding: '3px 6px',
                                                            background: 'rgba(0,0,0,0.06)',
                                                            borderRadius: '6px',
                                                            color: '#6B7280',
                                                            fontWeight: 500
                                                        }}>
                                                            v{obj.version}
                                                        </span>
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
};

export default NFTLibrary;