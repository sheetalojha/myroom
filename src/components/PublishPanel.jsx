import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { Upload, Loader, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import blockchainService from '../services/blockchainService';
import lighthouseService from '../services/lighthouseService';
import { generateObjectMetadata, generateSceneMetadata } from '../utils/metadataUtils';
import { serializeScene } from '../utils/sceneSerializer';
import { exportObjectToGLB, arrayBufferToBlob } from '../utils/glbExporter';
import { exportObjectDataToGLB } from '../utils/objectExporter';
import useStore from '../store/useStore';

const PublishPanel = () => {
    const { address, isConnected } = useAccount();
    const objects = useStore((state) => state.objects);
    const selectedId = useStore((state) => state.selectedId);

    const [isPublishing, setIsPublishing] = useState(false);
    const [publishStatus, setPublishStatus] = useState(null);
    const [publishType, setPublishType] = useState(null); // 'object' or 'scene'

    const selectedObject = objects.find(obj => obj.id === selectedId);

    const handlePublishObject = async () => {
        if (!selectedObject || !isConnected) return;

        setIsPublishing(true);
        setPublishType('object');
        setPublishStatus({ status: 'uploading', message: 'Preparing object for upload...' });

        try {
            // Initialize blockchain service
            const provider = new ethers.BrowserProvider(window.ethereum);
            await blockchainService.initialize(provider);

            // Export the actual 3D object to GLB format
            setPublishStatus({ status: 'uploading', message: 'Exporting 3D object to GLB...' });
            const glbBlob = await exportObjectDataToGLB(selectedObject);

            setPublishStatus({ status: 'uploading', message: 'Uploading to IPFS via Lighthouse...' });

            // Upload GLB to Lighthouse
            const glbCID = await lighthouseService.uploadFile(glbBlob, (progress) => {
                setPublishStatus({ status: 'uploading', message: `Uploading GLB: ${progress}%` });
            });

            // Upload metadata
            // Upload metadata
            const metadata = generateObjectMetadata({
                name: selectedObject.name || `Object ${selectedObject.id}`,
                description: 'Created with Life 3D Editor',
                objectType: selectedObject.type || 'custom',
                category: selectedObject.category || 'custom',
                glbCID: glbCID,
                imageCID: glbCID, // Using GLB as image for now
                attributes: {
                    // Add any custom attributes here
                }
            });

            const metadataCID = await lighthouseService.uploadJSON(metadata, 'metadata.json');

            setPublishStatus({ status: 'minting', message: 'Minting NFT...' });

            // Mint NFT
            const result = await blockchainService.mintObject(
                {
                    ipfsCID: glbCID,
                    metadataCID: metadataCID,
                    objectType: selectedObject.type || 'custom',
                    category: selectedObject.type || 'custom',
                },
                (progress) => {
                    setPublishStatus(progress);
                }
            );

            setPublishStatus({
                status: 'success',
                message: 'Object published successfully!',
                tokenId: result.tokenId,
                txHash: result.txHash,
            });

        } catch (error) {
            console.error('Publishing error:', error);
            setPublishStatus({
                status: 'error',
                message: error.message || 'Failed to publish object',
            });
        } finally {
            setTimeout(() => {
                setIsPublishing(false);
                setPublishType(null);
            }, 3000);
        }
    };

    const handlePublishScene = async () => {
        if (objects.length === 0 || !isConnected) return;

        setIsPublishing(true);
        setPublishType('scene');
        setPublishStatus({ status: 'uploading', message: 'Preparing scene for upload...' });

        try {
            // Initialize blockchain service
            const provider = new ethers.BrowserProvider(window.ethereum);
            await blockchainService.initialize(provider);

            // Serialize scene
            const sceneData = serializeScene(objects);

            setPublishStatus({ status: 'uploading', message: 'Uploading to IPFS via Lighthouse...' });

            // Upload Scene JSON
            console.log(sceneData);
            const sceneCID = await lighthouseService.uploadJSON(sceneData, 'scene.json');

            // Upload Thumbnail (mock for now)
            const mockThumbnail = new Blob(['mock thumbnail'], { type: 'image/png' });
            const thumbnailFile = new File([mockThumbnail], 'thumbnail.png', { type: 'image/png' });
            const thumbnailCID = await lighthouseService.uploadFile(thumbnailFile);

            // Upload Metadata
            // Upload Metadata
            const metadata = generateSceneMetadata({
                name: `Scene ${Date.now()}`,
                description: 'A scene created with Life 3D Editor',
                sceneCID: sceneCID,
                thumbnailCID: thumbnailCID,
                objectCount: objects.length,
                objectTokenIds: [], // In production, track object token IDs
                attributes: {
                    // Add any custom attributes here
                }
            });

            const metadataCID = await lighthouseService.uploadJSON(metadata, 'metadata.json');

            setPublishStatus({ status: 'minting', message: 'Minting Scene NFT...' });

            // Mint Scene NFT
            const result = await blockchainService.mintScene(
                {
                    sceneCID: sceneCID,
                    metadataCID: metadataCID,
                    thumbnailCID: thumbnailCID,
                    name: `Scene ${Date.now()}`,
                    objectTokenIds: [], // In production, track object token IDs
                },
                (progress) => {
                    setPublishStatus(progress);
                }
            );

            setPublishStatus({
                status: 'success',
                message: 'Scene published successfully!',
                tokenId: result.tokenId,
                txHash: result.txHash,
            });

        } catch (error) {
            console.error('Publishing error:', error);
            setPublishStatus({
                status: 'error',
                message: error.message || 'Failed to publish scene',
            });
        } finally {
            setTimeout(() => {
                setIsPublishing(false);
                setPublishType(null);
            }, 3000);
        }
    };

    const getStatusIcon = () => {
        if (!publishStatus) return null;

        switch (publishStatus.status) {
            case 'uploading':
            case 'pending':
            case 'mining':
                return <Loader className="spin" size={16} />;
            case 'success':
                return <CheckCircle size={16} />;
            case 'error':
                return <XCircle size={16} />;
            default:
                return null;
        }
    };

    if (!isConnected) {
        return (
            <div className="publish-panel">
                <div className="publish-disabled">
                    Connect wallet to publish
                </div>
                <style>{publishPanelStyles}</style>
            </div>
        );
    }

    return (
        <div className="publish-panel">
            <div className="publish-buttons">
                <button
                    onClick={handlePublishObject}
                    disabled={!selectedObject || isPublishing}
                    className="publish-btn publish-object"
                    title={!selectedObject ? 'Select an object first' : 'Publish selected object as NFT'}
                >
                    <Upload size={16} />
                    Publish Object
                </button>

                <button
                    onClick={handlePublishScene}
                    disabled={objects.length === 0 || isPublishing}
                    className="publish-btn publish-scene"
                    title={objects.length === 0 ? 'Add objects to scene first' : 'Publish entire scene as NFT'}
                >
                    <Upload size={16} />
                    Publish Scene
                </button>
            </div>

            {publishStatus && (
                <div className={`publish-status status-${publishStatus.status}`}>
                    <div className="status-header">
                        {getStatusIcon()}
                        <span>{publishStatus.message}</span>
                    </div>
                    {publishStatus.txHash && (
                        <a
                            href={`https://sepolia.basescan.org/tx/${publishStatus.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tx-link"
                        >
                            View on BaseScan <ExternalLink size={12} />
                        </a>
                    )}
                    {publishStatus.tokenId !== undefined && (
                        <div className="token-id">Token ID: #{publishStatus.tokenId}</div>
                    )}
                </div>
            )}

            <style>{publishPanelStyles}</style>
        </div>
    );
};

const publishPanelStyles = `
  .publish-panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .publish-buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .publish-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  
  .publish-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }
  
  .publish-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .publish-scene {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
  }
  
  .publish-scene:hover:not(:disabled) {
    box-shadow: 0 6px 16px rgba(245, 87, 108, 0.4);
  }
  
  .publish-disabled {
    padding: 12px;
    background: #f5f5f5;
    border-radius: 10px;
    text-align: center;
    font-size: 13px;
    color: #666;
  }
  
  .publish-status {
    padding: 12px;
    border-radius: 10px;
    font-size: 13px;
    animation: slideIn 0.3s ease;
  }
  
  .status-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
  }
  
  .status-uploading,
  .status-pending,
  .status-mining {
    background: #e3f2fd;
    color: #1976d2;
  }
  
  .status-success {
    background: #e8f5e9;
    color: #2e7d32;
  }
  
  .status-error {
    background: #ffebee;
    color: #c62828;
  }
  
  .tx-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 8px;
    font-size: 12px;
    color: inherit;
    text-decoration: underline;
  }
  
  .token-id {
    margin-top: 6px;
    font-size: 12px;
    font-weight: 600;
  }
  
  .spin {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
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
`;

export default PublishPanel;
