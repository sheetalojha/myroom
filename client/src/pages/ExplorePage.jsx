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
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredScenes, setFilteredScenes] = useState([]);

  useEffect(() => {
    // Always try to fetch scenes, even if not connected (read-only operations)
    fetchAllScenes();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredScenes(scenes);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredScenes(
        scenes.filter(scene =>
          scene.name?.toLowerCase().includes(query) ||
          scene.creator?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, scenes]);

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
        ) : filteredScenes.length === 0 ? (
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
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 20
          }}>
            {filteredScenes.map((scene) => (
              <div
                key={scene.tokenId}
                onClick={() => navigate(`/chamber/${scene.tokenId}`)}
                style={{
                  background: 'white',
                  borderRadius: '20px',
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
                      width: 56,
                      height: 56,
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E0 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Home size={24} color="#A0AEC0" />
                    </div>
                  )}
                  {scene.remixable && (
                    <div style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: '8px',
                      padding: '4px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 10,
                      fontWeight: 500,
                      color: '#667EEA',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <Sparkles size={10} />
                      <span>Remix</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{
                  padding: '16px'
                }}>
                  <h3 style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#2D3748',
                    margin: '0 0 12px 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    letterSpacing: '-0.01em'
                  }}>
                    {scene.name || `Chamber #${scene.tokenId}`}
                  </h3>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 11,
                      color: '#718096'
                    }}>
                      <User size={12} />
                      <span>{formatAddress(scene.creator)}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 11,
                      color: '#718096'
                    }}>
                      <Calendar size={12} />
                      <span>{formatDate(scene.createdAtDate)}</span>
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: '#A0AEC0',
                      marginTop: 2
                    }}>
                      {scene.objectTokenIds.length} {scene.objectTokenIds.length === 1 ? 'item' : 'items'}
                    </div>
                  </div>
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
