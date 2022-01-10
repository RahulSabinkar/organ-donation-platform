const DonarContract = artifacts.require("DonarContract");

module.exports = function (deployer) {
  deployer.deploy(DonarContract);
};
