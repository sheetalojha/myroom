import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ObjectNFTModule", (m) => {
  const objectNFT = m.contract("ObjectNFT");

  return { objectNFT };
});

