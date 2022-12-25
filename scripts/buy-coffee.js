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
    console.log(
      `${idx == 0 ? 'Contract' : 'Address ' + idx} balance: `,
      await getBalance(address)
    );
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
  const [tipperTrevor, tipperAlbert, tipperMaya, tipperTommy] =
    await hre.ethers.getSigners();

  // Get contract and deploy
  const BuyMeACoffee = await hre.ethers.getContractFactory('BuyMeACoffee');
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log('BuyMeACoffee deployed at: ', buyMeACoffee.address);

  // Check balances before coffee purchase
  const addresses = [
    buyMeACoffee.address,
    tipperTrevor.address,
    tipperAlbert.address,
    tipperMaya.address,
    tipperTommy.address,
  ];
  console.log('== start ==');
  await printBalances(addresses);

  // Buy owner some coffee
  const tip = { value: hre.ethers.utils.parseEther('1') };
  await buyMeACoffee.connect(tipperAlbert).buyCoffee('Albert', 'Gm!', tip);
  await buyMeACoffee.connect(tipperTommy).buyCoffee('Tommy', '🦍🦍🦍', tip);
  await buyMeACoffee
    .connect(tipperMaya)
    .buyCoffee('Maya', 'meow food >.<', tip);

  // Check balances after coffee purchase
  console.log('\n== bought coffee ==');
  await printBalances(addresses);

  // Withdraw contract funds to owner
  await buyMeACoffee.connect(tipperTrevor).withdrawTips();

  // Check owner balance after withdraw
  console.log('\n== withdraw tips ==');
  await printBalances(addresses);

  // Read all memos recorded
  console.log('\n== memos ==');
  let memos = await buyMeACoffee.getMemos();
  printMemos(memos);

  // Change owner and tip
  console.log('\n== change ownership and tip ==');
  await buyMeACoffee.connect(tipperTrevor).changeOwner(tipperMaya.address);
  await buyMeACoffee
    .connect(tipperTrevor)
    .buyCoffee('Trevor', '学姐', { value: hre.ethers.utils.parseEther('3') });
  await printBalances(addresses);

  // Withdraw to new owner
  console.log('\n== new owner withdraw ==');
  await buyMeACoffee.connect(tipperMaya).withdrawTips();
  await printBalances(addresses);

  // Read all memos
  console.log('\n== memos ==');
  memos = await buyMeACoffee.getMemos();
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
