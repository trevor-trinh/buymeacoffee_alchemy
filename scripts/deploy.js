const hre = require('hardhat');

async function main() {
  // Get contract and deploy
  const BuyMeACoffee = await hre.ethers.getContractFactory('BuyMeACoffee');
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log('BuyMeACoffee deployed at: ', buyMeACoffee.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
