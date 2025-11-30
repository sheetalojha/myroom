import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { Upload, Loader, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import blockchainService from '../services/blockchainService';
import lighthouseService from '../services/lighthouseService';
import { generateObjectMetadata, generateSceneMetadata } from '../utils/metadataUtils';
import { serializeScene } from '../utils/sceneSerializer';
import { exportObjectToGLB, arrayBufferToBlob, generateSceneThumbnail } from '../utils/glbExporter';
import { exportObjectDataToGLB } from '../utils/objectExporter';
import useStore from '../store/useStore';

const PublishPanel = () => {
    const { address, isConnected } = useAccount();
    const objects = useStore((state) => state.objects);
    const selectedId = useStore((state) => state.selectedId);
    const roomConfig = useStore((state) => state.roomConfig);

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

            // Serialize scene with room configuration
            const sceneData = serializeScene(objects, roomConfig);

            setPublishStatus({ status: 'uploading', message: 'Uploading to IPFS via Lighthouse...' });

            // Upload Scene JSON
            console.log(sceneData);
            const sceneCID = await lighthouseService.uploadJSON(sceneData, 'scene.json');

            // Generate and upload thumbnail
            setPublishStatus({ status: 'uploading', message: 'Generating scene thumbnail...' });
            const thumbnailBlob = await generateSceneThumbnail({ width: 1024, height: 1024 });
            const thumbnailFile = new File([thumbnailBlob], 'thumbnail.png', { type: 'image/png' });
            const thumbnailCID = await lighthouseService.uploadFile(thumbnailFile, (progress) => {
                setPublishStatus({ status: 'uploading', message: `Uploading thumbnail: ${progress}%` });
            });

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

    const buttonBaseStyle = {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        padding: '8px 14px',
        borderRadius: '20px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11,
        fontWeight: 500,
        color: '#1A202C',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap'
    };

    if (!isConnected) {
        return (
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '20px',
                padding: '12px 14px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontSize: 11,
                color: '#6B7280',
                textAlign: 'center'
            }}>
                Connect wallet to publish
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            position: 'relative'
        }}>
            <div style={{
                display: 'flex',
                gap: 8
            }}>
                <button
                    onClick={handlePublishObject}
                    disabled={!selectedObject || isPublishing}
                    title={!selectedObject ? 'Select an object first' : 'Publish selected object as NFT'}
                    style={{
                        ...buttonBaseStyle,
                        opacity: (!selectedObject || isPublishing) ? 0.5 : 1,
                        cursor: (!selectedObject || isPublishing) ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => {
                        if (!(!selectedObject || isPublishing)) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <Upload size={12} />
                    Publish Object
                </button>

                <button
                    onClick={handlePublishScene}
                    disabled={objects.length === 0 || isPublishing}
                    title={objects.length === 0 ? 'Add objects to scene first' : 'Publish entire scene as NFT'}
                    style={{
                        ...buttonBaseStyle,
                        opacity: (objects.length === 0 || isPublishing) ? 0.5 : 1,
                        cursor: (objects.length === 0 || isPublishing) ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => {
                        if (!(objects.length === 0 || isPublishing)) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <Upload size={12} />
                    Publish Scene
                </button>
            </div>

            {publishStatus && (
                <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: 0,
                    marginBottom: 8,
                    background: publishStatus.status === 'success' 
                        ? 'rgba(232, 245, 233, 0.98)' 
                        : publishStatus.status === 'error'
                        ? 'rgba(255, 235, 238, 0.98)'
                        : 'rgba(227, 242, 253, 0.98)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '16px',
                    padding: '12px',
                    fontSize: 11,
                    color: publishStatus.status === 'success' 
                        ? '#2e7d32' 
                        : publishStatus.status === 'error'
                        ? '#c62828'
                        : '#1976d2',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    animation: 'slideIn 0.3s ease',
                    minWidth: 200,
                    zIndex: 1000
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontWeight: 500,
                        marginBottom: publishStatus.txHash || publishStatus.tokenId !== undefined ? 8 : 0
                    }}>
                        {getStatusIcon()}
                        <span>{publishStatus.message}</span>
                    </div>
                    {publishStatus.txHash && (
                        <a
                            href={`https://sepolia.basescan.org/tx/${publishStatus.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                marginTop: 8,
                                fontSize: 10,
                                color: 'inherit',
                                textDecoration: 'underline'
                            }}
                        >
                            View on BaseScan <ExternalLink size={10} />
                        </a>
                    )}
                    {publishStatus.tokenId !== undefined && (
                        <div style={{
                            marginTop: 6,
                            fontSize: 10,
                            fontWeight: 600
                        }}>
                            Token ID: #{publishStatus.tokenId}
                        </div>
                    )}
                </div>
            )}
            <style>{`
                .spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default PublishPanel;