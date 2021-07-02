
var FlightSuretyApp = artifacts.require("FlightSuretyApp");
var FlightSuretyData = artifacts.require("FlightSuretyData");
var BigNumber = require('bignumber.js');

var Config = async function(accounts) {
    
    // These test addresses are useful when you need to add
    // multiple users in test scripts
    let testAddresses = [
        "0xE8756dc0ba6192b16566CcBA084089F5653D2419",
        "0x408b33def162c6e48DBB823cef9Ba7A0181dc961",
        "0xB250a596E9515Cd17Aa377CC2291afE21BF074f8",
        "0x1c4Ca24bA3c94D5715273cEa666355C3695f7d62",
        "0xe44b7B49acfE6e0006a36d0a25AE73a955067F6D",
        "0x6D47E6fDdEDA404E2Fd02FFFC77A151897151188",
        "0xAdFf845496c181DD77cc8C05ebcF4407EbFa8258",
        "0xc257274276a4e539741ca11b590b9447b26a8051",
        "0x2f2899d6d35b1a48a4fbdc93a37a72f264a9fca7"
    ];


    let owner = accounts[0];
    let firstAirline = accounts[1];

    let flightSuretyData = await FlightSuretyData.new();
    let flightSuretyApp = await FlightSuretyApp.new(flightSuretyData.address);
  //  console.log(flightSuretyData.address);
  //  console.log(flightSuretyApp.address);
   
    
    return {
        owner: owner,
        firstAirline: firstAirline,
        weiMultiple: (new BigNumber(10)).pow(18),
        testAddresses: testAddresses,
        flightSuretyData: flightSuretyData,
        flightSuretyApp: flightSuretyApp

    }
}

module.exports = {
    Config: Config
};