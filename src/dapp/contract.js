import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';

//import Request from "request";
export default class Contract {
    constructor(network, callback) {

        let config = Config[network];
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.initialize(callback);
        this.owner = null;
        this.airlines = [];
        this.passengers = [];
        this.flight=[];
       // let airline1=new Map();
       // let timestp=new Map();
       // var request = require("request")
    }
  
    initialize(callback) {
        this.web3.eth.getAccounts((error, accts) => {
           
            this.owner = accts[0];

            let counter = 1;
            
            while(this.airlines.length < 5) {
                this.airlines.push(accts[counter++]);
            }

            while(this.passengers.length < 5) {
                this.passengers.push(accts[counter++]);
            }

            callback();
        });
    }

    isOperational(callback) {
       let self = this;
       self.flightSuretyApp.methods
            .isOperational()
            .call({ from: self.owner,gas: 300002}, callback);
    }

    fetchFlightStatus(flight, callback) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        } 

        self.flightSuretyApp.methods
             
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({ from: self.owner}, (error, result) => {
                callback(error, payload);
            });
            
        //self.flightSuretyApp.methods.fetchFlightStatus()
    }
 
    
         
    async registerFlight(flight,callback){
        let self=this;
        let i=4;
        let flights=["Canada","USA","RUSSIA","CHINA"];
        
        let payload = {
            airline: self.airlines[0],
           // flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        }
        
        while(i>0){
           // let flight=self.flights[i-1];
            await self.flightSuretyApp.methods.registerFlight(payload.airline, flights[i-1], payload.timestamp)
            .send({from:self.airlines[0], gas: 300002},(error,result) =>{
            callback(error,flights[i-1]);
            i--;
        });
        }    
       
         
        // await self.flightSuretyApp.methods.registerFlight(payload.airline, payload.flight, payload.timestamp)
        //     .send({from:self.airlines[0], gas: 300002},(error,result) =>{
        //         //var result1=web3.utils.hexToAscii(JSON.stringify(result));
        //         callback(error,payload);
        //         console.log("JUST THIS CHECK",payload) ; 
               // self.flight1.push(payload);
                //console.log(flight1);
                //storeflight(payload);
               /// callflight();
            // });
       

            
            
    }  

    async passengerspay(flight,cost,callback){
        let self=this;
        let pas=self.passengers[0];
         let insurancePremium = self.web3.utils.toWei(cost,'ether');
        //let cost1=self.web3.utils.fromWei(insurancePremium, 'ether');
       // console.log(insurancePremium);
        let payload={
            consumeraddress:self.passengers[0],
            flight:flight
        }

        
        await self.flightSuretyApp.methods.buyFlight(payload.flight,self.airlines[0],payload.consumeraddress, insurancePremium)
            .send({from:pas,value:insurancePremium,gas:3000000},(error,result)=>{
                callback(error,result)
               
            });
            
    }

    // async passangerswithdraw(callback){
    //     let self=this;
    //   //  let insurancePremium = self.web3.utils.toWei(3,'ether');
    //     let value1= self.web3.utils.toWei("2", "ether");
    //     let payload={
    //         consumeraddress:self.passengers[0]
            
    //     }
    //     await self.flightSuretyApp.methods
    //         .payout(self.passengers[0] )
    //         .send({from:payload.consumeraddress,gas:3000000},(error,result)=>{      callback(error,result)
               
    //     });
        
    //     //    
    // }
    async passangerswithdraw(callback){
        let self=this;
      //  let insurancePremium = self.web3.utils.toWei(3,'ether');
       // let value1= self.web3.utils.toWei("2", "ether");
        let payload={
            consumeraddress:self.passengers[0]
            
        }
        await self.flightSuretyApp.methods
            .payout(payload.consumeraddress )
            .send({from:payload.consumeraddress,gas:3000000},(error,result)=>{ callback(error,result)
               
        });
        
        //    
    }
   // creditcheck1
    
    //var Request = require("request");

   // const insuranceAmount =       web3.utils.toWei('1', "ether")
  //  const balancePreTransaction = await web3.eth.getBalance(accounts[6]);





    
}