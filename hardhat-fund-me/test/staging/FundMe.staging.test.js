const { assert } = require("chai");
const { getNamedAccounts, ethers, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
  ? describe.sktip
  : describe("FundMe", async function() {
      let fundMe, deployer;
      const sendValue = ethers.utils.parseEther("1");
      beforeEach(async function() {
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe", deployer);
      });

      it("allows people to fund and withdraw", async function() {
        await fundMe.fund({ value: sendValue });
        await fundMe.withdraw();
        const endingBalance = await fundMe.providers.getBalance(fundMe.address);
        assert.equal(endingBalance.toString(), "0");
      });
    });
