const {
    TokenCreateTransaction,
    Client,
    TokenType,
    TokenSupplyType,
    PrivateKey,
    AccountBalanceQuery
} = require("@hashgraph/sdk");
require('dotenv').config({ path: 'Token_Service/.env' });

// ------------------ Get ENV variables and validate them --------------------

const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKeyString = process.env.MY_PRIVATE_KEY;

if (myAccountId == null ||
    myPrivateKeyString == null ) {
    throw new Error("Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be present");
}

const myPrivateKey = PrivateKey.fromString(myPrivateKeyString);

// -------------------------- Set up testnet client --------------------------

const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

// ---------------------------------------------------------------------------

async function main() {

    //Create the NFT
    let nftCreate = await new TokenCreateTransaction()
        .setTokenName("Best Event Ticket Ever")
        .setTokenSymbol("BETE")
        .setTokenType(TokenType.NonFungibleUnique)
        .setDecimals(0)
        .setInitialSupply(0)
        .setTreasuryAccountId(myAccountId)
        .setSupplyType(TokenSupplyType.Finite)
        .setMaxSupply(5)
        .setSupplyKey(myPrivateKey)
        .freezeWith(client);

    //Sign the transaction with the treasury key
    let nftCreateTxSign = await nftCreate.sign(myPrivateKey);

    //Submit the transaction to a Hedera network
    let nftCreateSubmit = await nftCreateTxSign.execute(client);

    //Get the transaction receipt
    let nftCreateRx = await nftCreateSubmit.getReceipt(client);

    //Get the token ID
    let tokenId = nftCreateRx.tokenId;

    //Log the token ID
    console.log(`Created NFT with Token ID: ${tokenId}`);

    const balanceCheckTx = await new AccountBalanceQuery().setAccountId(myAccountId).execute(client);

    console.log(`User balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} units of token ID ${tokenId}`);

    process.exit();
}

main();
