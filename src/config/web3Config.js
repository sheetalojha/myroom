import { http, createConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Base Sepolia configuration
export const baseSepoliaChain = baseSepolia;

// Wagmi configuration for v3
export const wagmiConfig = createConfig({
    chains: [baseSepolia],
    connectors: [
        injected(),
    ],
    transports: {
        [baseSepolia.id]: http(),
    },
});

// Contract addresses (will be populated after deployment)
export const CONTRACT_ADDRESSES = {
    Registry: import.meta.env.VITE_REGISTRY_ADDRESS || '',
    ObjectNFT: import.meta.env.VITE_OBJECT_NFT_ADDRESS || '',
    SceneNFT: import.meta.env.VITE_SCENE_NFT_ADDRESS || '',
};

// Contract ABIs (simplified - only including functions we'll use)
export const OBJECT_NFT_ABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "string", "name": "ipfsCID", "type": "string" },
            { "internalType": "string", "name": "metadataCID", "type": "string" },
            { "internalType": "string", "name": "objectType", "type": "string" },
            { "internalType": "string", "name": "category", "type": "string" }
        ],
        "name": "mintObject",
        "outputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "creator", "type": "address" }],
        "name": "getCreatorTokens",
        "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "name": "getObjectMetadata",
        "outputs": [
            {
                "components": [
                    { "internalType": "string", "name": "ipfsCID", "type": "string" },
                    { "internalType": "string", "name": "metadataCID", "type": "string" },
                    { "internalType": "string", "name": "objectType", "type": "string" },
                    { "internalType": "string", "name": "category", "type": "string" },
                    { "internalType": "uint256", "name": "version", "type": "uint256" },
                    { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
                    { "internalType": "address", "name": "creator", "type": "address" },
                    { "internalType": "uint256", "name": "parentTokenId", "type": "uint256" }
                ],
                "internalType": "struct ObjectNFT.ObjectMetadata",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "name": "tokenURI",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    }
];

export const SCENE_NFT_ABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "string", "name": "sceneCID", "type": "string" },
            { "internalType": "string", "name": "metadataCID", "type": "string" },
            { "internalType": "string", "name": "thumbnailCID", "type": "string" },
            { "internalType": "string", "name": "name", "type": "string" },
            { "internalType": "uint256[]", "name": "objectTokenIds", "type": "uint256[]" }
        ],
        "name": "mintScene",
        "outputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "creator", "type": "address" }],
        "name": "getCreatorTokens",
        "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "name": "getSceneMetadata",
        "outputs": [
            {
                "components": [
                    { "internalType": "string", "name": "sceneCID", "type": "string" },
                    { "internalType": "string", "name": "metadataCID", "type": "string" },
                    { "internalType": "string", "name": "thumbnailCID", "type": "string" },
                    { "internalType": "string", "name": "name", "type": "string" },
                    { "internalType": "uint256[]", "name": "objectTokenIds", "type": "uint256[]" },
                    { "internalType": "uint256", "name": "version", "type": "uint256" },
                    { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
                    { "internalType": "address", "name": "creator", "type": "address" },
                    { "internalType": "uint256", "name": "parentTokenId", "type": "uint256" }
                ],
                "internalType": "struct SceneNFT.SceneMetadata",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// IPFS Gateway
// IPFS Gateway
export const IPFS_GATEWAY = 'https://gateway.lighthouse.storage/ipfs/';

// NFT.Storage API Key (should be in environment variables)
export const NFT_STORAGE_API_KEY = import.meta.env.VITE_NFT_STORAGE_API_KEY || '';