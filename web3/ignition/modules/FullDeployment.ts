import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Full deployment module that deploys all contracts and sets up the registry
 * This module deploys Registry, ObjectNFT, and SceneNFT, then registers the NFT contracts
 */
export default buildModule("FullDeploymentModule", (m) => {
  // Deploy Registry first
  const registry = m.contract("Registry");

  // Deploy ObjectNFT and SceneNFT
  const objectNFT = m.contract("ObjectNFT");
  const sceneNFT = m.contract("SceneNFT");

  // Register the NFT contracts in the registry
  m.call(registry, "registerObjectNFT", [objectNFT]);
  m.call(registry, "registerSceneNFT", [sceneNFT]);

  return { registry, objectNFT, sceneNFT };
});

