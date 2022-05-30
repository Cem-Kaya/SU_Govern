const Migrations = artifacts.require("myDao");

module.exports = function (deployer) {
  deployer.deploy(myDao);
};
