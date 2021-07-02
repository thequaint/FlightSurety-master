import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';
import "core-js/stable";
import "regenerator-runtime/runtime";


let config = Config['localhost'];

let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));

web3.eth.defaultAccount = web3.eth.accounts[0];

let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);

let oracles=[];


let accounts= web3.eth.getAccounts();


  

     
   // callback();
  
  
    

//const submitOracleResponses = async (event) =>{}
const registerOrc = async () => {
  //let fee =  await flightSuretyApp.REGISTRATION_FEE.call();
  const REGISTRATION_FEE = 1;
  const fee1=web3.utils.toWei('1','ether');
  const TEST_ORACLES_COUNT=10;
  // ACT
  let accounts=await web3.eth.getAccounts();
  for(let a=0; a<TEST_ORACLES_COUNT; a++) {
    console.log("this is your account",accounts[a]);  
    let account=accounts[a];  
    await  flightSuretyApp.methods.registerOracle().send({from:account,value:fee1,gas:3000000});
    
    //let result=[];
   //let result = await  flightSuretyApp.methods.getMyIndexes().call({"from": accounts[a],"gas":3000000});
   //console.log(result);
   let result = await flightSuretyApp.methods.getMyIndexes().call({
    "from": account
    
  });
  console.log(result);
  console.log(`Oracle Registered: ${result[0]}, ${result[1]}, ${result[2]}`);
  }
}
  

//submitOracle((event)=>{

//}

//
 // ARRANGE
  const submitOracle= async(event)=>{
  const TEST_ORACLES_COUNT=10;
  const index = event.returnValues.index;
  const airline = event.returnValues.airline;
  const flight = event.returnValues.flight;
  const timestamp = event.returnValues.timestamp;
  //let oracleResponse = STATUS_CODE_LATE_WEATHER;
 //let flight = event.flight;
 //let timestamp = Math.floor(Date.now() / 1000);
 //let timestamp=event.timestamp;
// console.log("here we are printing"); 
//console.log(event);
    // Submit a request for oracles to get status information for a flight
   // await config.flightSuretyApp.fetchFlightStatus(config.firstAirline, flight, timestamp);
    // ACT

    // Since the Index assigned to each test account is opaque by design
    // loop through all the accounts and for each account, all its Indexes (indices?)
    // and submit a response. The contract will reject a submission if it was
    // not requested so while sub-optimal, it's a good test of that feature
    let accounts=await web3.eth.getAccounts();
    let counter=0;
    for(let a=1; a<TEST_ORACLES_COUNT; a++) {
      let account=accounts[a];
      
      // Get oracle information
      let oracleIndexes = await flightSuretyApp.methods.getMyIndexes().call({ from: account,gas:300000});
      console.log(oracleIndexes);
      for(let idx=0;idx<3;idx++) {

        try {
          // Submit a response...it will only be accepted if there is an Index match
          await flightSuretyApp.methods.submitOracleResponse( index, airline, flight, timestamp,50 ).send({ from: account,gas:3000000 });

        }
        catch(e) {
          // Enable this when debugging
           console.log('\nError1', idx, oracleIndexes[idx], flight, timestamp,account,counter++);
        }

      }
    }
  
}





flightSuretyApp.events.OracleRequest({
    fromBlock: 0
  }, function (error, event) {
    if (error) console.log(error)
    console.log(event)
    submitOracle(event);
    
    
});

// flightSuretyApp.events.OracleReport({
//   fromBlock: 0
// }, function (error, event) {
//   if (error) console.log(error)
//   console.log(event)
  
  
//  });


// flightSuretyApp.events.FlightStatusInfo({
//   fromBlock: 0
// }, function (error, event) {
//   if (error) console.log(error)
//   console.log(event)
  
  
// });



const app = express();
app.get('/api', (req, res) => {
    res.send({
       
      message: 'An API for use with your Dapp!'
      

    })
})
//getacoount();
registerOrc();
export default app;


