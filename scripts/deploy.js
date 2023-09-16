const hre = require("hardhat");

async function main() {
  const privKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const hhprovider = new ethers.providers.JsonRpcProvider("HTTP://127.0.0.1:8545");
  const signer = new ethers.Wallet(privKey.toString('Hex'), hhprovider);
  const Crowfunding = await ethers.getContractFactory("Crowfunding", signer);
  const crowfunding = await Crowfunding.deploy();

  console.log(`deployed to ${crowfunding.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
