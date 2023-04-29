const {
    Client,
    TokenBurnTransaction,
    PrivateKey
} = require("@hashgraph/sdk");
require('dotenv').config({ path: 'Token_Service/.env' });

// ------------------ Get ENV variables and validate them --------------------

const supplyAccountId = process.env.OTHER_ACCOUNT_ID;
const supplyPrivateKeyString = process.env.OTHER_PRIVATE_KEY;

if (supplyAccountId == null ||
    supplyPrivateKeyString == null ) {
    throw new Error("Environment variables OTHER_ACCOUNT_ID and OTHER_PRIVATE_KEY must be present");
}

const supplyPrivateKey = PrivateKey.fromString(supplyPrivateKeyString);

const tokenId = process.env.TOKEN_ID;

// -------------------------- Set up testnet client --------------------------

const client = Client.forTestnet();
client.setOperator(supplyAccountId, supplyPrivateKey);

// ---------------------------------------------------------------------------

async function main() {

    //Burn 42 tokens and freeze the unsigned transaction for manual signing
    const transaction = await new TokenBurnTransaction()
        .setTokenId(tokenId)
        .setAmount(42)
        .freezeWith(client);

    //Sign with the supply private key of the token
    const signTx = await transaction.sign(supplyPrivateKey);

    //Submit the transaction to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status;

    console.log("The transaction consensus status " +transactionStatus.toString());

    process.exit();
}

main();
