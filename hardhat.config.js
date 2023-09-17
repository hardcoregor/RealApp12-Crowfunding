require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  networks: {
    goerli: {
      url: "https://rpc.ankr.com/eth_goerli", 
    },
  },
  solidity: "0.8.19",
};
