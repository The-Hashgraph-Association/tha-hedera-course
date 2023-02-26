const {
    TokenMintTransaction,
    Client,
    TokenInfoQuery, PrivateKey
} = require("@hashgraph/sdk");
require('dotenv').config({ path: 'Token_Service/.env' });

const supplyAccountId = process.env.OTHER_ACCOUNT_ID;
const supplyPrivateKey = PrivateKey.fromString(process.env.OTHER_PRIVATE_KEY);

const tokenId = process.env.TOKEN_ID;

// If we weren't able to grab it, we should throw a new error
if (supplyAccountId == null ||
    supplyPrivateKey == null ) {
    throw new Error("Environment variables supplyAccountId and supplyPrivateKey must be present");
}

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const supplyClient = Client.forTestnet();

supplyClient.setOperator(supplyAccountId, supplyPrivateKey);

async function main() {
    //Create the transaction and freeze for manual signing
    const transaction = await new TokenMintTransaction()
        .setTokenId(tokenId)
        .setAmount(3000)
        .freezeWith(supplyClient);

    //Sign the transaction with the client, who is set as admin and treasury account
    const signTx =  await transaction.sign(supplyPrivateKey);

    //Submit the signed transaction to a Hedera network
    const txResponse = await signTx.execute(supplyClient);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(supplyClient);

    //Get the transaction consensus status
    const transactionStatus = receipt.status.toString();

    console.log("The transaction consensus status is " +transactionStatus);

    //Create the query
    const query = new TokenInfoQuery()
        .setTokenId(tokenId);

    //Sign with the client operator private key, submit the query to the network and get the token supply

    const name = await queryTokenFunction("name", tokenId);
    const symbol = await queryTokenFunction("symbol", tokenId);
    const tokenSupply = await queryTokenFunction("totalSupply", tokenId);
    console.log('The total supply of the ' + name + ' token is ' + tokenSupply + ' of ' + symbol);

    process.exit();
}

async function queryTokenFunction(functionName, tokenId) {
    //Create the query
    const query = new TokenInfoQuery()
        .setTokenId(tokenId);

    console.log(functionName);
    const body = await query.execute(supplyClient);

    //Sign with the client operator private key, submit the query to the network and get the token supply
    let result;
    if (functionName === "name") {
        result = body.name;
    } else if(functionName ==="symbol") {
        result = body.symbol;
    } else if(functionName === "totalSupply") {
        result = body.totalSupply;
    } else {
        return;
    }

    return result
}

main();
