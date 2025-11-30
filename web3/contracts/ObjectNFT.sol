// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title ObjectNFT
 * @dev ERC-721 NFT contract for 3D objects with versioning and provenance tracking
 */
contract ObjectNFT is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Object metadata structure
    struct ObjectMetadata {
        string ipfsCID;           // IPFS CID for the GLB file
        string metadataCID;       // IPFS CID for metadata JSON
        string objectType;        // Type of object (e.g., "furniture", "decor")
        string category;          // Category (e.g., "chair", "lamp")
        uint256 version;          // Version number for updates
        uint256 createdAt;        // Timestamp of creation
        address creator;          // Original creator address
        uint256 parentTokenId;    // If this is a version, reference to parent (0 if original)
    }
    
    // Mapping from token ID to object metadata
    mapping(uint256 => ObjectMetadata) public objectMetadata;
    
    // Mapping from creator to their token IDs
    mapping(address => uint256[]) private _creatorTokens;
    
    // Events
    event ObjectMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string ipfsCID,
        string objectType,
        string category
    );
    
    event ObjectVersioned(
        uint256 indexed newTokenId,
        uint256 indexed parentTokenId,
        address indexed creator,
        uint256 version
    );
    
    constructor() ERC721("Life Object NFT", "LOBJ") Ownable() {}
    
    /**
     * @dev Mint a new object NFT
     * @param to Address to mint the NFT to
     * @param ipfsCID IPFS CID of the GLB file
     * @param metadataCID IPFS CID of the metadata JSON
     * @param objectType Type of the object
     * @param category Category of the object
     * @return tokenId The ID of the newly minted token
     */
    function mintObject(
        address to,
        string memory ipfsCID,
        string memory metadataCID,
        string memory objectType,
        string memory category
    ) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, string(abi.encodePacked("ipfs://", metadataCID)));
        
        objectMetadata[tokenId] = ObjectMetadata({
            ipfsCID: ipfsCID,
            metadataCID: metadataCID,
            objectType: objectType,
            category: category,
            version: 1,
            createdAt: block.timestamp,
            creator: msg.sender,
            parentTokenId: 0
        });
        
        _creatorTokens[msg.sender].push(tokenId);
        
        emit ObjectMinted(tokenId, msg.sender, ipfsCID, objectType, category);
        
        return tokenId;
    }
    
    /**
     * @dev Create a new version of an existing object
     * @param parentTokenId The token ID of the object to version
     * @param ipfsCID New IPFS CID for the updated GLB file
     * @param metadataCID New IPFS CID for the updated metadata
     * @return tokenId The ID of the new version token
     */
    function createVersion(
        uint256 parentTokenId,
        string memory ipfsCID,
        string memory metadataCID
    ) public returns (uint256) {
        require(_ownerOf(parentTokenId) == msg.sender, "Not the owner of parent token");
        
        ObjectMetadata memory parentMetadata = objectMetadata[parentTokenId];
        uint256 newVersion = parentMetadata.version + 1;
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, string(abi.encodePacked("ipfs://", metadataCID)));
        
        objectMetadata[tokenId] = ObjectMetadata({
            ipfsCID: ipfsCID,
            metadataCID: metadataCID,
            objectType: parentMetadata.objectType,
            category: parentMetadata.category,
            version: newVersion,
            createdAt: block.timestamp,
            creator: parentMetadata.creator,
            parentTokenId: parentTokenId
        });
        
        _creatorTokens[msg.sender].push(tokenId);
        
        emit ObjectVersioned(tokenId, parentTokenId, msg.sender, newVersion);
        
        return tokenId;
    }
    
    /**
     * @dev Get all token IDs owned by a creator
     * @param creator The creator address
     * @return Array of token IDs
     */
    function getCreatorTokens(address creator) public view returns (uint256[] memory) {
        return _creatorTokens[creator];
    }
    
    /**
     * @dev Get object metadata for a token
     * @param tokenId The token ID
     * @return ObjectMetadata struct
     */
    function getObjectMetadata(uint256 tokenId) public view returns (ObjectMetadata memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return objectMetadata[tokenId];
    }
    
    /**
     * @dev Get total number of minted objects
     * @return Total count
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    // Required overrides
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}

