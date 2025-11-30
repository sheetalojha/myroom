// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Registry
 * @dev Central registry for tracking ObjectNFT and SceneNFT contracts and global statistics
 */
contract Registry is Ownable {
    
    // Contract addresses
    address public objectNFTAddress;
    address public sceneNFTAddress;
    
    // Approved object types and categories
    mapping(string => bool) public approvedObjectTypes;
    mapping(string => bool) public approvedCategories;
    
    // Global statistics
    uint256 public totalObjectsMinted;
    uint256 public totalScenesMinted;
    
    // Events
    event ObjectNFTRegistered(address indexed contractAddress);
    event SceneNFTRegistered(address indexed contractAddress);
    event ObjectTypesApproved(string[] objectTypes);
    event CategoriesApproved(string[] categories);
    event ObjectMintedGlobal(address indexed creator, uint256 tokenId);
    event SceneMintedGlobal(address indexed creator, uint256 tokenId);
    
    constructor() Ownable() {
        // Initialize with default approved types
        _approveDefaultTypes();
    }
    
    /**
     * @dev Register the ObjectNFT contract address
     * @param _objectNFTAddress Address of the ObjectNFT contract
     */
    function registerObjectNFT(address _objectNFTAddress) external onlyOwner {
        require(_objectNFTAddress != address(0), "Invalid address");
        objectNFTAddress = _objectNFTAddress;
        emit ObjectNFTRegistered(_objectNFTAddress);
    }
    
    /**
     * @dev Register the SceneNFT contract address
     * @param _sceneNFTAddress Address of the SceneNFT contract
     */
    function registerSceneNFT(address _sceneNFTAddress) external onlyOwner {
        require(_sceneNFTAddress != address(0), "Invalid address");
        sceneNFTAddress = _sceneNFTAddress;
        emit SceneNFTRegistered(_sceneNFTAddress);
    }
    
    /**
     * @dev Approve object types for minting
     * @param objectTypes Array of object type strings to approve
     */
    function approveObjectTypes(string[] memory objectTypes) external onlyOwner {
        for (uint256 i = 0; i < objectTypes.length; i++) {
            approvedObjectTypes[objectTypes[i]] = true;
        }
        emit ObjectTypesApproved(objectTypes);
    }
    
    /**
     * @dev Approve categories for minting
     * @param categories Array of category strings to approve
     */
    function approveCategories(string[] memory categories) external onlyOwner {
        for (uint256 i = 0; i < categories.length; i++) {
            approvedCategories[categories[i]] = true;
        }
        emit CategoriesApproved(categories);
    }
    
    /**
     * @dev Record an object mint (called by ObjectNFT contract or owner)
     * @param creator Address of the creator
     * @param tokenId Token ID of the minted object
     */
    function recordObjectMint(address creator, uint256 tokenId) external {
        require(
            msg.sender == objectNFTAddress || msg.sender == owner(),
            "Not authorized"
        );
        totalObjectsMinted++;
        emit ObjectMintedGlobal(creator, tokenId);
    }
    
    /**
     * @dev Record a scene mint (called by SceneNFT contract or owner)
     * @param creator Address of the creator
     * @param tokenId Token ID of the minted scene
     */
    function recordSceneMint(address creator, uint256 tokenId) external {
        require(
            msg.sender == sceneNFTAddress || msg.sender == owner(),
            "Not authorized"
        );
        totalScenesMinted++;
        emit SceneMintedGlobal(creator, tokenId);
    }
    
    /**
     * @dev Check if an object type is approved
     * @param objectType The object type to check
     * @return bool True if approved
     */
    function isObjectTypeApproved(string memory objectType) external view returns (bool) {
        return approvedObjectTypes[objectType];
    }
    
    /**
     * @dev Check if a category is approved
     * @param category The category to check
     * @return bool True if approved
     */
    function isCategoryApproved(string memory category) external view returns (bool) {
        return approvedCategories[category];
    }
    
    /**
     * @dev Get global statistics
     * @return objects Total objects minted
     * @return scenes Total scenes minted
     */
    function getGlobalStats() external view returns (uint256 objects, uint256 scenes) {
        return (totalObjectsMinted, totalScenesMinted);
    }
    
    /**
     * @dev Initialize default approved types and categories
     */
    function _approveDefaultTypes() private {
        // Approve default object types
        approvedObjectTypes["furniture"] = true;
        approvedObjectTypes["decor"] = true;
        approvedObjectTypes["lighting"] = true;
        approvedObjectTypes["cute"] = true;
        
        // Approve default categories
        approvedCategories["bed"] = true;
        approvedCategories["sofa"] = true;
        approvedCategories["table"] = true;
        approvedCategories["chair"] = true;
        approvedCategories["bookshelf"] = true;
        approvedCategories["rug"] = true;
        approvedCategories["wall_art"] = true;
        approvedCategories["mirror"] = true;
        approvedCategories["plant"] = true;
        approvedCategories["lamp"] = true;
        approvedCategories["fairy_lights"] = true;
        approvedCategories["plushie"] = true;
        approvedCategories["mug"] = true;
    }
}

