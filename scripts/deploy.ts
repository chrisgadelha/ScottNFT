import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const ScottNFT = await ethers.getContractFactory("ScottNFT");
  const scottNFT = await ScottNFT.deploy();

  await scottNFT.waitForDeployment();
  const contractAddress = await scottNFT.getAddress();

  console.log("ScottNFT deployed to:", contractAddress);
  console.log("Deployment completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 