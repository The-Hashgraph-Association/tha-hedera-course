const {
    Client,
    ContractFunctionParameters,
    ContractCallQuery,
    Hbar,
    PrivateKey
} = require("@hashgraph/sdk");
require('dotenv').config({ path: 'SmartContract_Service/.env' });

const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
const contractId = process.env.CONTRACT_ID;
const hash = process.env.HASH;

// If we weren't able to grab it, we should throw a new error
if (myAccountId == null ||
    myPrivateKey == null) {
    throw new Error("Environment variables myAccountId and myPrivateKey must be present");
}

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const client = Client.forTestnet();

client.setOperator(myAccountId, myPrivateKey);

async function main() {

    //Query the contract for the contract message
    const contractCallQuery = new ContractCallQuery()
        //Set the ID of the contract to query
        .setContractId(contractId)
        //Set the gas to execute the contract call
        .setGas(100000)
        //Set the contract function to call
        .setFunction("checkSealRevocationStatus", new ContractFunctionParameters().addString(hash))
        //Set the query payment for the node returning the request
        //This value must cover the cost of the request otherwise will fail
        .setQueryPayment(new Hbar(10));

    //Submit the transaction to a Hedera network
    const contractQuerySubmit = await contractCallQuery.execute(client);
    const contractQueryResult = contractQuerySubmit.getBool(0);

    //Log the updated message to the console
    console.log("The updated contract message: " + contractQueryResult);

    process.exit();
}

main();


