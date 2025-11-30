import { network } from "hardhat";

/**
 * Deploy all contracts using Hardhat Ignition
 * Usage: pnpm hardhat ignition deploy ignition/modules/FullDeployment.ts --network <network_name>
 * 
 * Or use the separate deployment script:
 * pnpm hardhat run scripts/deploy-separate.ts --network <network_name>
 */
async function main() {
  console.log("This script is a placeholder.");
  console.log("To deploy using Hardhat Ignition, run:");
  console.log("  pnpm hardhat ignition deploy ignition/modules/FullDeployment.ts --network <network_name>");
  console.log("\nOr use the separate deployment script:");
  console.log("  pnpm hardhat run scripts/deploy-separate.ts --network <network_name>");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

