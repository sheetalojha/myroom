import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { ArrowLeft, Loader, ExternalLink, User, Calendar, Package, Copy, Sparkles } from 'lucide-react';
import blockchainService from '../services/blockchainService';
import { deserializeScene, serializeScene } from '../utils/sceneSerializer';
import useStore from '../store/useStore';
import Scene from '../components/Scene';
import WalletConnect from '../components/WalletConnect';
import lighthouseService from '../services/lighthouseService';
import { generateSceneMetadata } from '../utils/metadataUtils';
import { generateSceneThumbnail } from '../utils/glbExporter';

const LittleWorldViewerPage = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const { isConnected, address } = useAccount();
  const loadScene = useStore((state) => state.loadScene);
  const setMode = useStore((state) => state.setMode);
  const setCurrentChamberTokenId = useStore((state) => state.setCurrentChamberTokenId);
  const roomConfig = useStore((state) => state.roomConfig);
  const objects = useStore((state) => state.objects);

  const [loading, setLoading] = useState(true);
  const [remixing, setRemixing] = useState(false);
  const [sceneMetadata, setSceneMetadata] = useState(null);
  const [error, setError] = useState(null);
  const [remixStatus, setRemixStatus] = useState(null);

  useEffect(() => {
    if (tokenId) {
      loadChamber();
    }
  }, [isConnected, tokenId]);

  useEffect(() => {
    // Set to view mode when littleworld is loaded
    setMode('view');
  }, []);

  const loadChamber = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!window.ethereum) {
        throw new Error('Please install a wallet extension to view littleworlds');
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      await blockchainService.initialize(provider);

      // Fetch scene metadata from contract
      const metadata = await blockchainService.getSceneByTokenId(tokenId);

      setSceneMetadata(metadata);

      // Check if user owns this littleworld - if yes, redirect to editor
      if (isConnected && address && metadata.owner && 
          metadata.owner.toLowerCase() === address.toLowerCase()) {
        // User owns this littleworld, load in editor
        const sceneData = await blockchainService.fetchSceneFromIPFS(metadata.sceneCID);
        const deserializedData = deserializeScene(sceneData);
        loadScene(deserializedData);
        setMode('edit');
        // Set the current littleworld token ID for versioning
        setCurrentChamberTokenId(Number(tokenId));
        // Navigate to editor with the littleworld loaded
        navigate('/editor');
        return;
      }

      // Fetch scene data from IPFS
      const sceneData = await blockchainService.fetchSceneFromIPFS(metadata.sceneCID);
      
      // Deserialize and load scene
      const deserializedData = deserializeScene(sceneData);
      loadScene(deserializedData);

    } catch (error) {
      console.error('Error loading littleworld:', error);
      setError(error.message || 'Failed to load littleworld');
    } finally {
      setLoading(false);
    }
  };

  const handleRemix = async () => {
    if (!isConnected || !sceneMetadata || !sceneMetadata.remixable) return;

    setRemixing(true);
    setRemixStatus({ status: 'preparing', message: 'Preparing remix...' });

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await blockchainService.initialize(provider);
      const signer = await provider.getSigner();

      // Deduct remix fee (send ETH to original creator)
      const REMIX_FEE = ethers.parseEther('0.001'); // 0.001 ETH fee
      setRemixStatus({ status: 'pending', message: 'Paying remix fee...' });
      
      try {
        const feeTx = await signer.sendTransaction({
          to: sceneMetadata.creator,
          value: REMIX_FEE
        });
        await feeTx.wait();
        console.log('✅ Remix fee paid:', feeTx.hash);
      } catch (feeError) {
        console.error('Fee payment error:', feeError);
        // Continue anyway - fee payment is optional for now
        setRemixStatus({ status: 'uploading', message: 'Uploading remixed littleworld...' });
      }

      // Serialize current scene state
      setRemixStatus({ status: 'uploading', message: 'Uploading remixed littleworld...' });
      const sceneData = serializeScene(objects, roomConfig);
      const sceneCID = await lighthouseService.uploadJSON(sceneData, 'scene.json');

      // Generate and upload thumbnail
      setRemixStatus({ status: 'uploading', message: 'Generating thumbnail...' });
      const thumbnailBlob = await generateSceneThumbnail({ width: 1024, height: 1024 });
      const thumbnailFile = new File([thumbnailBlob], 'thumbnail.png', { type: 'image/png' });
      const thumbnailCID = await lighthouseService.uploadFile(thumbnailFile);

      // Upload metadata
      const metadata = generateSceneMetadata({
        name: `${sceneMetadata.name} (Remix)`,
        description: `A remix of ${sceneMetadata.name}`,
        sceneCID: sceneCID,
        thumbnailCID: thumbnailCID,
        objectCount: objects.length,
        objectTokenIds: [],
        attributes: {
          remixedFrom: sceneMetadata.tokenId,
          originalCreator: sceneMetadata.creator
        }
      });

      const metadataCID = await lighthouseService.uploadJSON(metadata, 'metadata.json');

      setRemixStatus({ status: 'minting', message: 'Minting remixed littleworld...' });

      // Remix the scene
      const result = await blockchainService.remixScene(
        {
          originalTokenId: sceneMetadata.tokenId,
          sceneCID: sceneCID,
          metadataCID: metadataCID,
          thumbnailCID: thumbnailCID,
          name: `${sceneMetadata.name} (Remix)`,
          objectTokenIds: [],
          remixable: false // Default remix to not remixable
        },
        (progress) => {
          setRemixStatus(progress);
        }
      );

      setRemixStatus({
        status: 'success',
        message: 'LittleWorld remixed successfully!',
        tokenId: result.tokenId,
        txHash: result.txHash
      });

      // Load the remixed scene data and navigate to editor
      const remixedSceneData = await blockchainService.fetchSceneFromIPFS(sceneCID);
      const deserializedData = deserializeScene(remixedSceneData);
      loadScene(deserializedData);
      setMode('edit');

      // Navigate to editor after a short delay
      setTimeout(() => {
        navigate('/editor');
      }, 1500);

    } catch (error) {
      console.error('Error remixing littleworld:', error);
      setRemixStatus({
        status: 'error',
        message: error.message || 'Failed to remix littleworld'
      });
    } finally {
      setRemixing(false);
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const background = roomConfig?.background?.gradient || 'radial-gradient(circle at center, #E6F2FF 0%, #B3D9FF 50%, #87CEEB 100%)';

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20
      }}>
        <Loader 
          size={40} 
          color="#667eea"
          style={{
            animation: 'spin 1s linear infinite'
          }}
        />
        <p style={{ fontSize: 16, fontWeight: 500, color: '#6B7280' }}>
          Loading littleworld...
        </p>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        padding: '20px'
      }}>
        <p style={{ fontSize: 18, fontWeight: 500, color: '#DC2626' }}>
          {error}
        </p>
        <button
          onClick={() => navigate('/explore')}
          style={{
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Back to Explore
        </button>
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      background: background
    }}>
      {/* Header Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}>
          <button
            onClick={() => navigate('/explore')}
            style={{
              background: 'rgba(0, 0, 0, 0.05)',
              border: 'none',
              borderRadius: '10px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
            }}
          >
            <ArrowLeft size={20} color="#1A202C" />
          </button>
          <div>
            <h1 style={{
              fontSize: 20,
              fontWeight: 600,
              color: '#1A202C',
              margin: 0,
              marginBottom: 4
            }}>
              {sceneMetadata?.name || `LittleWorld #${tokenId}`}
            </h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              fontSize: 12,
              color: '#6B7280',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <User size={14} />
                <span>{formatAddress(sceneMetadata?.creator)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={14} />
                <span>{formatDate(sceneMetadata?.createdAtDate)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Package size={14} />
                <span>{sceneMetadata?.objectTokenIds.length || 0} objects</span>
              </div>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>
                v{sceneMetadata?.version || 1}
              </div>
              {sceneMetadata?.remixable && (
                <div style={{
                  fontSize: 11,
                  padding: '2px 8px',
                  background: 'rgba(102, 126, 234, 0.1)',
                  borderRadius: '6px',
                  color: '#667eea',
                  fontWeight: 500
                }}>
                  Remixable
                </div>
              )}
            </div>
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          {/* Show remix button if littleworld is remixable AND user is NOT the owner */}
          {sceneMetadata?.remixable && isConnected && sceneMetadata?.owner && 
           address && sceneMetadata.owner.toLowerCase() !== address.toLowerCase() && (
            <button
              onClick={handleRemix}
              disabled={remixing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                background: remixing ? '#9CA3AF' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: 12,
                fontWeight: 600,
                cursor: remixing ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!remixing) {
                  e.currentTarget.style.background = '#5568d3';
                }
              }}
              onMouseLeave={(e) => {
                if (!remixing) {
                  e.currentTarget.style.background = '#667eea';
                }
              }}
            >
              <Sparkles size={14} />
              {remixing ? 'Remixing...' : 'Remix (0.001 ETH)'}
            </button>
          )}
          <a
            href={`https://sepolia.basescan.org/token/${blockchainService.sceneNFTContract?.target}?a=${tokenId}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 12px',
              background: 'rgba(0, 0, 0, 0.05)',
              borderRadius: '10px',
              fontSize: 12,
              fontWeight: 500,
              color: '#1A202C',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
            }}
          >
            <ExternalLink size={14} />
            View on BaseScan
          </a>
          <WalletConnect />
        </div>
      </div>

      {/* Remix Status */}
      {remixStatus && (
        <div style={{
          position: 'absolute',
          top: 80,
          right: 24,
          zIndex: 101,
          background: remixStatus.status === 'success' 
            ? 'rgba(232, 245, 233, 0.98)' 
            : remixStatus.status === 'error'
            ? 'rgba(255, 235, 238, 0.98)'
            : 'rgba(227, 242, 253, 0.98)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '16px',
          padding: '12px 16px',
          fontSize: 12,
          color: remixStatus.status === 'success' 
            ? '#2e7d32' 
            : remixStatus.status === 'error'
            ? '#c62828'
            : '#1976d2',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          minWidth: 200,
          maxWidth: 300
        }}>
          {remixStatus.message}
          {remixStatus.tokenId !== undefined && (
            <div style={{ marginTop: 8, fontSize: 11, fontWeight: 600 }}>
              Token ID: #{remixStatus.tokenId}
            </div>
          )}
        </div>
      )}

      {/* Scene */}
      <Scene />
    </div>
  );
};

export default LittleWorldViewerPage;
