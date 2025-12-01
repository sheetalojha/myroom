<div align="center">
  <div style="display: flex; align-items: center; justify-content: center; gap: 20px; padding: 40px 20px; background: linear-gradient(135deg, #fff8f5 0%, #f0e8ff 100%); border-radius: 16px; margin-bottom: 40px;">
    <!-- Logo placeholder - Replace with your logo image -->
    <div style="width: 12px; height: 12px; background: #fff; border-radius: 24px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
      <img src="https://github.com/user-attachments/assets/83f28db2-9a55-4ab7-910d-7e8199d57c55" alt="LittleWorlds Logo" style="width: 20%; height: 20%; object-fit: contain; border-radius: 24px;" onerror="this.style.display='none'; this.parentElement.innerHTML='<span style=\'font-size: 48px; color: #6b5d6b;\'>LW</span>'">
    </div>
    <div style="text-align: left;">
      <h1 style="margin: 0; font-size: 48px; font-weight: 600; color: #6b5d6b; background: linear-gradient(135deg, #ff6b9d 0%, #b894f5 50%, #6ba3ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">LittleWorlds</h1>
      <p style="margin: 8px 0 0 0; font-size: 20px; color: #8b7d8b; font-style: italic;">Build worlds. Own them truly.</p>
    </div>
  </div>
</div>


**LittleWorlds** is a Web3-powered 3D virtual room editor that enables users to create, own, and trade immersive 3D spaces and objects as on-chain NFTs. Every object and scene you create is truly yours—portable across platforms, verifiable on-chain, and tradeable in a decentralized marketplace.

---

## Table of Contents

- [What is LittleWorlds?](#what-is-littleworlds)
- [The Problem We're Solving](#the-problem-were-solving)
- [Our Solution](#our-solution)
- [How It Works](#how-it-works)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Future Goals](#future-goals)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## What is LittleWorlds?

LittleWorlds is a decentralized platform for creating and owning 3D virtual spaces. Think of it as **Minecraft meets NFTs**—but with true ownership, portability, and a creator-first economy.

Users can:
- **Build** custom 3D rooms using our intuitive editor
- **Decorate** with furniture, decor, lighting, and characters
- **Mint** their creations as NFTs on Base Sepolia
- **Version** their rooms while maintaining provenance
- **Explore** and discover rooms created by others
- **Trade** objects and scenes in a decentralized marketplace
- **Discover** rewards and easter eggs hidden in-world

---

## The Problem We're Solving

### The Current State of Virtual Worlds

1. **Platform Lock-in**: Your virtual assets are trapped within specific platforms. You can't take your Roblox items to Minecraft, or your Second Life furniture to VRChat.

2. **No True Ownership**: Despite spending hours creating or purchasing virtual items, you don't actually own them. Platforms can revoke access, change terms, or shut down—and you lose everything.

3. **Creator Exploitation**: Content creators receive minimal compensation, and platforms take massive cuts. There's no way to earn ongoing royalties from your creations.

4. **Fragmented Ecosystems**: Each virtual world is an isolated island. Assets can't move between platforms, limiting creativity and value.

5. **Centralized Control**: Platforms have ultimate control over your content, your assets, and your experience.

---

## Our Solution

LittleWorlds solves these problems through **on-chain ownership** and **portable composability**:

### Trust-First Ownership

- Every object and scene is an **ERC-721 NFT** stored on-chain
- Verifiable provenance and ownership history
- No platform can revoke your assets—they're yours forever
- Immutable record of creation and versioning

### Portable Composability

- Assets move seamlessly between rooms, apps, and marketplaces
- Standardized GLB format for 3D objects
- Open metadata standards for interoperability
- Your creations can be used in other Web3 applications

### Gamified Discovery

- Easter eggs and spatial rewards turn exploration into viral distribution
- Hidden collectibles encourage users to explore rooms
- Social discovery mechanisms for finding new content

### Creator-First Economy

- Mint with royalties—earn ongoing income from your creations
- Control distribution while users trade safely
- Fair compensation model for creators
- Decentralized marketplace with no platform fees

---

## How It Works

### 1. **Create**

Users enter the editor and build their 3D room using our library of objects:
- **Furniture**: Beds, sofas, tables, chairs, bookshelves
- **Decor**: Rugs, wall art, mirrors, plants, vases
- **Lighting**: Lamps, fairy lights
- **Electronics**: TVs, computers, clocks
- **Characters**: Human avatars with physics
- **Cute Items**: Plushies, mugs, pillows

### 2. **Customize**

- Position, rotate, and scale objects in 3D space
- Choose room themes and backgrounds
- Adjust lighting and atmosphere
- Add personal touches and style

### 3. **Mint**

When ready, users mint their creation:
- **Object NFTs**: Individual 3D objects (GLB files) stored on IPFS
- **Scene NFTs**: Complete rooms with references to object NFTs
- Metadata includes creator info, version history, and provenance
- All stored on-chain with IPFS for decentralized storage

### 4. **Version**

- Create new versions of your rooms while maintaining parent-child relationships
- Full version history tracked on-chain
- Previous versions remain accessible and tradeable

### 5. **Explore & Trade**

- Browse the marketplace of created rooms
- View rooms in immersive 3D viewer
- Trade objects and scenes as NFTs
- Discover hidden rewards and easter eggs

---

## Key Features

### Rich Object Library
- 30+ pre-built 3D objects across multiple categories
- Voxel-style aesthetic for a cohesive look
- Physics-enabled objects for realistic interactions

### Room Editor
- Intuitive 3D editing interface
- Real-time preview
- Grid-based placement system
- Transform controls (position, rotation, scale)

### On-Chain Provenance
- Complete ownership history
- Version tracking with parent-child relationships
- Creator attribution preserved forever

### NFT Standards
- ERC-721 compliant
- IPFS storage for decentralized file hosting
- Standardized metadata format
- Royalty support for creators

### Web3 Integration
- WalletConnect integration (MetaMask, etc.)
- Base Sepolia testnet support
- Gas-efficient L2 transactions
- OpenSea-compatible metadata

### Discovery & Exploration
- Browse all created rooms
- Search and filter functionality
- Version grouping for easy navigation
- Immersive 3D viewer

---

## Technology Stack

### Frontend
- **React** - UI framework
- **Three.js** - 3D rendering engine
- **React Three Fiber** - React renderer for Three.js
- **Zustand** - State management
- **Vite** - Build tool and dev server
- **Wagmi** - React hooks for Ethereum
- **Ethers.js** - Ethereum library

### Smart Contracts
- **Solidity** - Smart contract language
- **Hardhat** - Development environment
- **OpenZeppelin** - Security-audited contract libraries
- **Base Sepolia** - L2 testnet for deployment

### Storage & Infrastructure
- **IPFS** - Decentralized file storage (via Lighthouse)
- **Lighthouse** - IPFS pinning service
- **Base Sepolia** - Ethereum L2 for low-cost transactions

### 3D Assets
- **GLB/GLTF** - 3D model format
- Custom voxel-style objects
- Procedural room generation

---

## Project Structure

```
myroom/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Room.jsx    # 3D room rendering
│   │   │   ├── Scene.jsx   # Scene management
│   │   │   ├── EditorObject.jsx
│   │   │   └── library/    # Object components
│   │   ├── pages/          # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── EditorPage.jsx
│   │   │   ├── ExplorePage.jsx
│   │   │   └── LittleWorldViewerPage.jsx
│   │   ├── services/       # Business logic
│   │   │   ├── blockchainService.js
│   │   │   └── lighthouseService.js
│   │   ├── store/          # State management
│   │   └── config/         # Configuration files
│   └── public/             # Static assets
│
├── web3/                   # Smart contracts
│   ├── contracts/          # Solidity contracts
│   │   ├── ObjectNFT.sol   # ERC-721 for 3D objects
│   │   ├── SceneNFT.sol    # ERC-721 for scenes
│   │   └── Registry.sol    # Contract registry
│   ├── test/               # Contract tests
│   ├── scripts/            # Deployment scripts
│   └── ignition/           # Hardhat Ignition modules
│
└── README.md              # This file
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm/pnpm
- **MetaMask** or compatible Web3 wallet
- **Base Sepolia** testnet ETH (get from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd myroom
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd client
   npm install
   
   # Install smart contract dependencies
   cd ../web3
   pnpm install
   ```

3. **Configure environment variables**
   
   Create `.env` files in both `client/` and `web3/` directories:
   
   **client/.env:**
   ```env
   VITE_OBJECT_NFT_ADDRESS=0x...
   VITE_SCENE_NFT_ADDRESS=0x...
   VITE_REGISTRY_ADDRESS=0x...
   VITE_LIGHTHOUSE_API_KEY=your_lighthouse_key
   ```
   
   **web3/.env:**
   ```env
   BASE_SEPOLIA_PRIVATE_KEY=your_private_key
   BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
   ```

4. **Deploy smart contracts** (if not already deployed)
   ```bash
   cd web3
   pnpm hardhat ignition deploy ignition/modules/FullDeployment.ts --network baseSepolia
   ```

5. **Start the development server**
   ```bash
   cd client
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Connect your wallet (MetaMask)
   - Switch to Base Sepolia network
   - Start creating!

### Building for Production

```bash
cd client
npm run build
```

The production build will be in `client/dist/`.

---

## Future Goals

### Short-Term (Q1-Q2 2024)

- **Core Editor**: 3D room editor with object library
- **NFT Minting**: On-chain object and scene NFTs
- **Marketplace**: Basic exploration and viewing
- **Mobile Support**: Responsive design for mobile devices
- **Performance Optimization**: Better rendering performance

### Medium-Term (Q3-Q4 2024)

- **Custom Object Import**: Allow users to upload their own GLB files
- **Multiplayer**: Real-time collaborative editing
- **Social Features**: Comments, likes, and sharing
- **Achievements**: Badge system and creator rewards
- **Mobile App**: Native iOS/Android apps

### Long-Term (2025+)

- **Cross-Platform Portability**: Export to other virtual worlds
- **AI Integration**: AI-assisted room generation
- **Events & Experiences**: Host virtual events in rooms
- **Enterprise Tools**: Business solutions for virtual offices
- **Metaverse Bridge**: Connect to major metaverse platforms
- **Education Platform**: Virtual classrooms and learning spaces
- **Advanced Marketplace**: Auctions, bundles, and collections

### Technical Roadmap

- **Layer 2 Migration**: Move to Base mainnet
- **Cross-Chain Support**: Multi-chain compatibility
- **Improved Storage**: Decentralized storage optimization
- **API Development**: Public API for third-party integrations
- **SDK Release**: Developer SDK for building on LittleWorlds

---

## Screenshots

### Landing Page

![Landing Page](https://github.com/user-attachments/assets/10c474c6-5b7a-4a1c-ab7e-d7e3786f8832)

*Welcome to LittleWorlds - Build worlds. Own them truly.*

### Room Editor

<img width="1710" height="853" alt="Screenshot 2025-12-01 at 12 08 02" src="https://github.com/user-attachments/assets/232ce2c4-1b40-420a-80c2-e411bf293e24" />

*Create and customize your 3D rooms with our intuitive editor*

### Object Library

<img width="305" height="768" alt="Screenshot 2025-12-01 at 12 10 01" src="https://github.com/user-attachments/assets/0c803bb8-8ff4-4318-bc83-8c0f16b9f25f" />

*Browse through furniture, decor, lighting, and more*

### Explore Marketplace

<img width="1710" height="855" alt="Screenshot 2025-12-01 at 12 09 02" src="https://github.com/user-attachments/assets/14390d6e-8df3-4ef8-8aad-7ad23377ca0a" />

*Discover rooms created by the community*

---

## Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
5. **Push to the branch** (`git push origin feature/amazing-feature`)
6. **Open a Pull Request**

### Areas for Contribution

- Bug fixes
- New features
- Documentation improvements
- UI/UX enhancements
- Test coverage
- Translations
- New 3D objects for the library

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Acknowledgments

- **Three.js** community for amazing 3D tools
- **OpenZeppelin** for secure smart contract libraries
- **Base** for affordable L2 infrastructure
- **IPFS** for decentralized storage
- All our early users and contributors

---

## Contact & Links

- **Website**: [LW](https://littleheaven.vercel.app/)
- **Twitter**: [Coming Soon]

---

## Disclaimer

LittleWorlds is currently in **beta** and deployed on **Base Sepolia testnet**. This is experimental software—use at your own risk. Always verify smart contracts before interacting with them.

---

**Built for the decentralized future of virtual worlds.**

