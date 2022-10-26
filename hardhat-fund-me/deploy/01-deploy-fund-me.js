const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  // const ethUsdPriceAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  let ethUsdPriceAddress;
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await get("MockV3Aggregator");
    ethUsdPriceAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceAddress],
    log: true,
  });
  log("---------------------------------");
};

module.exports.tags = ["all", "fundme"];
