import { ethers } from "hardhat";

async function main() {
  const baseURI = "https://your-metadata-server.com/metadata/"; // Replace with your metadata server

  const ScottNFT = await ethers.getContractFactory("ScottNFT");
  const nft = await ScottNFT.deploy(baseURI);
  await nft.waitForDeployment();

  console.log(`ScottNFT deployed to: ${await nft.getAddress()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 