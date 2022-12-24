require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

const GORELI_URL = process.env.GORELI_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.17',
  networks: {
    goreli: {
      url: GORELI_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};
