/**
 * Metadata Generator for NFTs following OpenSea standards
 * Ported from backend services
 */

/**
 * Generate metadata for an Object NFT
 * @param {Object} params - Object parameters
 * @param {string} params.name - Object name
 * @param {string} params.description - Object description
 * @param {string} params.objectType - Type of object (furniture, decor, etc.)
 * @param {string} params.category - Category (chair, lamp, etc.)
 * @param {string} params.glbCID - IPFS CID of the GLB file
 * @param {string} params.imageCID - IPFS CID of the preview image (optional)
 * @param {Object} params.attributes - Additional attributes
 * @returns {Object} NFT metadata object
 */
export function generateObjectMetadata({
    name,
    description,
    objectType,
    category,
    glbCID,
    imageCID = null,
    attributes = {},
}) {
    const metadata = {
        name: name,
        description: description,
        image: imageCID ? `ipfs://${imageCID}` : null,
        animation_url: `ipfs://${glbCID}`,
        external_url: "https://life-3d-editor.app", // Update with your actual URL
        attributes: [
            {
                trait_type: "Object Type",
                value: objectType,
            },
            {
                trait_type: "Category",
                value: category,
            },
            {
                trait_type: "Format",
                value: "GLB",
            },
            {
                trait_type: "Created With",
                value: "Life 3D Editor",
            },
        ],
        properties: {
            glb_cid: glbCID,
            object_type: objectType,
            category: category,
            version: attributes.version || 1,
            created_at: new Date().toISOString(),
        },
    };

    // Add custom attributes
    if (attributes.color) {
        metadata.attributes.push({
            trait_type: "Color",
            value: attributes.color,
        });
    }

    if (attributes.scale) {
        metadata.attributes.push({
            trait_type: "Scale",
            value: attributes.scale,
        });
    }

    // Add any additional custom attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (!['version', 'color', 'scale'].includes(key)) {
            metadata.attributes.push({
                trait_type: key.charAt(0).toUpperCase() + key.slice(1),
                value: value,
            });
        }
    });

    return metadata;
}

/**
 * Generate metadata for a Scene NFT
 * @param {Object} params - Scene parameters
 * @param {string} params.name - Scene name
 * @param {string} params.description - Scene description
 * @param {string} params.sceneCID - IPFS CID of the scene JSON
 * @param {string} params.thumbnailCID - IPFS CID of the thumbnail image
 * @param {number} params.objectCount - Number of objects in the scene
 * @param {Array<number>} params.objectTokenIds - Array of object token IDs
 * @param {Object} params.attributes - Additional attributes
 * @returns {Object} NFT metadata object
 */
export function generateSceneMetadata({
    name,
    description,
    sceneCID,
    thumbnailCID,
    objectCount,
    objectTokenIds = [],
    attributes = {},
}) {
    const metadata = {
        name: name,
        description: description,
        image: `ipfs://${thumbnailCID}`,
        animation_url: `ipfs://${sceneCID}`,
        external_url: "https://life-3d-editor.app", // Update with your actual URL
        attributes: [
            {
                trait_type: "Type",
                value: "Scene",
            },
            {
                trait_type: "Object Count",
                value: objectCount,
                display_type: "number",
            },
            {
                trait_type: "Format",
                value: "3D Scene",
            },
            {
                trait_type: "Created With",
                value: "Life 3D Editor",
            },
        ],
        properties: {
            scene_cid: sceneCID,
            thumbnail_cid: thumbnailCID,
            object_count: objectCount,
            object_token_ids: objectTokenIds,
            version: attributes.version || 1,
            created_at: new Date().toISOString(),
        },
    };

    // Add complexity rating based on object count
    if (objectCount > 0) {
        let complexity = "Simple";
        if (objectCount > 10) complexity = "Complex";
        else if (objectCount > 5) complexity = "Moderate";

        metadata.attributes.push({
            trait_type: "Complexity",
            value: complexity,
        });
    }

    // Add custom attributes
    if (attributes.theme) {
        metadata.attributes.push({
            trait_type: "Theme",
            value: attributes.theme,
        });
    }

    if (attributes.style) {
        metadata.attributes.push({
            trait_type: "Style",
            value: attributes.style,
        });
    }

    // Add any additional custom attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (!['version', 'theme', 'style'].includes(key)) {
            metadata.attributes.push({
                trait_type: key.charAt(0).toUpperCase() + key.slice(1),
                value: value,
            });
        }
    });

    return metadata;
}

/**
 * Validate metadata against OpenSea standards
 * @param {Object} metadata - Metadata object to validate
 * @returns {boolean} True if valid
 */
export function validateMetadata(metadata) {
    const required = ['name', 'description'];
    const missing = required.filter(field => !metadata[field]);

    if (missing.length > 0) {
        console.error(`❌ Missing required fields: ${missing.join(', ')}`);
        return false;
    }

    if (!metadata.image && !metadata.animation_url) {
        console.error('❌ Metadata must have either image or animation_url');
        return false;
    }

    return true;
}