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
    const currentChamberTokenId = useStore((state) => state.currentChamberTokenId);
    const setCurrentChamberTokenId = useStore((state) => state.setCurrentChamberTokenId);
    const clearCurrentChamberTokenId = useStore((state) => state.clearCurrentChamberTokenId);

    const [isPublishing, setIsPublishing] = useState(false);
    const [publishStatus, setPublishStatus] = useState(null);
    const [publishType, setPublishType] = useState(null); // 'object' or 'scene'
    const [chamberName, setChamberName] = useState('');
    const [remixable, setRemixable] = useState(true);
    const [showPublishDialog, setShowPublishDialog] = useState(false);

    const selectedObject = objects.find(obj => obj.id === selectedId);
    const isUpdatingVersion = currentChamberTokenId !== null;

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
        
        // If updating a version, skip the dialog and go straight to publishing
        if (isUpdatingVersion) {
            handleSaveVersion();
            return;
        }
        
        // Show dialog to get chamber name and remixable setting for new chambers
        if (!showPublishDialog) {
            setShowPublishDialog(true);
            return;
        }
        
        if (!chamberName.trim()) {
            setPublishStatus({ status: 'error', message: 'Please enter a chamber name' });
            return;
        }

        setIsPublishing(true);
        setPublishType('scene');
        setPublishStatus({ status: 'uploading', message: 'Preparing chamber for upload...' });

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
            const metadata = generateSceneMetadata({
                name: chamberName.trim(),
                description: 'A chamber created with Chambers',
                sceneCID: sceneCID,
                thumbnailCID: thumbnailCID,
                objectCount: objects.length,
                objectTokenIds: [], // In production, track object token IDs
                attributes: {
                    remixable: remixable
                }
            });

            const metadataCID = await lighthouseService.uploadJSON(metadata, 'metadata.json');

            setPublishStatus({ status: 'minting', message: 'Minting Chamber NFT...' });

            // Mint Scene NFT
            const result = await blockchainService.mintScene(
                {
                    sceneCID: sceneCID,
                    metadataCID: metadataCID,
                    thumbnailCID: thumbnailCID,
                    name: chamberName.trim(),
                    objectTokenIds: [], // In production, track object token IDs
                    remixable: remixable
                },
                (progress) => {
                    setPublishStatus(progress);
                }
            );

            setPublishStatus({
                status: 'success',
                message: 'Chamber published successfully!',
                tokenId: result.tokenId,
                txHash: result.txHash,
            });
            
            // Reset form
            setChamberName('');
            setRemixable(true);
            setShowPublishDialog(false);

        } catch (error) {
            console.error('Publishing error:', error);
            setPublishStatus({
                status: 'error',
                message: error.message || 'Failed to publish chamber',
            });
        } finally {
            setTimeout(() => {
                setIsPublishing(false);
                setPublishType(null);
            }, 3000);
        }
    };

    const handleSaveVersion = async () => {
        console.log('🔵 handleSaveVersion called', { currentChamberTokenId, objectsLength: objects.length, isConnected });
        
        if (currentChamberTokenId === null || currentChamberTokenId === undefined) {
            console.error('❌ No currentChamberTokenId');
            setPublishStatus({ status: 'error', message: 'No chamber loaded. Please load a chamber first.' });
            return;
        }
        
        if (objects.length === 0) {
            console.error('❌ No objects to save');
            setPublishStatus({ status: 'error', message: 'Add objects to your chamber before saving.' });
            return;
        }
        
        if (!isConnected) {
            console.error('❌ Not connected');
            setPublishStatus({ status: 'error', message: 'Please connect your wallet.' });
            return;
        }

        setIsPublishing(true);
        setPublishType('scene');
        setPublishStatus({ status: 'uploading', message: 'Saving new version...' });

        try {
            // Initialize blockchain service
            const provider = new ethers.BrowserProvider(window.ethereum);
            await blockchainService.initialize(provider);

            // Get parent metadata to preserve remixable setting
            const parentMetadata = await blockchainService.getSceneByTokenId(currentChamberTokenId);

            // Serialize scene with room configuration
            const sceneData = serializeScene(objects, roomConfig);

            setPublishStatus({ status: 'uploading', message: 'Uploading to IPFS via Lighthouse...' });

            // Upload Scene JSON
            const sceneCID = await lighthouseService.uploadJSON(sceneData, 'scene.json');

            // Generate and upload thumbnail
            setPublishStatus({ status: 'uploading', message: 'Generating scene thumbnail...' });
            const thumbnailBlob = await generateSceneThumbnail({ width: 1024, height: 1024 });
            const thumbnailFile = new File([thumbnailBlob], 'thumbnail.png', { type: 'image/png' });
            const thumbnailCID = await lighthouseService.uploadFile(thumbnailFile, (progress) => {
                setPublishStatus({ status: 'uploading', message: `Uploading thumbnail: ${progress}%` });
            });

            // Upload Metadata (preserve original name)
            const metadata = generateSceneMetadata({
                name: parentMetadata.name,
                description: `Version ${parentMetadata.version + 1} of ${parentMetadata.name}`,
                sceneCID: sceneCID,
                thumbnailCID: thumbnailCID,
                objectCount: objects.length,
                objectTokenIds: [], // In production, track object token IDs
                attributes: {
                    remixable: parentMetadata.remixable,
                    parentTokenId: currentChamberTokenId,
                    version: parentMetadata.version + 1
                }
            });

            const metadataCID = await lighthouseService.uploadJSON(metadata, 'metadata.json');

            setPublishStatus({ status: 'minting', message: 'Creating new version...' });

            // Create version
            const result = await blockchainService.createSceneVersion(
                {
                    parentTokenId: currentChamberTokenId,
                    sceneCID: sceneCID,
                    metadataCID: metadataCID,
                    thumbnailCID: thumbnailCID,
                    objectTokenIds: [], // In production, track object token IDs
                    remixable: parentMetadata.remixable
                },
                (progress) => {
                    setPublishStatus(progress);
                }
            );

            setPublishStatus({
                status: 'success',
                message: `Version ${parentMetadata.version + 1} saved successfully!`,
                tokenId: result.tokenId,
                txHash: result.txHash,
            });

            // Update current chamber token ID to the new version
            setCurrentChamberTokenId(result.tokenId);

        } catch (error) {
            console.error('Version save error:', error);
            setPublishStatus({
                status: 'error',
                message: error.message || 'Failed to save version',
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
                    onClick={() => {
                        console.log('🔵 Button clicked', { isUpdatingVersion, currentChamberTokenId, objectsLength: objects.length, isConnected });
                        if (isUpdatingVersion) {
                            handleSaveVersion();
                        } else {
                            handlePublishScene();
                        }
                    }}
                    disabled={objects.length === 0 || isPublishing}
                    title={objects.length === 0 ? 'Add objects to chamber first' : isUpdatingVersion ? 'Save as new version' : 'Publish entire chamber as NFT'}
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
                    {isUpdatingVersion ? 'Save Version' : 'Publish Chamber'}
                </button>
            </div>

            {/* Publish Chamber Dialog */}
            {showPublishDialog && (
                <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: 0,
                    marginBottom: 8,
                    background: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '16px',
                    padding: '16px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    minWidth: 280,
                    maxWidth: 320,
                    width: 'max-content',
                    zIndex: 1001
                }}>
                    <div style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#1A202C',
                        marginBottom: 12
                    }}>
                        {isUpdatingVersion ? 'Save New Version' : 'Publish Chamber'}
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                        width: '100%'
                    }}>
                        <div style={{ width: '100%' }}>
                            <label style={{
                                display: 'block',
                                fontSize: 11,
                                fontWeight: 500,
                                color: '#6B7280',
                                marginBottom: 6
                            }}>
                                Chamber Name
                            </label>
                            <input
                                type="text"
                                value={chamberName}
                                onChange={(e) => setChamberName(e.target.value)}
                                placeholder="My Awesome Chamber"
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    fontSize: 12,
                                    background: 'white',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && chamberName.trim()) {
                                        handlePublishScene();
                                    }
                                }}
                            />
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        }}>
                            <input
                                type="checkbox"
                                id="remixable"
                                checked={remixable}
                                onChange={(e) => setRemixable(e.target.checked)}
                                style={{
                                    width: 16,
                                    height: 16,
                                    cursor: 'pointer'
                                }}
                            />
                            <label htmlFor="remixable" style={{
                                fontSize: 11,
                                color: '#6B7280',
                                cursor: 'pointer',
                                userSelect: 'none'
                            }}>
                                Allow others to remix this chamber
                            </label>
                        </div>
                        <div style={{
                            display: 'flex',
                            gap: 8
                        }}>
                            <button
                                onClick={() => {
                                    setShowPublishDialog(false);
                                    setChamberName('');
                                }}
                                style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    background: 'rgba(0,0,0,0.05)',
                                    fontSize: 11,
                                    fontWeight: 500,
                                    color: '#6B7280',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePublishScene}
                                disabled={!chamberName.trim() || isPublishing}
                                style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: chamberName.trim() ? '#667eea' : '#9CA3AF',
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: 'white',
                                    cursor: chamberName.trim() ? 'pointer' : 'not-allowed'
                                }}
                            >
                                Publish
                            </button>
                        </div>
                    </div>
                </div>
            )}

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