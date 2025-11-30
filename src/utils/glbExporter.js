import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

/**
 * Export a Three.js object to GLB format
 * @param {THREE.Object3D} object - The Three.js object to export
 * @param {Object} options - Export options
 * @returns {Promise<ArrayBuffer>} GLB file as ArrayBuffer
 */
export async function exportToGLB(object, options = {}) {
    return new Promise((resolve, reject) => {
        const exporter = new GLTFExporter();

        const exportOptions = {
            binary: true, // Export as GLB (binary)
            onlyVisible: true,
            truncateDrawRange: true,
            ...options,
        };

        exporter.parse(
            object,
            (result) => {
                resolve(result);
            },
            (error) => {
                reject(error);
            },
            exportOptions
        );
    });
}

/**
 * Export the current scene to GLB
 * @param {THREE.Scene} scene - The Three.js scene
 * @param {Object} options - Export options
 * @returns {Promise<ArrayBuffer>} GLB file as ArrayBuffer
 */
export async function exportSceneToGLB(scene, options = {}) {
    // Clone the scene to avoid modifying the original
    const sceneClone = scene.clone();

    // Remove cameras, lights, and helpers if needed
    const itemsToRemove = [];
    sceneClone.traverse((child) => {
        if (child.isCamera || child.isLight || child.isHelper) {
            itemsToRemove.push(child);
        }
    });

    itemsToRemove.forEach(item => {
        if (item.parent) {
            item.parent.remove(item);
        }
    });

    return exportToGLB(sceneClone, options);
}

/**
 * Export a single object from the scene
 * @param {THREE.Object3D} object - The object to export
 * @returns {Promise<ArrayBuffer>} GLB file as ArrayBuffer
 */
export async function exportObjectToGLB(object) {
    // Clone the object to avoid modifying the original
    const objectClone = object.clone();

    return exportToGLB(objectClone);
}

/**
 * Generate a thumbnail from a Three.js scene
 * @param {THREE.Scene} scene - The scene to render
 * @param {THREE.Camera} camera - The camera to use
 * @param {number} width - Thumbnail width
 * @param {number} height - Thumbnail height
 * @returns {Promise<Blob>} Thumbnail as PNG blob
 */
export async function generateThumbnail(scene, camera, width = 512, height = 512) {
    return new Promise((resolve, reject) => {
        try {
            // Validate inputs
            if (!scene || !camera) {
                reject(new Error('Scene and camera must be provided'));
                return;
            }

            // Update camera matrix before rendering
            camera.updateMatrixWorld();

            // Create offscreen renderer with shadows enabled
            const renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
                preserveDrawingBuffer: true
            });
            renderer.setSize(width, height);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.setClearColor(0x202020, 1); // Match the scene background color

            // Update scene matrices
            scene.updateMatrixWorld();

            // Render the scene
            renderer.render(scene, camera);

            // Get canvas and convert to blob
            renderer.domElement.toBlob((blob) => {
                renderer.dispose();
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Failed to generate thumbnail blob'));
                }
            }, 'image/png', 0.95); // High quality PNG
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Convert ArrayBuffer to Blob
 * @param {ArrayBuffer} buffer - ArrayBuffer to convert
 * @param {string} mimeType - MIME type
 * @returns {Blob} Blob object
 */
export function arrayBufferToBlob(buffer, mimeType = 'model/gltf-binary') {
    return new Blob([buffer], { type: mimeType });
}

/**
 * Generate a thumbnail from the current scene
 * Uses the scene and camera exposed globally by the Scene component
 * @param {Object} options - Thumbnail options
 * @param {number} options.width - Thumbnail width (default: 1024)
 * @param {number} options.height - Thumbnail height (default: 1024)
 * @param {boolean} options.useCurrentCamera - Use current camera position or default angle (default: false)
 * @returns {Promise<Blob>} Thumbnail as PNG blob
 */
export async function generateSceneThumbnail(options = {}) {
    const {
        width = 1024,
        height = 1024,
        useCurrentCamera = false
    } = options;

    // Get scene from global reference
    if (!window.__THREE_SCENE__) {
        throw new Error('Three.js scene not available. Make sure the scene is rendered.');
    }

    const scene = window.__THREE_SCENE__;
    let camera;

    if (useCurrentCamera && window.__THREE_CAMERA__) {
        // Use the current camera from the scene
        const originalCamera = window.__THREE_CAMERA__;
        camera = new THREE.PerspectiveCamera(
            originalCamera.fov,
            width / height,
            originalCamera.near,
            originalCamera.far
        );
        camera.position.copy(originalCamera.position);
        camera.rotation.copy(originalCamera.rotation);
        camera.quaternion.copy(originalCamera.quaternion);
    } else {
        // Create a new camera with a good default viewing angle
        // Similar to the default camera position in Scene.jsx: [8, 8, 8]
        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(8, 8, 8);
        camera.lookAt(0, 0, 0);
    }

    // Instead of cloning, we'll use the scene directly but ensure it's updated
    // Cloning can cause issues with React Three Fiber's internal structure
    // We'll render synchronously so it shouldn't affect the main render
    
    // Update the scene's matrix world to ensure everything is in the right place
    scene.updateMatrixWorld(true);

    // Generate thumbnail using the original scene
    // Since we're rendering offscreen, this shouldn't interfere with the main render
    const thumbnailBlob = await generateThumbnail(scene, camera, width, height);

    // Note: We're using the original scene, so no cleanup needed
    // The camera will be garbage collected automatically

    return thumbnailBlob;
}

/**
 * Download a file to the user's computer
 * @param {Blob} blob - File blob
 * @param {string} filename - Filename
 */
export function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
