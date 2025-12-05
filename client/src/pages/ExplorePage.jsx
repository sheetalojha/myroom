import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { Home, Search, Loader, Sparkles } from 'lucide-react';
import blockchainService from '../services/blockchainService';
import WalletConnect from '../components/WalletConnect';
import { IPFS_GATEWAY } from '../config/web3Config';
import { Button, Card, Input, LoadingSpinner } from '../components/ui';
import theme from '../styles/theme';

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
      background: theme.colors.background.primary,
      overflowY: 'auto',
      overflowX: 'hidden'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: `${theme.spacing[6]} ${theme.spacing[5]} ${theme.spacing[10]}`
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: theme.spacing[8],
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[3] }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/')}
              icon={Home}
            />
            <h1 style={{
              fontSize: theme.typography.fontSize['2xl'],
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary,
              margin: 0
            }}>
              Explore
            </h1>
          </div>
          <WalletConnect />
        </div>

        {/* Search */}
        <div style={{ marginBottom: theme.spacing[8] }}>
          <Input
            type="text"
            placeholder="Search littleworlds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
            fullWidth
            size="md"
            style={{ maxWidth: 480 }}
          />
        </div>

        {/* Content */}
        {loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: `${theme.spacing[24]} ${theme.spacing[5]}`
          }}>
            <LoadingSpinner size="lg" color="primary" />
            <p style={{ 
              fontSize: theme.typography.fontSize.sm, 
              color: theme.colors.text.secondary,
              marginTop: theme.spacing[3]
            }}>
              Loading...
            </p>
          </div>
        ) : filteredGroupedScenes.length === 0 ? (
          <Card padding="xl" style={{ textAlign: 'center', maxWidth: 400, margin: '0 auto' }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: theme.borderRadius.full,
              background: theme.colors.neutral[100],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: `0 auto ${theme.spacing[5]}`,
              border: `1px dashed ${theme.colors.neutral[300]}`
            }}>
              <Home size={24} color={theme.colors.text.secondary} />
            </div>
            <p style={{ 
              fontSize: theme.typography.fontSize.md, 
              fontWeight: theme.typography.fontWeight.medium, 
              marginBottom: theme.spacing[2], 
              color: theme.colors.text.primary 
            }}>
              {searchQuery ? 'No littleworlds found' : 'No littleworlds yet'}
            </p>
            <p style={{ 
              fontSize: theme.typography.fontSize.base, 
              color: theme.colors.text.secondary 
            }}>
              {searchQuery ? 'Try a different search term' : 'Be the first to create and publish a littleworld!'}
            </p>
          </Card>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: theme.spacing[3]
          }}>
            {filteredGroupedScenes.flatMap((group) =>
              group.versions.map((scene) => (
                    <Card
                      key={scene.tokenId}
                      padding="none"
                      hover
                      onClick={() => navigate(`/littleworld/${scene.tokenId}`)}
                      style={{
                        cursor: 'pointer',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Thumbnail */}
                      <div style={{
                        width: '100%',
                        aspectRatio: '1',
                        background: theme.colors.neutral[100],
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
                            <Home size={24} color={theme.colors.text.secondary} />
                          </div>
                        )}
                        {scene.remixable && (
                          <div style={{
                            position: 'absolute',
                            top: theme.spacing[2],
                            right: theme.spacing[2],
                            background: theme.colors.background.overlay,
                            borderRadius: theme.borderRadius.sm,
                            padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                            fontSize: theme.typography.fontSize.xs,
                            fontWeight: theme.typography.fontWeight.medium,
                            color: theme.colors.primary[300],
                            display: 'flex',
                            alignItems: 'center',
                            gap: theme.spacing[1]
                          }}>
                            <Sparkles size={7} />
                            <span>Remix</span>
                          </div>
                        )}
                        <div style={{
                          position: 'absolute',
                          top: theme.spacing[2],
                          left: theme.spacing[2],
                          background: theme.colors.background.overlayDark,
                          borderRadius: theme.borderRadius.sm,
                          padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                          fontSize: theme.typography.fontSize.xs,
                          fontWeight: theme.typography.fontWeight.semibold,
                          color: theme.colors.text.inverse
                        }}>
                          v{scene.version}
                        </div>
                      </div>

                      {/* Info */}
                      <div style={{ padding: theme.spacing[3] }}>
                        <div style={{
                          fontSize: theme.typography.fontSize.sm,
                          fontWeight: theme.typography.fontWeight.semibold,
                          color: theme.colors.text.primary,
                          marginBottom: theme.spacing[2],
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {scene.name || `LittleWorld #${scene.tokenId}`}
                        </div>
                        <div style={{
                          fontSize: theme.typography.fontSize.xs,
                          color: theme.colors.text.secondary,
                          marginBottom: theme.spacing[1]
                        }}>
                          Version {scene.version}
                        </div>
                        <div style={{ 
                          fontSize: theme.typography.fontSize.xs, 
                          color: theme.colors.text.secondary 
                        }}>
                          {formatAddress(scene.creator)} • {scene.objectTokenIds.length} {scene.objectTokenIds.length === 1 ? 'item' : 'items'}
                        </div>
                      </div>
                    </Card>
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
