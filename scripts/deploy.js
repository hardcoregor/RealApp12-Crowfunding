const hre = require("hardhat");

async function main() {
  const crowdfunding = await hre.ethers.deployContract("Crowdfunding");

  await crowdfunding.waitForDeployment();

  console.log(`deployed to ${crowdfunding.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
