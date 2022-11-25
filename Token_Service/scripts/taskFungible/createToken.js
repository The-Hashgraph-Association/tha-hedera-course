const {
    TokenCreateTransaction,
    Client,
    TokenType,
    TokenInfoQuery,
    AccountBalanceQuery, PrivateKey, Wallet
} = require("@hashgraph/sdk");
require('dotenv').config({ path: 'Token_Service/.env' });

const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

if (myAccountId == null ||
    myPrivateKey == null ) {
    throw new Error("Environment variables myAccountId and myPrivateKey must be present");
}

const otherAccountId = process.env.OTHER_ACCOUNT_ID;
const otherPrivateKey = PrivateKey.fromString(process.env.OTHER_PRIVATE_KEY);

if (otherAccountId == null ||
    otherPrivateKey == null ) {
    throw new Error("Environment variables otherAccountId and otherPrivateKey must be present");
}

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const client = Client.forTestnet();

client.setOperator(myAccountId, myPrivateKey);

const adminUser = new Wallet(
    myAccountId,
    myPrivateKey
)

const supplyUser = new Wallet(
    otherAccountId,
    otherPrivateKey
)

async function main() {
    //Create the transaction and freeze for manual signing
    const transaction = await new TokenCreateTransaction()
        .setTokenName("Awesome Game Token")
        .setTokenSymbol("AGT")
        .setTokenType(TokenType.FungibleCommon)
        .setTreasuryAccountId(myAccountId)
        .setInitialSupply(2000)
        .setAdminKey(adminUser.publicKey)
        .setSupplyKey(supplyUser.publicKey)
        .freezeWith(client);

    //Sign the transaction with the client, who is set as admin and treasury account
    const signTx =  await transaction.sign(myPrivateKey);

    //Submit to a Hedera network
    const txResponse = await signTx.execute(client);

    //Get the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the token ID from the receipt
    const tokenId = receipt.tokenId;

    console.log("The new token ID is " + tokenId);

    //Sign with the client operator private key, submit the query to the network and get the token supply

    const name = await queryTokenFunction("name", tokenId);
    const symbol = await queryTokenFunction("symbol", tokenId);
    const tokenSupply = await queryTokenFunction("totalSupply", tokenId);
    console.log('The total supply of the ' + name + ' token is ' + tokenSupply + ' of ' + symbol);

    //Create the query
    const balanceQuery = new AccountBalanceQuery()
        .setAccountId(adminUser.accountId);

    //Sign with the client operator private key and submit to a Hedera network
    const tokenBalance = await balanceQuery.execute(client);

    console.log("The balance of the user is: " + tokenBalance.tokens.get(tokenId));

    process.exit();
}

async function queryTokenFunction(functionName, tokenId) {
    //Create the query
    const query = new TokenInfoQuery()
        .setTokenId(tokenId);

    console.log("retrieveing the " + functionName);
    const body = await query.execute(client);

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
