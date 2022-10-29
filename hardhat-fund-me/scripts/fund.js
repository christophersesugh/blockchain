const { getNamedAccounts, ethers } = require("hardhat");

const sendValue = ethers.utils.parseEther("0.1");
async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log("Funding...");
  const transactionResponse = await fundMe.fund({ value: sendValue });
  await transactionResponse.wait(1);
  console.log("Funded!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
