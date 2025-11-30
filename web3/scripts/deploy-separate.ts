import { network } from "hardhat";

/**
 * Deploy contracts separately (useful for incremental deployments)
 * Usage: pnpm hardhat run scripts/deploy-separate.ts --network <network_name>
 */
async function main() {
  const { ethers } = await network.connect();
  
  console.log("Deploying contracts separately...");
  console.log("Network:", network.name);
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  // Deploy Registry
  console.log("\n1. Deploying Registry...");
  const Registry = await ethers.getContractFactory("Registry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("   Registry deployed to:", registryAddress);

  // Deploy ObjectNFT
  console.log("\n2. Deploying ObjectNFT...");
  const ObjectNFT = await ethers.getContractFactory("ObjectNFT");
  const objectNFT = await ObjectNFT.deploy();
  await objectNFT.waitForDeployment();
  const objectNFTAddress = await objectNFT.getAddress();
  console.log("   ObjectNFT deployed to:", objectNFTAddress);

  // Deploy SceneNFT
  console.log("\n3. Deploying SceneNFT...");
  const SceneNFT = await ethers.getContractFactory("SceneNFT");
  const sceneNFT = await SceneNFT.deploy();
  await sceneNFT.waitForDeployment();
  const sceneNFTAddress = await sceneNFT.getAddress();
  console.log("   SceneNFT deployed to:", sceneNFTAddress);

  // Register contracts in Registry
  console.log("\n4. Registering contracts in Registry...");
  const tx1 = await registry.registerObjectNFT(objectNFTAddress);
  await tx1.wait();
  console.log("   ✓ ObjectNFT registered");

  const tx2 = await registry.registerSceneNFT(sceneNFTAddress);
  await tx2.wait();
  console.log("   ✓ SceneNFT registered");

  console.log("\n=== Deployment Summary ===");
  console.log("Registry:", registryAddress);
  console.log("ObjectNFT:", objectNFTAddress);
  console.log("SceneNFT:", sceneNFTAddress);
  console.log("\n✅ All contracts deployed and registered successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

