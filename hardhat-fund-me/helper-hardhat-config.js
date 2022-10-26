const networkConfig = {
  5: {
    name: "goerli",
    ethUsdPriceFeed: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
  },
  137: {
    name: "polygon",
    ethUsdPriceFeed: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
  },
};

const developmentChains = ["hardhat", "localhost"];
const DECIMALS = 8;
const INITIAL_ANSWER = 2000;

module.exports = {
  networkConfig,
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
};
