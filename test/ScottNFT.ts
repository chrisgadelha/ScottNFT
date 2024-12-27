import { expect } from "chai";
import { ethers } from "hardhat";
import { ScottNFT } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("ScottNFT", function () {
  let nft: ScottNFT;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  const BASE_URI = "https://test-uri.com/metadata/";

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const ScottNFT = await ethers.getContractFactory("ScottNFT");
    nft = await ScottNFT.deploy(BASE_URI);
    await nft.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await nft.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint NFTs", async function () {
      await nft.safeMint(addr1.address, "1");
      expect(await nft.ownerOf(0)).to.equal(addr1.address);
    });

    it("Should not allow non-owner to mint NFTs", async function () {
      await expect(
        nft.connect(addr1).safeMint(addr1.address, "1")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("URI Functionality", function () {
    it("Should return correct token URI", async function () {
      await nft.safeMint(addr1.address, "1");
      expect(await nft.tokenURI(0)).to.equal(BASE_URI + "1");
    });

    it("Should allow owner to set base URI", async function () {
      const newBaseURI = "https://new-uri.com/metadata/";
      await nft.setBaseURI(newBaseURI);
      await nft.safeMint(addr1.address, "1");
      expect(await nft.tokenURI(0)).to.equal(newBaseURI + "1");
    });
  });
}); 