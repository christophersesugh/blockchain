const { developmentChains } = require("../helper-hardhat-config");

const etherscanApi = process.env.ETHERSCAN_API_KEY;

module.exports = async function({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("#####-------------------#####");
  const args = [];
  const basicNft = await deploy("BasicNFT", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockCOnfirmations || 1,
  });

  if (!developmentChains.includes(network.name)) {
    log("Verifying...");
    await verify(basicNft.address, args);
  }
  log("#####-------------------#####");
};
