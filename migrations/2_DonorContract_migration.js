const DonorContract = artifacts.require("DonorContract");

module.exports = function (deployer) {
  deployer.deploy(DonorContract);
};