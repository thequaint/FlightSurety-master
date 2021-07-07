pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/
   
   // let owner='0xE8756dc0ba6192b16566CcBA084089F5653D2419';
    address private contractOwner;                                      // Account used to deploy contract
    bool private operational = true;     
    uint8 counter=1;
    uint256 cc1=0;
    address checkadd;
    address add2;
                                   // Blocks all state changes throughout the contract if false
    //mapping(address=>uint256)  memory pay;
    
    mapping(address=>bool) private ra;
    mapping(address=>uint256) private ib;
    mapping(address=>bool) private funded;
    mapping(address=>bool) private praposal;
    mapping(address=>bool) private votes;
    
    mapping(address=>address) private votemap;
    mapping(address=>uint256) private rv;
    mapping(address=>uint256) private duepay;
    //event check(uint256);
    //event check1(uint256);
    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/


    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor
                                (
                                ) 
                                public 
    {
        contractOwner = msg.sender;
        ra[msg.sender]=true;
        funded[msg.sender]=true;
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational() 
    {
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */      
    function isOperational() 
                            public 
                            view 
                            returns(bool) 
    {
        return operational;
    }


    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */    
    function setOperatingStatus
                            (
                                bool mode
                            ) 
                            external
                            requireContractOwner 
    {
        operational = mode;
    }
    function isAirline(address airlineaddress)
                            public 
                            view 
                            returns(bool)
    {   
        return ra[airlineaddress];
    }
    function isfunded(address airlineaddress)
                            public 
                            view 
                            returns(bool)
    {   
        return funded[airlineaddress];
    }


      function voteconter(address a)
                            public 
                            view 
                            returns(uint256)
    {   
        return rv[a];
    }

      function isAirlineoperational(address airlineaddress)
                            public 
                            view 
                            returns(bool)
    {   
        return funded[airlineaddress];
    }
    function add()
                            public 
                            view 
                            returns(address)
    {   
        return msg.sender;
    }
     
    
    function insurancebuyercheck(address buyer)
                            public 
                            view 
                            returns(uint256)
    {   
       // require(ib[buyer]!=0,"Not puchached the sum");
        return ib[buyer];
    }
    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

   /**
    * @dev Add an airline to the registration queue
    *      Can only be called from FlightSuretyApp contract
    *
    */ 
    function setVote(bool b,address Voter)
    
    external 
    
    {
         
        require(funded[msg.sender]==true,"Not funded flights cant vote");
        require(votemap[msg.sender]!=Voter,"Airline already voted");
        if(b==true){
        
        rv[Voter]=rv[Voter]+1;

        }
        votemap[msg.sender]=Voter;

    
    }
   
   
    function giveVotes
                      (
                        address Voter,
                        bool vote
                      ) external 
                          
                       // requireIsOperational
                        
                        {
       
       // require(funded[msg.sender]==true,"Not funded flights cant vote");
      //  require(votemap[msg.sender]!=Voter,"Airline already voted");
        
            //uint256 counter1=votes[Voter];
            
            votes[Voter]=vote;
        
        //votemap[msg.sender]=Voter;
        }  

    function registerAirline
                            (   
                                address airlineaddress
                                
                                

                            )
                            external
                            
                            requireIsOperational
                           // returns(uint8)
                            
    {   if(counter<4){
        require(ra[msg.sender],"Request not by owner" );
        require(funded[msg.sender],"Not funded");
        ra[airlineaddress]=true;
        counter=counter+1;
        //return 0;
        }
        
        if(rv[airlineaddress] >counter/2 && counter>=4){

            ra[airlineaddress]=true;
            counter=counter+1;
            //return 0;
        }
    //return 1;

    }


   /**
    * @dev Buy insurance for a flight
    *
    */   
    function buy
                            (   address airline,
                                address buyeraddress,
                                uint256 cost
                               

                            )
                            external
                            payable
                            requireIsOperational
    {   //check
       // require(ib[buyeraddress]==0,"Buyer already purchased flight");
        //effect
       /// uint256 amount=msg.value;
        ib[buyeraddress]=ib[buyeraddress]+cost;
        //interaction
        
       // .transfer(cost);
        airline.transfer(msg.value);


    }

    /**
     *  @dev Credits payouts to insurees
    */
   


    function creditInsurees
                                (
                                    address buyeraddress
                                    
                                    
                                )
                                external
                                
    {   //check
        uint256 a;
        uint256 b;
        require(ib[buyeraddress]!=0,"Not purchased");
        //effect
        uint256 cost=ib[buyeraddress];
        //cc1=ib[buyeraddress];

        
        delete (ib[buyeraddress]);
        //uint256 cost1=cost.mul(3).div(2);
       //        cc1=
        duepay[buyeraddress]=cost;
        cc1=duepay[buyeraddress];                                                                                                                                                                                
        //checkadd=buyeraddress;

       // cc1=cost;
        //interaction
       // _transferFrom(flight,buyeraddress,10);
       // emit check(paydue[buyeraddress]);
       
    }
    function payback( address buyeraddress) external  returns(uint256) {
                require(duepay[buyeraddress]!=0,"Buyer not eligible for payout");
                uint256 bal=duepay[buyeraddress];
                delete(duepay[buyeraddress]); 
                return bal;
               
    }

    function checkcredit() external  returns(uint256){
           //uint256 cc1=1;           
           
           ///checkadd.transfer(cc3);
           return (cc1);
    }
    function checkcredit2() external  returns(address){


           return (checkadd);
    }
    function checkcredit3(address mine) external  returns(address){

         //  cc1=duepay[mine];
           return (mine);
    }
    

    /**
     *  @dev Transfers eligible payout funds to insuree
     *
    */
    // function pay
    //                         (
    //                             address  payments
                                
    //                         )
    //                         external
    //                         payable
    //                         requireIsOperational
    //                         returns(uint256)
    // {
    //     //check
    //   // require(paydue[payments] !=0 ,"Not eligible to get paid");
    //     //effect

    //     //donepay[payments]+= paydue[payments];
        
    //     //delete(paydue[payments]);
    //     //uint256 a=cost*3;
    //     //uint256 b=a/2;
    //     //intractions
    //    // uint256 bal=1.5 ether;
    //     //payments.transfer(b);
    //     return donepay[payments];

    // }
   
   /**
    * @dev Initial funding for the insurance. Unless there are too many delayed flights
    *      resulting in insurance payouts, the contract should be self-sustaining
    *
    */   
    function fund
                            (   
                                

                            )
                            public
                            payable
    {
        require(ra[msg.sender]==true,"flight not registered");
        //require(msg.value==10 ether,"Not appropriate funding available");
        require(funded[msg.sender]==false,"flight is already funded");
       // require(msg.value== 1,"value not as required");
       // msg.sender.transfer(msg.value);
        funded[msg.sender]=true;
        //address(this).transfer(msg.value);
    }
                   
    function getFlightKey
                        (
                            address airline,
                            string memory flight,
                            uint256 timestamp
                        )
                    
                        
                        returns(bytes32) 
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    /**
    * @dev Fallback function for funding smart contract.
    *
    */
    function() 
                            external 
                            payable
                             
    {
        fund();
    }


}

