import lighthouse from '@lighthouse-web3/sdk';

const API_KEY = import.meta.env.VITE_LIGHTHOUSE_API_KEY;
/**
 * Service for interacting with Lighthouse IPFS storage
 */
class LighthouseService {
    /**
     * Upload a file to Lighthouse
     * @param {File} file - File object to upload
     * @param {Function} onProgress - Progress callback
     * @returns {Promise<string>} IPFS CID
     */
    async uploadFile(file, onProgress) {
        if (!API_KEY) {
            throw new Error('Lighthouse API Key not found');
        }

        try {
            const output = await lighthouse.upload(
                [file],
                API_KEY,
                1,
                null,
                (progressData) => {
                    if (onProgress) {
                        const percentage = Math.round((progressData.total / progressData.uploaded) * 100);
                        onProgress(percentage);
                    }
                }
            );

            return output.data.Hash;
        } catch (error) {
            console.error('Lighthouse upload error:', error);
            throw new Error('Failed to upload file to Lighthouse');
        }
    }

    /**
     * Upload JSON data to Lighthouse
     * @param {Object} jsonData - JSON object to upload
     * @param {string} filename - Name for the file
     * @returns {Promise<string>} IPFS CID
     */
    async uploadJSON(jsonData, filename = 'data.json') {
        if (!API_KEY) {
            throw new Error('Lighthouse API Key not found');
        }

        try {
            const jsonString = JSON.stringify(jsonData);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const file = new File([blob], filename, { type: 'application/json' });

            return await this.uploadFile(file);
        } catch (error) {
            console.error('Lighthouse JSON upload error:', error);
            throw new Error('Failed to upload JSON to Lighthouse');
        }
    }

    /**
     * Get IPFS Gateway URL
     * @param {string} cid - IPFS CID
     * @returns {string} Gateway URL
     */
    getGatewayUrl(cid) {
        return `https://gateway.lighthouse.storage/ipfs/${cid}`;
    }
}

export const lighthouseService = new LighthouseService();
export default lighthouseService;