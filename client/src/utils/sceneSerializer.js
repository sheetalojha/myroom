/**
 * Scene serializer for blockchain storage
 */

/**
 * Serialize scene data for IPFS storage
 * @param {Array} objects - Array of objects from the store
 * @param {Object} roomConfig - Room configuration (themes, lighting, walls, etc.)
 * @returns {Object} Serialized scene data
 */
export function serializeScene(objects, roomConfig = null) {
    return {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        objects: objects.map(obj => ({
            id: obj.id,
            type: obj.type,
            position: obj.position,
            rotation: obj.rotation,
            scale: obj.scale,
            color: obj.color,
            data: obj.data || {},
        })),
        roomConfig: roomConfig || null, // Include room configuration (themes, lighting, walls, floor, etc.)
    };
}

/**
 * Deserialize scene data from IPFS
 * @param {Object} sceneData - Scene data from IPFS
 * @returns {Object} Object containing objects array and roomConfig
 */
export function deserializeScene(sceneData) {
    if (!sceneData || !sceneData.objects) {
        throw new Error('Invalid scene data');
    }

    return {
        objects: sceneData.objects.map(obj => ({
            id: obj.id,
            type: obj.type,
            position: obj.position || [0, 1, 0],
            rotation: obj.rotation || [0, 0, 0],
            scale: obj.scale || [1, 1, 1],
            color: obj.color || '#ffffff',
            data: obj.data || {},
        })),
        roomConfig: sceneData.roomConfig || null, // Restore room configuration if present
    };
}

/**
 * Validate scene data
 * @param {Object} sceneData - Scene data to validate
 * @returns {boolean} True if valid
 */
export function validateSceneData(sceneData) {
    if (!sceneData || typeof sceneData !== 'object') {
        return false;
    }

    if (!Array.isArray(sceneData.objects)) {
        return false;
    }

    // Validate each object
    for (const obj of sceneData.objects) {
        if (!obj.id || !obj.type) {
            return false;
        }
        if (!Array.isArray(obj.position) || obj.position.length !== 3) {
            return false;
        }
        if (!Array.isArray(obj.rotation) || obj.rotation.length !== 3) {
            return false;
        }
        if (!Array.isArray(obj.scale) || obj.scale.length !== 3) {
            return false;
        }
    }

    // roomConfig is optional, but if present should be an object
    if (sceneData.roomConfig !== undefined && sceneData.roomConfig !== null && typeof sceneData.roomConfig !== 'object') {
        return false;
    }

    return true;
}

/**
 * Get scene statistics
 * @param {Array} objects - Array of objects
 * @returns {Object} Scene statistics
 */
export function getSceneStats(objects) {
    const stats = {
        totalObjects: objects.length,
        objectTypes: {},
        categories: {},
    };

    objects.forEach(obj => {
        // Count by type
        stats.objectTypes[obj.type] = (stats.objectTypes[obj.type] || 0) + 1;
    });

    return stats;
}