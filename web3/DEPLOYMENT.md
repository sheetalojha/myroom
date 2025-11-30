# Deployment Guide

This guide explains how to deploy the Registry, ObjectNFT, and SceneNFT contracts.

## Prerequisites

1. Set up your network configuration variables:
   ```bash
   # For Base Sepolia
   pnpm hardhat keystore set BASE_SEPOLIA_PRIVATE_KEY
   pnpm hardhat keystore set BASE_SEPOLIA_RPC_URL
   
   # Or set as environment variables
   export BASE_SEPOLIA_PRIVATE_KEY=your_private_key
   export BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
   ```

## Deployment Options

### Option 1: Deploy All Contracts Together (Recommended)

Deploy all contracts and automatically register them in the Registry:

```bash
pnpm hardhat ignition deploy ignition/modules/FullDeployment.ts --network baseSepolia
```

This will:
1. Deploy Registry
2. Deploy ObjectNFT
3. Deploy SceneNFT
4. Register ObjectNFT and SceneNFT in the Registry

### Option 2: Deploy Contracts Separately

If you need to deploy contracts incrementally:

```bash
pnpm hardhat run scripts/deploy-separate.ts --network baseSepolia
```

### Option 3: Deploy Individual Contracts

Deploy contracts one at a time:

```bash
# Deploy Registry
pnpm hardhat ignition deploy ignition/modules/Registry.ts --network baseSepolia

# Deploy ObjectNFT
pnpm hardhat ignition deploy ignition/modules/ObjectNFT.ts --network baseSepolia

# Deploy SceneNFT
pnpm hardhat ignition deploy ignition/modules/SceneNFT.ts --network baseSepolia
```

After deploying individually, you'll need to manually register the NFT contracts:

```bash
pnpm hardhat run scripts/register-contracts.ts --network baseSepolia
```

## Testing

Run all tests:
```bash
pnpm hardhat test
```

Run specific test files:
```bash
pnpm hardhat test test/Registry.ts
pnpm hardhat test test/ObjectNFT.ts
pnpm hardhat test test/SceneNFT.ts
```

## Contract Addresses

After deployment, save the contract addresses for your frontend configuration:

- Registry: `0x...`
- ObjectNFT: `0x...`
- SceneNFT: `0x...`

## Verification

After deployment, verify the contracts are properly set up:

1. Check Registry has registered addresses:
   ```bash
   # Using hardhat console
   pnpm hardhat console --network baseSepolia
   > const registry = await ethers.getContractAt("Registry", "REGISTRY_ADDRESS")
   > await registry.objectNFTAddress()
   > await registry.sceneNFTAddress()
   ```

2. Check default approved types:
   ```bash
   > await registry.isObjectTypeApproved("furniture")
   > await registry.isCategoryApproved("chair")
   ```

## Network Configuration

The project is configured for:
- **Base Sepolia**: Testnet for Base L2
- **Sepolia**: Ethereum L1 testnet

To add more networks, edit `hardhat.config.ts` and add network configurations.

