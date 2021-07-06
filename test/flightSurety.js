
var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');

contract('Flight Surety Tests', async (accounts) => {

  var config;
  before('setup contract', async () => {
    config = await Test.Config(accounts);
    // console.log(config);
    // console.log(config.owner);
    // console.log(config.flightSuretyData);
    // console.log(config.flightSuretyApp);
    // await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);
    // let flightSuretyApp = await FlightSuretyApp.new(flightSuretyData.address);
    // let flightSuretyApp = await FlightSuretyApp.new(config.flightSuretyData.address);
  });

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`(multiparty) has correct initial isOperational() value`, async function () {
  
    // Get operating status
    let status = await config.flightSuretyData.isOperational.call();
    assert.equal(status, true, "Incorrect initial operating status value");

  });

  it(`(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

      // Ensure that access is denied for non-Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[2] });
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, true, "Access not restricted to Contract Owner");
            
  });

  it(`(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {

      // Ensure that access is allowed for Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false);
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, false, "Access not restricted to Contract Owner");
      
  });

  it(`(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {

      await config.flightSuretyData.setOperatingStatus(false);

      let reverted = false;
      try 
      {
          await config.flightSurety.setTestingMode(true);
      }
      catch(e) {
          reverted = true;
      }
      assert.equal(reverted, true, "Access not blocked for requireIsOperational");      

      // Set it back for other tests to work
      await config.flightSuretyData.setOperatingStatus(true);

  });

  it('(airline) cannot register an Airline using registerAirline() if it is not funded', async () => {
    
    // ARRANGE
    let newAirline = accounts[2];

    // ACT
    try {
        await config.flightSuretyApp.registerAirline(newAirline, {from: config.owner});
    }
    catch(e) {

    }
    let result = await config.flightSuretyData.isAirline.call(newAirline); 
   // console.log(result);
    //console.log(config.firstAirline);

    //console.log(result);
    // ASSERT
    assert.equal(result, false, "Airline should not be able to register another airline if it hasn't provided funding");

  });
  
  it('Only existing airline may register a new airline until there are at least four airlines registered ',async () => { 
    //let owner= '0xE8756dc0ba6192b16566CcBA084089F5653D2419' ;
   /// console.log(accounts[0]);
    //console.log(accounts[1]);
    //console.log(accounts[2]);
    //console.log(accounts[4]);
   // console.log(accounts[5]);
   // let newAirline1 = accounts[0];
    let newAirline2 = accounts[1];
    let newAirline3 = accounts[2];
    let newAirline4 = accounts[3];
    let newAirline5= accounts[4];
    try {
    //  await config.flightSuretyData.registerAirline(newAirline1, {from: accounts[0]});
      await config.flightSuretyData.registerAirline(newAirline2, {from: accounts[0]});
      await config.flightSuretyData.registerAirline(newAirline3, {from: accounts[0]});
      await config.flightSuretyData.registerAirline(newAirline4, {from: accounts[0]});
      await config.flightSuretyData.registerAirline(newAirline5, {from: accounts[0]});
        }
  catch(e) {

  }
      
  let result = await config.flightSuretyData.isAirline.call(newAirline5);
  console.log(result); 
 // console.log(owner);
  assert.equal(result, false, "Only existing airline may register a new airline until there are at least four airlines registered");
  
  });
 



  it('Airline can be registered, but does not participate in contract until it submits funding of 10 ether',async ()=>{
     check1 =false;
     newAirline2=accounts[1];
     
     let fisrtres=await config.flightSuretyData.isAirline.call(newAirline2);   
     let secres=await config.flightSuretyData.isAirlineoperational(newAirline2);
     
     //let result1=await config .flightSuretyData.funded();
     if(secres==false && fisrtres==true ){check1=true;}
     assert.equal(check1, true, "Airline can be registered, but does not participate in contract until it submits funding of 10 ether");
  

  });   
  


 

  it('Registration of fifth and subsequent airlines requires multi-party consensus of 50% of registered airlines',async()=>{
    let airline1=accounts[0];
    let airline2=accounts[1];
    let airline3=accounts[2];
    let airline4=accounts[3];
    let airline5=accounts[4];
    

    try{
       // await config.flightSuretyData.registerAirline(newAirline2,{from: accounts[0]});
        await config.flightSuretyData.fund({from:airline2});
        await config.flightSuretyData.setVote(true,airline5,{from:airline2});
       
        
        //await config.flightSuretyData.registerAirline(newAirline2,{from: accounts[0]});
        //await config.flightSuretyData.setVote(true,airline5,{from:airline4});

        //await config.flightSuretyData.registerAirline(airline6,{from: accounts[0]});
        await config.flightSuretyData.fund({from:airline3});
        await config.flightSuretyData.setVote(true,airline5,{from:airline3});

        await config.flightSuretyData.fund({from:airline4});
        await config.flightSuretyData.setVote(true,airline5,{from:airline4});
        
        await config.flightSuretyData.registerAirline(airline5,{from: accounts[0]});
    }
    catch(e){
      console.log(e);
    }
    

         let result=await config.flightSuretyData.voteconter.call(airline5);
         let result1=await config.flightSuretyData.isAirline.call(airline5);   
         console.log(result1);
         console.log(result);
         assert.equal(result1,true,'Registration of fifth and subsequent airlines requires multi-party consensus of 50% of registered airlines');
  });
  
  //  it('check insurance buyer transaction',async()=>{

  //       const insuranceAmount =        web3.utils.toWei('1', "ether");
  //       const balancePreTransaction =  await web3.eth.getBalance(accounts[1]);
  //       const balancePreTransaction1 = await web3.eth.getBalance(accounts[9]);
  //       console.log(balancePreTransaction,balancePreTransaction1);
  //       await config.flightSuretyData.buy(accounts[1],accounts[9],{from:accounts[9],value:insuranceAmount,gas:300000});
  //       const balancePreTransaction3 =  await web3.eth.getBalance(accounts[1]);
  //       const balancePreTransaction4 = await web3.eth.getBalance(accounts[9]);
  //       console.log(balancePreTransaction3,balancePreTransaction4);
      
  //       assert.equal(balancePreTransaction3-balancePreTransaction,balancePreTransaction1-balancePreTransaction4,'check insurance buyer transaction');
  //  });
   
   it('buyFlight ',async()=>{

     try{
      
      await config.flightSuretyApp.buyFlight("Barkudapalko",accounts[0],accounts[8],1,{from:accounts[8],value:1000000000000000000});
     }
     catch(e){console.log(e);}
     try{
     let result=await config.flightSuretyApp.ispurchased("Barkudapalko");

     let result1=await config.flightSuretyApp.isbuyerexit("Barkudapalko");

     await config.flightSuretyData.creditInsurees(result);
     console.log(result,result1);
     
     }
     catch(e){console.log(e);}
     
    
   });
  
});
