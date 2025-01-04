import { expect } from "chai";
import { ethers } from "hardhat";
import { ScottNFT } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("ScottNFT", function () {
  let nft: ScottNFT;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  const MAX_SUPPLY = 1000;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const ScottNFT = await ethers.getContractFactory("ScottNFT");
    nft = await ScottNFT.deploy();
    await nft.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await nft.owner()).to.equal(owner.address);
    });

    it("Should set the correct max supply", async function () {
      expect(await nft.MAX_SUPPLY()).to.equal(MAX_SUPPLY);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint NFTs", async function () {
      await nft.safeMint(1);
      expect(await nft.ownerOf(0)).to.equal(owner.address);
    });

    it("Should emit NFTMinted event", async function () {
      await expect(nft.safeMint(1))
        .to.emit(nft, "NFTMinted")
        .withArgs(owner.address, 1);
    });

    it("Should not allow non-owner to mint NFTs", async function () {
      await expect(
        nft.connect(addr1).safeMint(1)
      ).to.be.reverted;
    });

    it("Should not allow minting zero quantity", async function () {
      await expect(
        nft.safeMint(0)
      ).to.be.revertedWith("Quantity must be greater than 0");
    });

    it("Should not allow minting more than max supply", async function () {
      await expect(
        nft.safeMint(MAX_SUPPLY + 1)
      ).to.be.revertedWith("Would exceed max supply");
    });

    it("Should track total supply correctly", async function () {
      await nft.safeMint(5);
      expect(await nft.totalSupply()).to.equal(5);
    });
  });

  describe("URI Functionality", function () {
    const BASE_URI = "ipfs://Qmc7p1nVDaaJ7ZSqji4bwtKn65Mm76TPE5kYXhH1uuxe2A";

    it("Should return correct token URI", async function () {
      await nft.safeMint(1);
      expect(await nft.tokenURI(0)).to.equal(BASE_URI);
    });

    it("Should revert for non-existent token", async function () {
      await expect(
        nft.tokenURI(0)
      ).to.be.revertedWith("Token does not exist");
    });
  });

  describe("Batch Minting", function () {
    it("Should allow minting multiple tokens", async function () {
      await nft.safeMint(5);
      expect(await nft.totalSupply()).to.equal(5);
      for (let i = 0; i < 5; i++) {
        expect(await nft.ownerOf(i)).to.equal(owner.address);
      }
    });

    it("Should handle consecutive mints correctly", async function () {
      await nft.safeMint(3);
      await nft.safeMint(2);
      expect(await nft.totalSupply()).to.equal(5);
      for (let i = 0; i < 5; i++) {
        expect(await nft.ownerOf(i)).to.equal(owner.address);
      }
    });
  });
}); 