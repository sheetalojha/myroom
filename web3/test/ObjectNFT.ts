import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("ObjectNFT", function () {
  let objectNFT: any;
  let owner: any;
  let user: any;
  let recipient: any;

  beforeEach(async function () {
    [owner, user, recipient] = await ethers.getSigners();
    objectNFT = await ethers.deployContract("ObjectNFT");
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await objectNFT.name()).to.equal("Life Object NFT");
      expect(await objectNFT.symbol()).to.equal("LOBJ");
    });

    it("Should set the right owner", async function () {
      expect(await objectNFT.owner()).to.equal(owner.address);
    });

    it("Should start with zero total supply", async function () {
      expect(await objectNFT.totalSupply()).to.equal(0n);
    });
  });

  describe("Minting", function () {
    const ipfsCID = "QmTest123";
    const metadataCID = "QmMetadata123";
    const objectType = "furniture";
    const category = "chair";

    it("Should mint a new object NFT", async function () {
      const tx = await objectNFT.mintObject(
        recipient.address,
        ipfsCID,
        metadataCID,
        objectType,
        category
      );

      await expect(tx)
        .to.emit(objectNFT, "ObjectMinted")
        .withArgs(0n, owner.address, ipfsCID, objectType, category);

      expect(await objectNFT.ownerOf(0n)).to.equal(recipient.address);
      expect(await objectNFT.totalSupply()).to.equal(1n);
    });

    it("Should set correct metadata", async function () {
      await objectNFT.mintObject(
        recipient.address,
        ipfsCID,
        metadataCID,
        objectType,
        category
      );

      const metadata = await objectNFT.getObjectMetadata(0n);
      expect(metadata.ipfsCID).to.equal(ipfsCID);
      expect(metadata.metadataCID).to.equal(metadataCID);
      expect(metadata.objectType).to.equal(objectType);
      expect(metadata.category).to.equal(category);
      expect(metadata.version).to.equal(1n);
      expect(metadata.creator).to.equal(owner.address);
      expect(metadata.parentTokenId).to.equal(0n);
    });

    it("Should set correct token URI", async function () {
      await objectNFT.mintObject(
        recipient.address,
        ipfsCID,
        metadataCID,
        objectType,
        category
      );

      const tokenURI = await objectNFT.tokenURI(0n);
      expect(tokenURI).to.equal(`ipfs://${metadataCID}`);
    });

    it("Should track creator tokens", async function () {
      await objectNFT.mintObject(
        recipient.address,
        ipfsCID,
        metadataCID,
        objectType,
        category
      );

      const creatorTokens = await objectNFT.getCreatorTokens(owner.address);
      expect(creatorTokens.length).to.equal(1);
      expect(creatorTokens[0]).to.equal(0n);
    });

    it("Should increment token IDs", async function () {
      await objectNFT.mintObject(recipient.address, ipfsCID, metadataCID, objectType, category);
      await objectNFT.mintObject(recipient.address, ipfsCID, metadataCID, objectType, category);

      expect(await objectNFT.totalSupply()).to.equal(2n);
      expect(await objectNFT.ownerOf(0n)).to.equal(recipient.address);
      expect(await objectNFT.ownerOf(1n)).to.equal(recipient.address);
    });
  });

  describe("Versioning", function () {
    const ipfsCID = "QmTest123";
    const metadataCID = "QmMetadata123";
    const newIpfsCID = "QmNew123";
    const newMetadataCID = "QmNewMetadata123";
    const objectType = "furniture";
    const category = "chair";

    beforeEach(async function () {
      await objectNFT.mintObject(
        recipient.address,
        ipfsCID,
        metadataCID,
        objectType,
        category
      );
    });

    it("Should allow owner to create a version", async function () {
      // Transfer token to user so they can version it
      await objectNFT.connect(recipient).transferFrom(recipient.address, user.address, 0n);

      const tx = await objectNFT.connect(user).createVersion(
        0n,
        newIpfsCID,
        newMetadataCID
      );

      await expect(tx)
        .to.emit(objectNFT, "ObjectVersioned")
        .withArgs(1n, 0n, user.address, 2n);

      const newMetadata = await objectNFT.getObjectMetadata(1n);
      expect(newMetadata.ipfsCID).to.equal(newIpfsCID);
      expect(newMetadata.metadataCID).to.equal(newMetadataCID);
      expect(newMetadata.version).to.equal(2n);
      expect(newMetadata.parentTokenId).to.equal(0n);
      expect(newMetadata.objectType).to.equal(objectType);
      expect(newMetadata.category).to.equal(category);
      expect(newMetadata.creator).to.equal(owner.address);
    });

    it("Should not allow non-owner to create version", async function () {
      await expect(
        objectNFT.connect(user).createVersion(0n, newIpfsCID, newMetadataCID)
      ).to.be.revertedWith("Not the owner of parent token");
    });

    it("Should increment version number", async function () {
      await objectNFT.connect(recipient).transferFrom(recipient.address, user.address, 0n);
      
      await objectNFT.connect(user).createVersion(0n, newIpfsCID, newMetadataCID);
      const version1 = await objectNFT.getObjectMetadata(1n);
      expect(version1.version).to.equal(2n);

      await objectNFT.connect(user).createVersion(1n, newIpfsCID, newMetadataCID);
      const version2 = await objectNFT.getObjectMetadata(2n);
      expect(version2.version).to.equal(3n);
      expect(version2.parentTokenId).to.equal(1n);
    });
  });

  describe("Burnable", function () {
    const ipfsCID = "QmTest123";
    const metadataCID = "QmMetadata123";
    const objectType = "furniture";
    const category = "chair";

    it("Should allow owner to burn token", async function () {
      await objectNFT.mintObject(recipient.address, ipfsCID, metadataCID, objectType, category);
      expect(await objectNFT.ownerOf(0n)).to.equal(recipient.address);
      
      await objectNFT.connect(recipient).burn(0n);
      
      // Verify token no longer exists by checking ownerOf throws
      let reverted = false;
      try {
        await objectNFT.ownerOf(0n);
      } catch (error) {
        reverted = true;
      }
      expect(reverted).to.be.true;
    });
  });
});

