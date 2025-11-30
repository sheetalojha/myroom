import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Registry", function () {
  let registry: any;
  let owner: any;
  let user: any;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    registry = await ethers.deployContract("Registry");
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await registry.owner()).to.equal(owner.address);
    });

    it("Should initialize default approved types", async function () {
      expect(await registry.isObjectTypeApproved("furniture")).to.be.true;
      expect(await registry.isObjectTypeApproved("decor")).to.be.true;
      expect(await registry.isObjectTypeApproved("lighting")).to.be.true;
      expect(await registry.isObjectTypeApproved("cute")).to.be.true;
    });

    it("Should initialize default approved categories", async function () {
      expect(await registry.isCategoryApproved("bed")).to.be.true;
      expect(await registry.isCategoryApproved("chair")).to.be.true;
      expect(await registry.isCategoryApproved("lamp")).to.be.true;
    });

    it("Should initialize with zero minted counts", async function () {
      const [objects, scenes] = await registry.getGlobalStats();
      expect(objects).to.equal(0n);
      expect(scenes).to.equal(0n);
    });
  });

  describe("Registering Contracts", function () {
    it("Should allow owner to register ObjectNFT", async function () {
      const objectNFT = await ethers.deployContract("ObjectNFT");
      await expect(registry.registerObjectNFT(await objectNFT.getAddress()))
        .to.emit(registry, "ObjectNFTRegistered")
        .withArgs(await objectNFT.getAddress());
      
      expect(await registry.objectNFTAddress()).to.equal(await objectNFT.getAddress());
    });

    it("Should allow owner to register SceneNFT", async function () {
      const sceneNFT = await ethers.deployContract("SceneNFT");
      await expect(registry.registerSceneNFT(await sceneNFT.getAddress()))
        .to.emit(registry, "SceneNFTRegistered")
        .withArgs(await sceneNFT.getAddress());
      
      expect(await registry.sceneNFTAddress()).to.equal(await sceneNFT.getAddress());
    });

    it("Should not allow non-owner to register contracts", async function () {
      const objectNFT = await ethers.deployContract("ObjectNFT");
      await expect(
        registry.connect(user).registerObjectNFT(await objectNFT.getAddress())
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should not allow zero address registration", async function () {
      await expect(
        registry.registerObjectNFT(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid address");
    });
  });

  describe("Approving Types and Categories", function () {
    it("Should allow owner to approve object types", async function () {
      const newTypes = ["custom_type_1", "custom_type_2"];
      await expect(registry.approveObjectTypes(newTypes))
        .to.emit(registry, "ObjectTypesApproved")
        .withArgs(newTypes);
      
      expect(await registry.isObjectTypeApproved("custom_type_1")).to.be.true;
      expect(await registry.isObjectTypeApproved("custom_type_2")).to.be.true;
    });

    it("Should allow owner to approve categories", async function () {
      const newCategories = ["custom_category_1", "custom_category_2"];
      await expect(registry.approveCategories(newCategories))
        .to.emit(registry, "CategoriesApproved")
        .withArgs(newCategories);
      
      expect(await registry.isCategoryApproved("custom_category_1")).to.be.true;
      expect(await registry.isCategoryApproved("custom_category_2")).to.be.true;
    });

    it("Should not allow non-owner to approve types", async function () {
      await expect(
        registry.connect(user).approveObjectTypes(["test"])
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Recording Mints", function () {
    it("Should allow ObjectNFT contract to record mints", async function () {
      const objectNFT = await ethers.deployContract("ObjectNFT");
      const objectNFTAddress = await objectNFT.getAddress();
      await registry.registerObjectNFT(objectNFTAddress);
      
      // We need to impersonate the ObjectNFT contract address and fund it
      await ethers.provider.send("hardhat_impersonateAccount", [objectNFTAddress]);
      await ethers.provider.send("hardhat_setBalance", [
        objectNFTAddress,
        "0x1000000000000000000", // 1 ETH
      ]);
      const objectNFTSigner = await ethers.getSigner(objectNFTAddress);
      const registryConnected = registry.connect(objectNFTSigner);
      
      await expect(
        registryConnected.recordObjectMint(user.address, 1n)
      )
        .to.emit(registry, "ObjectMintedGlobal")
        .withArgs(user.address, 1n);
      
      const [objects, scenes] = await registry.getGlobalStats();
      expect(objects).to.equal(1n);
      expect(scenes).to.equal(0n);
      
      await ethers.provider.send("hardhat_stopImpersonatingAccount", [objectNFTAddress]);
    });

    it("Should allow owner to record object mints", async function () {
      await expect(
        registry.recordObjectMint(user.address, 1n)
      )
        .to.emit(registry, "ObjectMintedGlobal")
        .withArgs(user.address, 1n);
      
      const [objects] = await registry.getGlobalStats();
      expect(objects).to.equal(1n);
    });

    it("Should allow SceneNFT contract to record mints", async function () {
      const sceneNFT = await ethers.deployContract("SceneNFT");
      const sceneNFTAddress = await sceneNFT.getAddress();
      await registry.registerSceneNFT(sceneNFTAddress);
      
      // Impersonate the SceneNFT contract address and fund it
      await ethers.provider.send("hardhat_impersonateAccount", [sceneNFTAddress]);
      await ethers.provider.send("hardhat_setBalance", [
        sceneNFTAddress,
        "0x1000000000000000000", // 1 ETH
      ]);
      const sceneNFTSigner = await ethers.getSigner(sceneNFTAddress);
      const registryConnected = registry.connect(sceneNFTSigner);
      
      await expect(
        registryConnected.recordSceneMint(user.address, 1n)
      )
        .to.emit(registry, "SceneMintedGlobal")
        .withArgs(user.address, 1n);
      
      const [objects, scenes] = await registry.getGlobalStats();
      expect(objects).to.equal(0n);
      expect(scenes).to.equal(1n);
      
      await ethers.provider.send("hardhat_stopImpersonatingAccount", [sceneNFTAddress]);
    });

    it("Should not allow unauthorized addresses to record mints", async function () {
      await expect(
        registry.connect(user).recordObjectMint(user.address, 1n)
      ).to.be.revertedWith("Not authorized");
    });
  });
});

