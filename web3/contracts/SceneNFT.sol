// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
/**
 * @title SceneNFT
 * @dev ERC-721 NFT contract for 3D scenes with object references and versioning
 */
contract SceneNFT is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Scene metadata structure
    struct SceneMetadata {
        string sceneCID;          // IPFS CID for the scene JSON
        string metadataCID;       // IPFS CID for metadata JSON
        string thumbnailCID;      // IPFS CID for scene thumbnail
        string name;              // Scene name
        uint256[] objectTokenIds; // Array of ObjectNFT token IDs used in scene
        uint256 version;          // Version number
        uint256 createdAt;        // Timestamp of creation
        address creator;          // Original creator address
        uint256 parentTokenId;    // If this is a version, reference to parent (0 if original)
    }
    
    // Mapping from token ID to scene metadata
    mapping(uint256 => SceneMetadata) public sceneMetadata;
    
    // Mapping from creator to their token IDs
    mapping(address => uint256[]) private _creatorTokens;
    
    // Events
    event SceneMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string sceneCID,
        string name,
        uint256 objectCount
    );
    
    event SceneVersioned(
        uint256 indexed newTokenId,
        uint256 indexed parentTokenId,
        address indexed creator,
        uint256 version
    );
    
    constructor() ERC721("Life Scene NFT", "LSCN") Ownable() {}
    
    /**
     * @dev Mint a new scene NFT
     * @param to Address to mint the NFT to
     * @param sceneCID IPFS CID of the scene JSON
     * @param metadataCID IPFS CID of the metadata JSON
     * @param thumbnailCID IPFS CID of the thumbnail image
     * @param name Name of the scene
     * @param objectTokenIds Array of ObjectNFT token IDs included in the scene
     * @return tokenId The ID of the newly minted token
     */
    function mintScene(
        address to,
        string memory sceneCID,
        string memory metadataCID,
        string memory thumbnailCID,
        string memory name,
        uint256[] memory objectTokenIds
    ) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, string(abi.encodePacked("ipfs://", metadataCID)));
        
        sceneMetadata[tokenId] = SceneMetadata({
            sceneCID: sceneCID,
            metadataCID: metadataCID,
            thumbnailCID: thumbnailCID,
            name: name,
            objectTokenIds: objectTokenIds,
            version: 1,
            createdAt: block.timestamp,
            creator: msg.sender,
            parentTokenId: 0
        });
        
        _creatorTokens[msg.sender].push(tokenId);
        
        emit SceneMinted(tokenId, msg.sender, sceneCID, name, objectTokenIds.length);
        
        return tokenId;
    }
    
    /**
     * @dev Create a new version of an existing scene
     * @param parentTokenId The token ID of the scene to version
     * @param sceneCID New IPFS CID for the updated scene JSON
     * @param metadataCID New IPFS CID for the updated metadata
     * @param thumbnailCID New IPFS CID for the updated thumbnail
     * @param objectTokenIds Updated array of ObjectNFT token IDs
     * @return tokenId The ID of the new version token
     */
    function createVersion(
        uint256 parentTokenId,
        string memory sceneCID,
        string memory metadataCID,
        string memory thumbnailCID,
        uint256[] memory objectTokenIds
    ) public returns (uint256) {
        require(_ownerOf(parentTokenId) == msg.sender, "Not the owner of parent token");
        
        SceneMetadata memory parentMetadata = sceneMetadata[parentTokenId];
        uint256 newVersion = parentMetadata.version + 1;
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, string(abi.encodePacked("ipfs://", metadataCID)));
        
        sceneMetadata[tokenId] = SceneMetadata({
            sceneCID: sceneCID,
            metadataCID: metadataCID,
            thumbnailCID: thumbnailCID,
            name: parentMetadata.name,
            objectTokenIds: objectTokenIds,
            version: newVersion,
            createdAt: block.timestamp,
            creator: parentMetadata.creator,
            parentTokenId: parentTokenId
        });
        
        _creatorTokens[msg.sender].push(tokenId);
        
        emit SceneVersioned(tokenId, parentTokenId, msg.sender, newVersion);
        
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
     * @dev Get scene metadata for a token
     * @param tokenId The token ID
     * @return SceneMetadata struct
     */
    function getSceneMetadata(uint256 tokenId) public view returns (SceneMetadata memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return sceneMetadata[tokenId];
    }
    
    /**
     * @dev Get object token IDs used in a scene
     * @param tokenId The scene token ID
     * @return Array of object token IDs
     */
    function getSceneObjects(uint256 tokenId) public view returns (uint256[] memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return sceneMetadata[tokenId].objectTokenIds;
    }
    
    /**
     * @dev Get total number of minted scenes
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

