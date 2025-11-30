import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { Package, Image as ImageIcon, Loader, Download } from 'lucide-react';
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
        <div className="nft-library-overlay" onClick={onClose}>
            <div className="nft-library-panel" onClick={(e) => e.stopPropagation()}>
                <div className="library-header">
                    <h2>My NFT Collection</h2>
                    <button onClick={onClose} className="close-btn">×</button>
                </div>

                <div className="library-tabs">
                    <button
                        className={`tab ${activeTab === 'objects' ? 'active' : ''}`}
                        onClick={() => setActiveTab('objects')}
                    >
                        <Package size={16} />
                        Objects ({objects.length})
                    </button>
                    <button
                        className={`tab ${activeTab === 'scenes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('scenes')}
                    >
                        <ImageIcon size={16} />
                        Scenes ({scenes.length})
                    </button>
                </div>

                <div className="library-content">
                    {loading ? (
                        <div className="loading-state">
                            <Loader className="spin" size={32} />
                            <p>Loading your NFTs...</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'objects' && (
                                <div className="nft-grid">
                                    {objects.length === 0 ? (
                                        <div className="empty-state">
                                            <Package size={48} />
                                            <p>No object NFTs yet</p>
                                            <small>Publish an object to create your first NFT</small>
                                        </div>
                                    ) : (
                                        objects.map((obj) => (
                                            <div key={obj.tokenId} className="nft-card">
                                                <div className="nft-preview">
                                                    <Package size={32} />
                                                </div>
                                                <div className="nft-info">
                                                    <div className="nft-title">Object #{obj.tokenId}</div>
                                                    <div className="nft-meta">
                                                        <span className="nft-type">{obj.objectType}</span>
                                                        <span className="nft-category">{obj.category}</span>
                                                    </div>
                                                    <div className="nft-version">v{obj.version}</div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === 'scenes' && (
                                <div className="nft-grid">
                                    {scenes.length === 0 ? (
                                        <div className="empty-state">
                                            <ImageIcon size={48} />
                                            <p>No scene NFTs yet</p>
                                            <small>Publish a scene to create your first scene NFT</small>
                                        </div>
                                    ) : (
                                        scenes.map((scene) => (
                                            <div key={scene.tokenId} className="nft-card scene-card">
                                                <div className="nft-preview scene-preview">
                                                    <ImageIcon size={32} />
                                                </div>
                                                <div className="nft-info">
                                                    <div className="nft-title">{scene.name}</div>
                                                    <div className="nft-meta">
                                                        <span className="nft-objects">{scene.objectTokenIds.length} objects</span>
                                                        <span className="nft-version">v{scene.version}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleLoadScene(scene)}
                                                        className="load-scene-btn"
                                                    >
                                                        <Download size={14} />
                                                        Load Scene
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                <style>{nftLibraryStyles}</style>
            </div>
        </div>
    );
};

const nftLibraryStyles = `
  .nft-library-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    pointer-events: auto;
  }

  .nft-library-panel {
    background: white;
    border-radius: 20px;
    width: 90%;
    max-width: 800px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }

  .library-header {
    padding: 24px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .library-header h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 32px;
    cursor: pointer;
    color: #999;
    line-height: 1;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.2s;
  }

  .close-btn:hover {
    background: #f5f5f5;
    color: #333;
  }

  .library-tabs {
    display: flex;
    gap: 8px;
    padding: 16px 24px;
    border-bottom: 1px solid #eee;
  }

  .tab {
    background: none;
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #666;
    transition: all 0.2s;
  }

  .tab:hover {
    background: #f5f5f5;
    color: #333;
  }

  .tab.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .library-content {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
  }

  .nft-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }

  .nft-card {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 16px;
    border: 2px solid transparent;
    transition: all 0.3s;
    cursor: default;
  }

  .nft-card:hover {
    border-color: #667eea;
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
  }

  .nft-preview {
    aspect-ratio: 1;
    background: white;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    color: #667eea;
  }

  .scene-preview {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
  }

  .nft-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .nft-title {
    font-weight: 600;
    font-size: 14px;
    color: #333;
  }

  .nft-meta {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .nft-type,
  .nft-category,
  .nft-objects,
  .nft-version {
    font-size: 11px;
    padding: 4px 8px;
    background: white;
    border-radius: 6px;
    color: #666;
  }

  .load-scene-btn {
    margin-top: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    transition: all 0.2s;
  }

  .load-scene-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .loading-state,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #999;
    text-align: center;
  }

  .loading-state p,
  .empty-state p {
    margin: 16px 0 4px;
    font-size: 16px;
    font-weight: 500;
    color: #666;
  }

  .empty-state small {
    font-size: 13px;
    color: #999;
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export default NFTLibrary;
