import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("SceneNFT", function () {
  let sceneNFT: any;
  let objectNFT: any;
  let owner: any;
  let user: any;
  let recipient: any;

  beforeEach(async function () {
    [owner, user, recipient] = await ethers.getSigners();
    sceneNFT = await ethers.deployContract("SceneNFT");
    objectNFT = await ethers.deployContract("ObjectNFT");
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await sceneNFT.name()).to.equal("Chambers");
      expect(await sceneNFT.symbol()).to.equal("CHMBR");
    });

    it("Should set the right owner", async function () {
      expect(await sceneNFT.owner()).to.equal(owner.address);
    });

    it("Should start with zero total supply", async function () {
      expect(await sceneNFT.totalSupply()).to.equal(0n);
    });
  });

  describe("Minting", function () {
    const sceneCID = "QmScene123";
    const metadataCID = "QmMetadata123";
    const thumbnailCID = "QmThumbnail123";
    const sceneName = "My Awesome Room";
    let objectTokenIds: bigint[];

    beforeEach(async function () {
      // Mint some objects first
      await objectNFT.mintObject(
        owner.address,
        "QmObject1",
        "QmMeta1",
        "furniture",
        "chair"
      );
      await objectNFT.mintObject(
        owner.address,
        "QmObject2",
        "QmMeta2",
        "decor",
        "rug"
      );
      objectTokenIds = [0n, 1n];
    });

    it("Should mint a new scene NFT", async function () {
      const tx = await sceneNFT.mintScene(
        recipient.address,
        sceneCID,
        metadataCID,
        thumbnailCID,
        sceneName,
        objectTokenIds,
        true // remixable
      );

      await expect(tx)
        .to.emit(sceneNFT, "SceneMinted")
        .withArgs(0n, owner.address, sceneCID, sceneName, 2n);

      expect(await sceneNFT.ownerOf(0n)).to.equal(recipient.address);
      expect(await sceneNFT.totalSupply()).to.equal(1n);
    });

    it("Should set correct metadata", async function () {
      await sceneNFT.mintScene(
        recipient.address,
        sceneCID,
        metadataCID,
        thumbnailCID,
        sceneName,
        objectTokenIds,
        true // remixable
      );

      const metadata = await sceneNFT.getSceneMetadata(0n);
      expect(metadata.sceneCID).to.equal(sceneCID);
      expect(metadata.metadataCID).to.equal(metadataCID);
      expect(metadata.thumbnailCID).to.equal(thumbnailCID);
      expect(metadata.name).to.equal(sceneName);
      expect(metadata.version).to.equal(1n);
      expect(metadata.creator).to.equal(owner.address);
      expect(metadata.parentTokenId).to.equal(0n);
    });

    it("Should store object token IDs", async function () {
      await sceneNFT.mintScene(
        recipient.address,
        sceneCID,
        metadataCID,
        thumbnailCID,
        sceneName,
        objectTokenIds,
        true // remixable
      );

      const storedObjects = await sceneNFT.getSceneObjects(0n);
      expect(storedObjects.length).to.equal(2);
      expect(storedObjects[0]).to.equal(0n);
      expect(storedObjects[1]).to.equal(1n);
    });

    it("Should set correct token URI", async function () {
      await sceneNFT.mintScene(
        recipient.address,
        sceneCID,
        metadataCID,
        thumbnailCID,
        sceneName,
        objectTokenIds,
        true // remixable
      );

      const tokenURI = await sceneNFT.tokenURI(0n);
      expect(tokenURI).to.equal(`ipfs://${metadataCID}`);
    });

    it("Should track creator tokens", async function () {
      await sceneNFT.mintScene(
        recipient.address,
        sceneCID,
        metadataCID,
        thumbnailCID,
        sceneName,
        objectTokenIds,
        true // remixable
      );

      const creatorTokens = await sceneNFT.getCreatorTokens(owner.address);
      expect(creatorTokens.length).to.equal(1);
      expect(creatorTokens[0]).to.equal(0n);
    });

    it("Should allow empty object array", async function () {
      await sceneNFT.mintScene(
        recipient.address,
        sceneCID,
        metadataCID,
        thumbnailCID,
        sceneName,
        [],
        true // remixable
      );

      const storedObjects = await sceneNFT.getSceneObjects(0n);
      expect(storedObjects.length).to.equal(0);
    });
  });

  describe("Versioning", function () {
    const sceneCID = "QmScene123";
    const metadataCID = "QmMetadata123";
    const thumbnailCID = "QmThumbnail123";
    const sceneName = "My Awesome Room";
    const newSceneCID = "QmNewScene123";
    const newMetadataCID = "QmNewMetadata123";
    const newThumbnailCID = "QmNewThumbnail123";
    let objectTokenIds: bigint[];
    let newObjectTokenIds: bigint[];

    beforeEach(async function () {
      // Mint objects
      await objectNFT.mintObject(owner.address, "QmObject1", "QmMeta1", "furniture", "chair");
      await objectNFT.mintObject(owner.address, "QmObject2", "QmMeta2", "decor", "rug");
      await objectNFT.mintObject(owner.address, "QmObject3", "QmMeta3", "lighting", "lamp");
      
      objectTokenIds = [0n, 1n];
      newObjectTokenIds = [0n, 1n, 2n];

      // Mint initial scene
      await sceneNFT.mintScene(
        recipient.address,
        sceneCID,
        metadataCID,
        thumbnailCID,
        sceneName,
        objectTokenIds,
        true // remixable
      );
    });

    it("Should allow owner to create a version", async function () {
      // Transfer token to user so they can version it
      await sceneNFT.connect(recipient).transferFrom(recipient.address, user.address, 0n);

      const tx = await sceneNFT.connect(user).createVersion(
        0n,
        newSceneCID,
        newMetadataCID,
        newThumbnailCID,
        newObjectTokenIds,
        true // remixable
      );

      await expect(tx)
        .to.emit(sceneNFT, "SceneVersioned")
        .withArgs(1n, 0n, user.address, 2n);

      const newMetadata = await sceneNFT.getSceneMetadata(1n);
      expect(newMetadata.sceneCID).to.equal(newSceneCID);
      expect(newMetadata.metadataCID).to.equal(newMetadataCID);
      expect(newMetadata.thumbnailCID).to.equal(newThumbnailCID);
      expect(newMetadata.version).to.equal(2n);
      expect(newMetadata.parentTokenId).to.equal(0n);
      expect(newMetadata.name).to.equal(sceneName);
      expect(newMetadata.creator).to.equal(owner.address);
    });

    it("Should update object token IDs in version", async function () {
      await sceneNFT.connect(recipient).transferFrom(recipient.address, user.address, 0n);
      
      await sceneNFT.connect(user).createVersion(
        0n,
        newSceneCID,
        newMetadataCID,
        newThumbnailCID,
        newObjectTokenIds,
        true // remixable
      );

      const storedObjects = await sceneNFT.getSceneObjects(1n);
      expect(storedObjects.length).to.equal(3);
      expect(storedObjects[0]).to.equal(0n);
      expect(storedObjects[1]).to.equal(1n);
      expect(storedObjects[2]).to.equal(2n);
    });

    it("Should not allow non-owner to create version", async function () {
      await expect(
        sceneNFT.connect(user).createVersion(
          0n,
          newSceneCID,
          newMetadataCID,
          newThumbnailCID,
          newObjectTokenIds,
          true // remixable
        )
      ).to.be.revertedWith("Not the owner of parent token");
    });

    it("Should increment version number", async function () {
      await sceneNFT.connect(recipient).transferFrom(recipient.address, user.address, 0n);
      
      await sceneNFT.connect(user).createVersion(0n, newSceneCID, newMetadataCID, newThumbnailCID, newObjectTokenIds, true);
      const version1 = await sceneNFT.getSceneMetadata(1n);
      expect(version1.version).to.equal(2n);

      await sceneNFT.connect(user).createVersion(1n, newSceneCID, newMetadataCID, newThumbnailCID, newObjectTokenIds, true);
      const version2 = await sceneNFT.getSceneMetadata(2n);
      expect(version2.version).to.equal(3n);
      expect(version2.parentTokenId).to.equal(1n);
    });
  });

  describe("Burnable", function () {
    const sceneCID = "QmScene123";
    const metadataCID = "QmMetadata123";
    const thumbnailCID = "QmThumbnail123";
    const sceneName = "My Awesome Room";

    it("Should allow owner to burn token", async function () {
      await sceneNFT.mintScene(recipient.address, sceneCID, metadataCID, thumbnailCID, sceneName, [], true);
      expect(await sceneNFT.ownerOf(0n)).to.equal(recipient.address);
      
      await sceneNFT.connect(recipient).burn(0n);
      
      // Verify token no longer exists by checking ownerOf throws
      let reverted = false;
      try {
        await sceneNFT.ownerOf(0n);
      } catch (error) {
        reverted = true;
      }
      expect(reverted).to.be.true;
    });
  });

  describe("Remixing", function () {
    const sceneCID = "QmScene123";
    const metadataCID = "QmMetadata123";
    const thumbnailCID = "QmThumbnail123";
    const sceneName = "My Awesome Room";
    const remixSceneCID = "QmRemixScene123";
    const remixMetadataCID = "QmRemixMetadata123";
    const remixThumbnailCID = "QmRemixThumbnail123";
    const remixName = "My Remixed Room";
    let objectTokenIds: bigint[];

    beforeEach(async function () {
      // Mint objects
      await objectNFT.mintObject(owner.address, "QmObject1", "QmMeta1", "furniture", "chair");
      objectTokenIds = [0n];

      // Mint remixable scene
      await sceneNFT.mintScene(
        recipient.address,
        sceneCID,
        metadataCID,
        thumbnailCID,
        sceneName,
        objectTokenIds,
        true // remixable
      );
    });

    it("Should allow remixing a remixable scene", async function () {
      const tx = await sceneNFT.connect(user).remixScene(
        0n,
        remixSceneCID,
        remixMetadataCID,
        remixThumbnailCID,
        remixName,
        objectTokenIds,
        false // remixable for remix
      );

      await expect(tx)
        .to.emit(sceneNFT, "SceneRemixed")
        .withArgs(1n, 0n, user.address, owner.address);

      const remixMetadata = await sceneNFT.getSceneMetadata(1n);
      expect(remixMetadata.sceneCID).to.equal(remixSceneCID);
      expect(remixMetadata.name).to.equal(remixName);
      expect(remixMetadata.creator).to.equal(user.address);
      expect(remixMetadata.parentTokenId).to.equal(0n);
      expect(remixMetadata.remixable).to.equal(false);
    });

    it("Should not allow remixing a non-remixable scene", async function () {
      // Mint a non-remixable scene
      await sceneNFT.mintScene(
        recipient.address,
        sceneCID,
        metadataCID,
        thumbnailCID,
        "Non-remixable Room",
        objectTokenIds,
        false // not remixable
      );

      await expect(
        sceneNFT.connect(user).remixScene(
          1n,
          remixSceneCID,
          remixMetadataCID,
          remixThumbnailCID,
          remixName,
          objectTokenIds,
          true
        )
      ).to.be.revertedWith("Scene is not remixable");
    });

    it("Should set remixable flag correctly", async function () {
      await sceneNFT.mintScene(
        recipient.address,
        sceneCID,
        metadataCID,
        thumbnailCID,
        sceneName,
        objectTokenIds,
        true // remixable
      );

      const metadata = await sceneNFT.getSceneMetadata(0n);
      expect(metadata.remixable).to.equal(true);

      await sceneNFT.mintScene(
        recipient.address,
        sceneCID,
        metadataCID,
        thumbnailCID,
        sceneName,
        objectTokenIds,
        false // not remixable
      );

      const metadata2 = await sceneNFT.getSceneMetadata(2n);
      expect(metadata2.remixable).to.equal(false);
    });
  });
});

