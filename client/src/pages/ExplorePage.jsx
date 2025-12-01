import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { Home, Search, Loader, Sparkles } from 'lucide-react';
import blockchainService from '../services/blockchainService';
import WalletConnect from '../components/WalletConnect';
import { IPFS_GATEWAY } from '../config/web3Config';

const ExplorePage = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [scenes, setScenes] = useState([]);
  const [groupedScenes, setGroupedScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredScenes, setFilteredScenes] = useState([]);
  const [filteredGroupedScenes, setFilteredGroupedScenes] = useState([]);

  useEffect(() => {
    fetchAllScenes();
  }, []);

  const groupScenesByVersion = (scenesList) => {
    const groups = new Map();
    
    scenesList.forEach(scene => {
      const parentId = scene.parentTokenId || 0;
      if (parentId === 0) {
        if (!groups.has(scene.tokenId)) {
          groups.set(scene.tokenId, {
            root: scene,
            versions: [scene]
          });
        }
      }
    });
    
    scenesList.forEach(scene => {
      const parentId = scene.parentTokenId || 0;
      if (parentId !== 0) {
        let currentParentId = parentId;
        let rootId = null;
        
        while (currentParentId !== 0) {
          const parentScene = scenesList.find(s => s.tokenId === currentParentId);
          if (!parentScene) break;
          if (parentScene.parentTokenId === 0 || !parentScene.parentTokenId) {
            rootId = parentScene.tokenId;
            break;
          }
          currentParentId = parentScene.parentTokenId;
        }
        
        if (rootId && groups.has(rootId)) {
          groups.get(rootId).versions.push(scene);
        } else if (rootId) {
          const rootScene = scenesList.find(s => s.tokenId === rootId);
          if (rootScene) {
            groups.set(rootId, {
              root: rootScene,
              versions: [rootScene, scene]
            });
          }
        }
      }
    });
    
    groups.forEach(group => {
      group.versions.sort((a, b) => (a.version || 1) - (b.version || 1));
    });
    
    return Array.from(groups.values());
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredScenes(scenes);
      setFilteredGroupedScenes(groupedScenes);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = scenes.filter(scene =>
        scene.name?.toLowerCase().includes(query) ||
        scene.creator?.toLowerCase().includes(query)
      );
      setFilteredScenes(filtered);
      const grouped = groupScenesByVersion(filtered);
      setFilteredGroupedScenes(grouped);
    }
  }, [searchQuery, scenes, groupedScenes]);

  const fetchAllScenes = async () => {
    setLoading(true);
    try {
      if (!window.ethereum) {
        throw new Error('Please install a wallet extension');
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      await blockchainService.initialize(provider);

      const fetchedScenes = await blockchainService.getAllScenes();
      
      const scenesWithThumbnails = fetchedScenes.map(scene => ({
        ...scene,
        thumbnailUrl: scene.thumbnailCID ? `${IPFS_GATEWAY}${scene.thumbnailCID}` : null
      }));

      setScenes(scenesWithThumbnails);
      setFilteredScenes(scenesWithThumbnails);
      
      const grouped = groupScenesByVersion(scenesWithThumbnails);
      setGroupedScenes(grouped);
      setFilteredGroupedScenes(grouped);
    } catch (error) {
      console.error('Error fetching scenes:', error);
      setScenes([]);
      setFilteredScenes([]);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#FAFAFA',
      overflowY: 'auto',
      overflowX: 'hidden'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '24px 20px 40px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 32,
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'white',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Home size={16} color="#6B7280" />
            </button>
            <h1 style={{
              fontSize: 20,
              fontWeight: 600,
              color: '#1A202C',
              margin: 0
            }}>
              Explore
            </h1>
          </div>
          <WalletConnect />
        </div>

        {/* Search */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ position: 'relative', maxWidth: 480 }}>
            <Search 
              size={16} 
              color="#9CA3AF" 
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}
            />
            <input
              type="text"
              placeholder="Search chambers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.08)',
                fontSize: 13,
                background: 'white',
                outline: 'none',
                color: '#1A202C'
              }}
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 20px'
          }}>
            <Loader size={28} color="#9CA3AF" style={{ animation: 'spin 1s linear infinite', marginBottom: 12 }} />
            <p style={{ fontSize: 13, color: '#6B7280' }}>Loading...</p>
          </div>
        ) : filteredGroupedScenes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#F3F4F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              border: '1px dashed #D1D5DB'
            }}>
              <Home size={24} color="#9CA3AF" />
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#374151' }}>
              {searchQuery ? 'No chambers found' : 'No chambers yet'}
            </p>
            <p style={{ fontSize: 12, color: '#9CA3AF' }}>
              {searchQuery ? 'Try a different search term' : 'Be the first to create and publish a chamber!'}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 12
          }}>
            {filteredGroupedScenes.flatMap((group) =>
              group.versions.map((scene) => (
                    <div
                      key={scene.tokenId}
                      onClick={() => navigate(`/chamber/${scene.tokenId}`)}
                      style={{
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid rgba(0,0,0,0.06)',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Thumbnail */}
                      <div style={{
                        width: '100%',
                        aspectRatio: '1',
                        background: '#F3F4F6',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {scene.thumbnailUrl ? (
                          <img
                            src={scene.thumbnailUrl}
                            alt={scene.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Home size={24} color="#9CA3AF" />
                          </div>
                        )}
                        {scene.remixable && (
                          <div style={{
                            position: 'absolute',
                            top: 6,
                            right: 6,
                            background: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            fontSize: 8,
                            fontWeight: 500,
                            color: '#667EEA',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3
                          }}>
                            <Sparkles size={7} />
                            <span>Remix</span>
                          </div>
                        )}
                        <div style={{
                          position: 'absolute',
                          top: 6,
                          left: 6,
                          background: 'rgba(0, 0, 0, 0.7)',
                          borderRadius: '4px',
                          padding: '3px 6px',
                          fontSize: 9,
                          fontWeight: 600,
                          color: 'white'
                        }}>
                          v{scene.version}
                        </div>
                      </div>

                      {/* Info */}
                      <div style={{ padding: '10px' }}>
                        <div style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#1A202C',
                          marginBottom: 6,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {scene.name || `Chamber #${scene.tokenId}`}
                        </div>
                        <div style={{
                          fontSize: 11,
                          color: '#6B7280',
                          marginBottom: 4
                        }}>
                          Version {scene.version}
                        </div>
                        <div style={{ fontSize: 10, color: '#9CA3AF' }}>
                          {formatAddress(scene.creator)} • {scene.objectTokenIds.length} {scene.objectTokenIds.length === 1 ? 'item' : 'items'}
                        </div>
                      </div>
                    </div>
                  ))
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .versions-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ExplorePage;
