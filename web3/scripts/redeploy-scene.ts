import { network } from "hardhat";

/**
 * Redeploy SceneNFT contract
 * Usage: pnpm hardhat run scripts/redeploy-scene.ts --network baseSepolia
 * 
 * Note: After deployment, manually register the SceneNFT in the Registry if needed:
 * - Registry address: 0xeaA614651391F181bFc7B89B0c5A80571f30C6FF
 * - Call registerSceneNFT(newSceneNFTAddress) on the Registry contract
 */
async function main() {
  const { ethers } = await network.connect();
  
  console.log("Redeploying SceneNFT contract...");
  console.log("Network:", network.name);
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  // Deploy SceneNFT
  console.log("\nDeploying SceneNFT...");
  const SceneNFT = await ethers.getContractFactory("SceneNFT");
  const sceneNFT = await SceneNFT.deploy();
  await sceneNFT.waitForDeployment();
  const sceneNFTAddress = await sceneNFT.getAddress();
  console.log("✅ SceneNFT deployed to:", sceneNFTAddress);

  // Try to register in Registry (using known Registry address)
  const REGISTRY_ADDRESS = "0xeaA614651391F181bFc7B89B0c5A80571f30C6FF";
  
  try {
    const Registry = await ethers.getContractFactory("Registry");
    const registry = Registry.attach(REGISTRY_ADDRESS);
    
    console.log("\nRegistering SceneNFT in Registry...");
    const tx = await registry.registerSceneNFT(sceneNFTAddress);
    await tx.wait();
    console.log("✅ SceneNFT registered in Registry");
  } catch (error: any) {
    console.error("⚠️ Warning: Could not register SceneNFT in Registry:", error.message);
    console.log("   You can register it manually later if needed.");
  }

  console.log("\n=== Deployment Summary ===");
  console.log("SceneNFT:", sceneNFTAddress);
  console.log("\n⚠️ IMPORTANT: Update your .env file (or environment variables) with:");
  console.log(`VITE_SCENE_NFT_ADDRESS=${sceneNFTAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

