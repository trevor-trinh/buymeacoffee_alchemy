const hre = require('hardhat');

// Returns the Ether balance of a given address.
async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

// Logs the memos stored on-chain from coffee purchases.
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(
      `At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`
    );
  }
}

async function main() {
  // Get sample accounts
  const [owner, tipper1, tipper2, tipper3] = await hre.ethers.getSigners();

  // Get contract and deploy
  const BuyMeACoffee = await hre.ethers.getContractFactory('BuyMeACoffee');
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log('BuyMeACoffee deployed at: ', buyMeACoffee.address);

  // Check balances before coffee purchase
  const addresses = [owner.address, tipper1.address, buyMeACoffee.address];
  console.log('== start ==');
  await printBalances(addresses);

  // Buy owner some coffee
  const tip = { value: hre.ethers.utils.parseEther('1') };
  await buyMeACoffee.connect(tipper1).buyCoffee('Albert', 'Gm!', tip);
  await buyMeACoffee.connect(tipper1).buyCoffee('Maya', 'meow food >.<', tip);
  await buyMeACoffee.connect(tipper1).buyCoffee('Tommy', '🦍🦍🦍', tip);

  // Check balances after coffee purchase
  console.log('== bought coffee ==');
  await printBalances(addresses);

  // Withdraw contract funds to owner
  await buyMeACoffee.connect(owner).withdrawTips();

  // Check owner balance after withdraw
  console.log('== withdraw tips ==');
  await printBalances(addresses);

  // Read all memos recorded
  console.log('== memos ==');
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
