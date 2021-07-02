
import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';


(async() => {

    let result = null;

    let contract = new Contract('localhost', () => {

        // Read transaction
        contract.isOperational((error, result) => {
            console.log(error,result);
            display('Operational Status', 'Check if contract is operational', [ { label: 'Operational Status', error: error, value: result} ]);
        });
    
        
        // User-submitted transaction
        DOM.elid('submit-oracle').addEventListener('click', () => {
            let flight = DOM.elid('flight-number').value;
            // Write transaction
            contract.fetchFlightStatus(flight, (error, result) => {
                display('Oracles', 'Trigger oracles', [ { label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp} ]);
            });
            
        })
       
        DOM.elid('submit-Passenger-Payment').addEventListener('click', () => {
            let flight = DOM.elid('flight-number2').value;
            let cost   = DOM.elid('cost').value;
            // Write transaction
            contract.passengerspay(flight,cost, (error, result) => {
                display('Oracles', 'Trigger oracles', [ { label: 'Fetch Flight Status1', error: error} ]);
            });
            
        })
        DOM.elid('submit-Passenger-Withdraw').addEventListener('click', () => {
           // let flight = DOM.elid('flight-number').value;
            // Write transaction
            contract.passangerswithdraw( (error, result) => {
                display('Oracles', 'Trigger oracles', [ { label: 'Fetch Flight Status2', error: error, value: result.flight + ' ' + result.timestamp} ]);
            });
            
        })
        DOM.elid('submit-flight').addEventListener('click', () => {
             let flight = DOM.elid('flight-number1').value;
             // Write transaction
             contract.registerFlight(flight, (error, result) => {
                 display('flight', 'flight ', [ { label: 'Registered flight', error: error, value: result.flight} ]);
             });
             
         })

    
    });
    

})();


function display(title, description, results) {
    let displayDiv = DOM.elid("display-wrapper");
    let section = DOM.section();
    section.appendChild(DOM.h2(title));
    section.appendChild(DOM.h5(description));
    results.map((result) => {
        let row = section.appendChild(DOM.div({className:'row'}));
        row.appendChild(DOM.div({className: 'col-sm-4 field'}, result.label));
        row.appendChild(DOM.div({className: 'col-sm-8 field-value'}, result.error ? String(result.error) : String(result.value)));
        section.appendChild(row);
    })
    displayDiv.append(section);

}







