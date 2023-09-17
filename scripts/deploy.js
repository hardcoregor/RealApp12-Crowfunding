const hre = require("hardhat");
const { ethers } = hre;
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function main() {
  const hhprovider = new ethers.JsonRpcProvider("https://rpc.ankr.com/eth_goerli");
  const signer = new ethers.Wallet(PRIVATE_KEY, hhprovider);
  const Crowfunding = await ethers.getContractFactory("Crowfunding", signer);
  const crowfunding = await Crowfunding.deploy();

  console.log(`deployed to ${crowfunding.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
