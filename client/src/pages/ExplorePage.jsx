import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { Home, Search, Loader, User, Calendar, Sparkles } from 'lucide-react';
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
    // Always try to fetch scenes, even if not connected (read-only operations)
    fetchAllScenes();
  }, []);

  // Group scenes by version - find root parent and group all versions together
  const groupScenesByVersion = (scenesList) => {
    const groups = new Map();
    
    // First pass: identify root scenes (parentTokenId === 0 or null)
    scenesList.forEach(scene => {
      const parentId = scene.parentTokenId || 0;
      if (parentId === 0) {
        // This is a root scene
        if (!groups.has(scene.tokenId)) {
          groups.set(scene.tokenId, {
            root: scene,
            versions: [scene]
          });
        }
      }
    });
    
    // Second pass: add versions to their parent groups
    scenesList.forEach(scene => {
      const parentId = scene.parentTokenId || 0;
      if (parentId !== 0) {
        // Find the root by traversing up the parent chain
        let currentParentId = parentId;
        let rootId = null;
        
        // Traverse up to find root
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
          // Root not found in our list, create new group
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
    
    // Sort versions within each group by version number
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
      
      // Group filtered scenes
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

      // Fetch all scenes using blockchainService helper
      const fetchedScenes = await blockchainService.getAllScenes();
      
      console.log('Fetched scenes:', fetchedScenes.length);
      
      // Add thumbnail URLs
      const scenesWithThumbnails = fetchedScenes.map(scene => ({
        ...scene,
        thumbnailUrl: scene.thumbnailCID ? `${IPFS_GATEWAY}${scene.thumbnailCID}` : null
      }));

      setScenes(scenesWithThumbnails);
      setFilteredScenes(scenesWithThumbnails);
      
      // Group scenes by version
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

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FAFBFC',
      padding: '32px 20px'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: 1200,
        margin: '0 auto 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 20
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
            }}
          >
            <Home size={18} color="#8B8FA3" />
          </button>
          <h1 style={{
            fontSize: 24,
            fontWeight: 600,
            color: '#2D3748',
            margin: 0,
            letterSpacing: '-0.02em'
          }}>
            Explore
          </h1>
        </div>
        <WalletConnect />
      </div>

      {/* Search Bar */}
      <div style={{
        maxWidth: 1200,
        margin: '0 auto 40px'
      }}>
        <div style={{
          position: 'relative',
          maxWidth: 500
        }}>
          <Search 
            size={18} 
            color="#A0AEC0" 
            style={{
              position: 'absolute',
              left: 16,
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
              padding: '12px 16px 12px 44px',
              borderRadius: '14px',
              border: '1.5px solid #E2E8F0',
              fontSize: 14,
              background: 'white',
              outline: 'none',
              transition: 'all 0.2s ease',
              color: '#2D3748'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#CBD5E0';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139, 143, 163, 0.08)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: 1200,
        margin: '0 auto'
      }}>
        {loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '120px 20px',
            color: '#A0AEC0'
          }}>
            <Loader 
              size={32} 
              color="#8B8FA3"
              style={{
                animation: 'spin 1s linear infinite',
                marginBottom: 16
              }}
            />
            <p style={{ fontSize: 14, fontWeight: 500, color: '#718096' }}>
              Loading...
            </p>
          </div>
        ) : filteredGroupedScenes.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '120px 20px',
            color: '#A0AEC0'
          }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              border: '2px dashed #CBD5E0'
            }}>
              <Home size={32} color="#CBD5E0" />
            </div>
            <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 8, color: '#4A5568' }}>
              {searchQuery ? 'No chambers found' : 'No chambers yet'}
            </p>
            <p style={{ fontSize: 13, color: '#A0AEC0', maxWidth: 300, margin: '0 auto' }}>
              {searchQuery 
                ? 'Try a different search term' 
                : 'Be the first to create and publish a chamber!'}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24
          }}>
            {filteredGroupedScenes.map((group) => (
              <div
                key={group.root.tokenId}
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '20px',
                  border: '1px solid #F1F5F9',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                {/* Group Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                  paddingBottom: 16,
                  borderBottom: '1px solid #F1F5F9'
                }}>
                  <div>
                    <h2 style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: '#2D3748',
                      margin: '0 0 4px 0',
                      letterSpacing: '-0.01em'
                    }}>
                      {group.root.name || `Chamber #${group.root.tokenId}`}
                    </h2>
                    <div style={{
                      fontSize: 12,
                      color: '#718096',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}>
                      <span>{formatAddress(group.root.creator)}</span>
                      <span>•</span>
                      <span>{group.versions.length} {group.versions.length === 1 ? 'version' : 'versions'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Versions Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: 16
                }}>
                  {group.versions.map((scene) => (
                    <div
                      key={scene.tokenId}
                      onClick={() => navigate(`/chamber/${scene.tokenId}`)}
                      style={{
                        background: 'white',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        border: '1px solid #F1F5F9'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
                        e.currentTarget.style.borderColor = '#E2E8F0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                        e.currentTarget.style.borderColor = '#F1F5F9';
                      }}
                    >
                      {/* Thumbnail */}
                      <div style={{
                        width: '100%',
                        aspectRatio: '1',
                        background: 'linear-gradient(135deg, #F0F4F8 0%, #E2E8F0 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
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
                            width: 48,
                            height: 48,
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E0 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Home size={20} color="#A0AEC0" />
                          </div>
                        )}
                        {scene.remixable && (
                          <div style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '6px',
                            padding: '3px 6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                            fontSize: 9,
                            fontWeight: 500,
                            color: '#667EEA',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                          }}>
                            <Sparkles size={8} />
                            <span>Remix</span>
                          </div>
                        )}
                        <div style={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          background: 'rgba(0, 0, 0, 0.7)',
                          backdropFilter: 'blur(8px)',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: 10,
                          fontWeight: 600,
                          color: 'white'
                        }}>
                          v{scene.version}
                        </div>
                      </div>

                      {/* Info */}
                      <div style={{
                        padding: '12px'
                      }}>
                        <div style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#2D3748',
                          marginBottom: 8
                        }}>
                          Version {scene.version}
                        </div>
                        <div style={{
                          fontSize: 11,
                          color: '#718096'
                        }}>
                          {scene.objectTokenIds.length} {scene.objectTokenIds.length === 1 ? 'item' : 'items'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
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

export default ExplorePage;
