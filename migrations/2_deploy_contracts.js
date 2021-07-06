const FlightSuretyApp = artifacts.require("FlightSuretyApp");
const FlightSuretyData = artifacts.require("FlightSuretyData");
const fs = require('fs');

module.exports = function(deployer) {

   // let firstAirline = '0xf17f52151EbEF6C7334FAD080c5704D77216b732';
   // let firstAirline ='0xF014343BDFFbED8660A9d8721deC985126f189F3';
    let firstAirline=' 0xE8756dc0ba6192b16566CcBA084089F5653D2419';
    deployer.deploy(FlightSuretyData)
    .then(() => {
        return deployer.deploy(FlightSuretyApp,FlightSuretyData.address)
                .then(() => {
                    let config = {
                        localhost: {
                            //url: 'http://localhost:8545',
                            url: 'http://127.0.0.1:7545',
                            dataAddress: FlightSuretyData.address,
                            appAddress: FlightSuretyApp.address
                        }
                    }
                    fs.writeFileSync(__dirname + '/../src/dapp/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
                    fs.writeFileSync(__dirname + '/../src/server/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
                });
    });
}
