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
            // Create offscreen renderer
            const renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
                preserveDrawingBuffer: true
            });
            renderer.setSize(width, height);
            renderer.setClearColor(0x000000, 0);

            // Render the scene
            renderer.render(scene, camera);

            // Get canvas and convert to blob
            renderer.domElement.toBlob((blob) => {
                renderer.dispose();
                resolve(blob);
            }, 'image/png');
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
