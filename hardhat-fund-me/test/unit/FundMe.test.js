const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
describe("FundMe", async function() {
  let fundMe, deployer, mockV3Aggregator;
  const sendValue = ethers.utils.parseEther("1");
  beforeEach(async function() {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    fundMe = await ethers.getContract("FundMe", deployer);
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });

  describe("constructor", async function() {
    it("sets the aggregator addresses correctly", async function() {
      const response = await fundMe.priceFeed();
      assert.equal(response, mockV3Aggregator.address);
    });
  });

  describe("fund", async function() {
    it("it fails if you don't send enough ETH", async function() {
      await expect(fundMe.fund()).to.be.revertedWith(
        "Didn't send enough funds"
      );
    });

    it("updated the amount funded data structure", async function() {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.addressToAmountFunded(deployer);
      assert.equal(response.toString(), sendValue.toString());
    });

    it("add funder to array of funders", async function() {
      await fundMe.fund({ value: sendValue });
      const funder = await fundMe.funders(0);
      assert.equal(funder, deployer);
    });
  });

  describe("withdraw", async function() {
    beforeEach(async function() {
      await fundMe.fund({ value: sendValue });
    });

    it("withdraw ETH from a single funder", async function() {
      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );

      const startingDeployerBalance = await fundMe.provider.getBalance(
        deployer
      );

      const trasanctionResponse = await fundMe.withdraw();
      const transactionReceipt = await trasanctionResponse.wait(1);
      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);

      const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const endingDeployerBalance = await fundMe.deployer.getBalance(deployer);

      assert.equal(endingFundMeBalance, 0);
      assert.equal(
        startingFundMeBalance.add(startingDeployerBalance),
        endingDeployerBalance.add(gasCost).toString()
      );
    });

    it("allow us to withdraw with multiple funders", async function() {
      //Arrange
      const accounts = await ethers.getSigners();
      for (let i = 1; i < accounts.length; i++) {
        const fundMeConnectedContract = await fundMe.conntect(accounts[i]);
        await fundMeConnectedContract.fund({ value: sendValue });
      }

      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );

      const startingDeployerBalance = await fundMe.provider.getBalance(
        deployer
      );

      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);
      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);
      const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const endingDeployerBalance = await fundMe.deployer.getBalance(deployer);

      assert.equal(endingFundMeBalance, 0);
      assert.equal(
        startingFundMeBalance.add(startingDeployerBalance),
        endingDeployerBalance.add(gasCost).toString()
      );

      //make sure the funders are reset properly
      await expect(fundMe.funders(0)).to.be.reverted();
      for (i = 0; i < accounts.length; i++) {
        assert.equal(await fundMe.addressToAmountFunded(accounts[i].address));
      }
    });

    it("Only allow the owner to withdraw", async function() {
      const accounts = await ethers.getSigners();
      const attacker = accounts[1];
      const attackerConnectedContract = await fundMe.connect(attacker);
      await expect(attackerConnectedContract.withdraw()).to.be.revertedWith(
        "Didn't send enough funds"
      );
    });
  });
});
