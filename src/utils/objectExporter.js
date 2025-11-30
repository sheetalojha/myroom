import { exportObjectToGLB, arrayBufferToBlob } from './glbExporter';

/**
 * Export object data to GLB format by accessing the Three.js object from the scene
 * This is a general approach that works for any object type
 * @param {string} objectId - ID of the object to export
 * @returns {Promise<Blob>} GLB file as Blob
 */
export async function exportObjectDataToGLB(objectId) {
    // Get the Three.js object from the scene using the object ID
    const threeObject = getThreeObjectById(objectId);

    if (!threeObject) {
        throw new Error(`Object with ID ${objectId} not found in scene`);
    }

    // Clone the object to avoid modifying the original
    const objectClone = threeObject.clone(true);

    // Export to GLB
    const arrayBuffer = await exportObjectToGLB(objectClone);

    // Convert to Blob
    const blob = arrayBufferToBlob(arrayBuffer);

    return blob;
}

/**
 * Get Three.js object from the scene by object ID
 * This searches the scene for an object with the matching userData.id
 * @param {string} objectId - Object ID from the store
 * @returns {THREE.Object3D|null} Three.js object or null if not found
 */
function getThreeObjectById(objectId) {
    // Access the global scene reference
    // This will be set by the Scene component
    if (!window.__THREE_SCENE__) {
        throw new Error('Three.js scene not available. Make sure the scene is rendered.');
    }

    let foundObject = null;

    // Traverse the scene to find the object with matching ID
    window.__THREE_SCENE__.traverse((object) => {
        if (object.userData && object.userData.objectId === objectId) {
            foundObject = object;
        }
    });

    return foundObject;
}