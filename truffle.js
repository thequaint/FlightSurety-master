var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "leaf useful desert action head wagon enemy turtle guilt denial industry master";

module.exports = {
  networks: {
    development: {
     // provider: function() {
       // return new HDWalletProvider(mnemonic, "http://127.0.0.1:8545/", 0, 50);
      //},
      host: "127.0.0.1",
      port: 8545,
      network_id: '*',
      gas:6721975

    //  websockets: true
    }
  },
  compilers: {
    solc: {
      version: "^0.4.24"
    }
  }
};