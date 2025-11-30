import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SceneNFTModule", (m) => {
  const sceneNFT = m.contract("SceneNFT");

  return { sceneNFT };
});

