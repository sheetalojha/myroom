import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, OBJECT_NFT_ABI, SCENE_NFT_ABI, IPFS_GATEWAY } from '../config/web3Config';

/**
 * Blockchain Service for interacting with NFT contracts
 */
class BlockchainService {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.objectNFTContract = null;
        this.sceneNFTContract = null;
    }

    /**
     * Initialize the service with a provider and signer
     * @param {ethers.BrowserProvider} provider - Ethers provider
     */
    async initialize(provider) {
        console.log('🔵 Initializing BlockchainService...');
        this.provider = provider;
        this.signer = await provider.getSigner();

        const signerAddress = await this.signer.getAddress();
        console.log('Signer address:', signerAddress);

        // Initialize contracts
        console.log('Contract Addresses:', CONTRACT_ADDRESSES);

        if (CONTRACT_ADDRESSES.ObjectNFT) {
            this.objectNFTContract = new ethers.Contract(
                CONTRACT_ADDRESSES.ObjectNFT,
                OBJECT_NFT_ABI,
                this.signer
            );
            console.log('✅ ObjectNFT contract initialized at:', CONTRACT_ADDRESSES.ObjectNFT);

            // Verify contract exists
            const objectCode = await this.provider.getCode(CONTRACT_ADDRESSES.ObjectNFT);
            if (objectCode === '0x') {
                console.error('❌ No contract found at ObjectNFT address!');
            } else {
                console.log('✅ ObjectNFT contract bytecode exists');
            }
        } else {
            console.warn('⚠️ ObjectNFT contract address not found in environment variables');
        }

        if (CONTRACT_ADDRESSES.SceneNFT) {
            this.sceneNFTContract = new ethers.Contract(
                CONTRACT_ADDRESSES.SceneNFT,
                SCENE_NFT_ABI,
                this.signer
            );
            console.log('✅ SceneNFT contract initialized at:', CONTRACT_ADDRESSES.SceneNFT);

            // Verify contract exists
            const sceneCode = await this.provider.getCode(CONTRACT_ADDRESSES.SceneNFT);
            if (sceneCode === '0x') {
                console.error('❌ No contract found at SceneNFT address!');
                throw new Error(`No contract deployed at SceneNFT address: ${CONTRACT_ADDRESSES.SceneNFT}. Please verify the contract is deployed on Base Sepolia.`);
            } else {
                console.log('✅ SceneNFT contract bytecode exists');
            }
        } else {
            console.warn('⚠️ SceneNFT contract address not found in environment variables');
        }
    }

    /**
     * Mint an Object NFT
     * @param {Object} params - Minting parameters
     * @param {string} params.ipfsCID - IPFS CID of the GLB file
     * @param {string} params.metadataCID - IPFS CID of the metadata JSON
     * @param {string} params.objectType - Type of object
     * @param {string} params.category - Category of object
     * @param {Function} onProgress - Progress callback
     * @returns {Promise<{tokenId: number, txHash: string}>}
     */
    async mintObject({ ipfsCID, metadataCID, objectType, category }, onProgress) {
        if (!this.objectNFTContract) {
            throw new Error('ObjectNFT contract not initialized');
        }

        try {
            const address = await this.signer.getAddress();

            console.log('🔵 Minting Object NFT...');
            console.log('Contract Address:', this.objectNFTContract.target);
            console.log('Minting to:', address);
            console.log('IPFS CID:', ipfsCID);
            console.log('Metadata CID:', metadataCID);
            console.log('Object Type:', objectType);
            console.log('Category:', category);

            onProgress?.({ status: 'pending', message: 'Waiting for transaction approval...' });

            console.log('🔵 Calling contract.mintObject()...');

            let tx;
            try {
                tx = await this.objectNFTContract.mintObject(
                    address,
                    ipfsCID,
                    metadataCID,
                    objectType,
                    category
                );
            } catch (txError) {
                console.error('❌ Error calling mintObject:', txError);
                console.error('Error details:', {
                    message: txError.message,
                    code: txError.code,
                    reason: txError.reason,
                    data: txError.data
                });
                throw txError;
            }

            console.log('✅ Transaction sent:', tx.hash);

            onProgress?.({ status: 'mining', message: 'Transaction submitted, waiting for confirmation...', txHash: tx.hash });

            const receipt = await tx.wait();

            // Extract token ID from event logs
            const event = receipt.logs.find(log => {
                try {
                    const parsed = this.objectNFTContract.interface.parseLog(log);
                    return parsed.name === 'ObjectMinted';
                } catch {
                    return false;
                }
            });

            let tokenId = null;
            if (event) {
                const parsed = this.objectNFTContract.interface.parseLog(event);
                tokenId = Number(parsed.args.tokenId);
            }

            onProgress?.({ status: 'success', message: 'Object NFT minted successfully!', tokenId, txHash: receipt.hash });

            return { tokenId, txHash: receipt.hash };
        } catch (error) {
            console.error('Error minting object NFT:', error);
            onProgress?.({ status: 'error', message: error.message });
            throw error;
        }
    }

    /**
     * Mint a Scene NFT
     * @param {Object} params - Minting parameters
     * @param {string} params.sceneCID - IPFS CID of the scene JSON
     * @param {string} params.metadataCID - IPFS CID of the metadata JSON
     * @param {string} params.thumbnailCID - IPFS CID of the thumbnail
     * @param {string} params.name - Scene name
     * @param {number[]} params.objectTokenIds - Array of object token IDs
     * @param {Function} onProgress - Progress callback
     * @returns {Promise<{tokenId: number, txHash: string}>}
     */
    async mintScene({ sceneCID, metadataCID, thumbnailCID, name, objectTokenIds = [] }, onProgress) {
        if (!this.sceneNFTContract) {
            throw new Error('SceneNFT contract not initialized');
        }

        try {
            const address = await this.signer.getAddress();

            console.log('🔵 Minting Scene NFT...');
            console.log('Contract Address:', this.sceneNFTContract.target);
            console.log('Minting to:', address);
            console.log('Scene CID:', sceneCID);
            console.log('Metadata CID:', metadataCID);
            console.log('Thumbnail CID:', thumbnailCID);
            console.log('Name:', name);
            console.log('Object Token IDs:', objectTokenIds);

            // Verify contract is accessible by calling a view function
            try {
                const tokens = await this.sceneNFTContract.getCreatorTokens(address);
                console.log('✅ Contract is accessible. Existing tokens:', tokens.length);

                // Check contract owner
                const contractOwner = await this.sceneNFTContract.owner();
                console.log('Contract Owner:', contractOwner);
                console.log('Your Address:', address);
                console.log('Are you the owner?', contractOwner.toLowerCase() === address.toLowerCase());
            } catch (viewError) {
                console.error('⚠️ Warning: Could not call view function:', viewError.message);
            }

            // Check network
            const network = await this.provider.getNetwork();
            console.log('Connected to network:', {
                name: network.name,
                chainId: network.chainId.toString()
            });

            // Base Sepolia chainId is 84532
            if (network.chainId !== 84532n) {
                throw new Error(`Wrong network! Please switch to Base Sepolia (chainId: 84532). Currently on chainId: ${network.chainId}`);
            }

            onProgress?.({ status: 'pending', message: 'Waiting for transaction approval...' });

            console.log('🔵 Calling contract.mintScene()...');

            let tx;
            try {
                // Try to estimate gas first to get better error messages
                console.log('Estimating gas...');
                try {
                    const gasEstimate = await this.sceneNFTContract.mintScene.estimateGas(
                        address,
                        sceneCID,
                        metadataCID,
                        thumbnailCID,
                        name,
                        objectTokenIds
                    );
                    console.log('✅ Gas estimate:', gasEstimate.toString());
                } catch (gasError) {
                    console.error('❌ Gas estimation failed:', gasError);

                    // Try to get the revert reason
                    if (gasError.data) {
                        console.error('Error data:', gasError.data);
                    }

                    // Try calling the function as a static call to get the revert reason
                    try {
                        await this.sceneNFTContract.mintScene.staticCall(
                            address,
                            sceneCID,
                            metadataCID,
                            thumbnailCID,
                            name,
                            objectTokenIds
                        );
                    } catch (staticError) {
                        console.error('❌ Static call error:', staticError);
                        if (staticError.reason) {
                            console.error('Revert reason:', staticError.reason);
                        }
                    }

                    throw new Error(`Gas estimation failed: ${gasError.message}. This usually means the transaction would revert. Check the console for details.`);
                }

                tx = await this.sceneNFTContract.mintScene(
                    address,
                    sceneCID,
                    metadataCID,
                    thumbnailCID,
                    name,
                    objectTokenIds
                );
            } catch (txError) {
                console.error('❌ Error calling mintScene:', txError);
                console.error('Error details:', {
                    message: txError.message,
                    code: txError.code,
                    reason: txError.reason,
                    data: txError.data
                });
                throw txError;
            }

            console.log('✅ Transaction sent:', tx.hash);

            onProgress?.({ status: 'mining', message: 'Transaction submitted, waiting for confirmation...', txHash: tx.hash });

            const receipt = await tx.wait();

            // Extract token ID from event logs
            const event = receipt.logs.find(log => {
                try {
                    const parsed = this.sceneNFTContract.interface.parseLog(log);
                    return parsed.name === 'SceneMinted';
                } catch {
                    return false;
                }
            });

            let tokenId = null;
            if (event) {
                const parsed = this.sceneNFTContract.interface.parseLog(event);
                tokenId = Number(parsed.args.tokenId);
            }

            onProgress?.({ status: 'success', message: 'Scene NFT minted successfully!', tokenId, txHash: receipt.hash });

            return { tokenId, txHash: receipt.hash };
        } catch (error) {
            console.error('Error minting scene NFT:', error);
            onProgress?.({ status: 'error', message: error.message });
            throw error;
        }
    }

    /**
     * Get user's owned Object NFTs
     * @param {string} address - User's wallet address
     * @returns {Promise<Array>} Array of object NFT data
     */
    async getUserObjects(address) {
        if (!this.objectNFTContract) {
            throw new Error('ObjectNFT contract not initialized');
        }

        try {
            const tokenIds = await this.objectNFTContract.getCreatorTokens(address);

            const objects = await Promise.all(
                tokenIds.map(async (tokenId) => {
                    const metadata = await this.objectNFTContract.getObjectMetadata(tokenId);
                    const tokenURI = await this.objectNFTContract.tokenURI(tokenId);

                    return {
                        tokenId: Number(tokenId),
                        ipfsCID: metadata.ipfsCID,
                        metadataCID: metadata.metadataCID,
                        objectType: metadata.objectType,
                        category: metadata.category,
                        version: Number(metadata.version),
                        createdAt: Number(metadata.createdAt),
                        creator: metadata.creator,
                        tokenURI,
                    };
                })
            );

            return objects;
        } catch (error) {
            console.error('Error fetching user objects:', error);
            throw error;
        }
    }

    /**
     * Get user's owned Scene NFTs
     * @param {string} address - User's wallet address
     * @returns {Promise<Array>} Array of scene NFT data
     */
    async getUserScenes(address) {
        if (!this.sceneNFTContract) {
            throw new Error('SceneNFT contract not initialized');
        }

        try {
            const tokenIds = await this.sceneNFTContract.getCreatorTokens(address);

            const scenes = await Promise.all(
                tokenIds.map(async (tokenId) => {
                    const metadata = await this.sceneNFTContract.getSceneMetadata(tokenId);

                    return {
                        tokenId: Number(tokenId),
                        sceneCID: metadata.sceneCID,
                        metadataCID: metadata.metadataCID,
                        thumbnailCID: metadata.thumbnailCID,
                        name: metadata.name,
                        objectTokenIds: metadata.objectTokenIds.map(id => Number(id)),
                        version: Number(metadata.version),
                        createdAt: Number(metadata.createdAt),
                        creator: metadata.creator,
                    };
                })
            );

            return scenes;
        } catch (error) {
            console.error('Error fetching user scenes:', error);
            throw error;
        }
    }

    /**
     * Fetch metadata from IPFS
     * @param {string} cid - IPFS CID
     * @returns {Promise<Object>} Metadata object
     */
    async fetchMetadataFromIPFS(cid) {
        try {
            const url = `${IPFS_GATEWAY}${cid}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching metadata from IPFS:', error);
            throw error;
        }
    }

    /**
     * Fetch scene data from IPFS
     * @param {string} cid - IPFS CID of scene JSON
     * @returns {Promise<Object>} Scene data
     */
    async fetchSceneFromIPFS(cid) {
        return await this.fetchMetadataFromIPFS(cid);
    }

    /**
     * Get IPFS gateway URL for a CID
     * @param {string} cid - IPFS CID
     * @returns {string} Gateway URL
     */
    getIPFSUrl(cid) {
        return `${IPFS_GATEWAY}${cid}`;
    }
}

// Export singleton instance
export const blockchainService = new BlockchainService();
export default blockchainService;
