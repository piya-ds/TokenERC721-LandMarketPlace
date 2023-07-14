const LandSale = artifacts.require("LandSale");

module.exports = function (_deployer) {
  _deployer.deploy(LandSale);
};