const Crowd = artifacts.require("Crowd");

module.exports = function (deployer) {
  deployer.deploy(Crowd);
};
