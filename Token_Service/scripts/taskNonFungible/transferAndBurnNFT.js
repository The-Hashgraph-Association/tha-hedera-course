const {
    TokenBurnTransaction,
    Client,
    PrivateKey,
    AccountBalanceQuery,
    TransferTransaction
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

const recipientAccountId = process.env.OTHER_ACCOUNT_ID;
const recipientPrivateKeyString = process.env.OTHER_PRIVATE_KEY;

if (recipientAccountId == null ||
    recipientPrivateKeyString == null ) {
    throw new Error("Environment variables OTHER_ACCOUNT_ID and OTHER_PRIVATE_KEY must be present");
}

const recipientPrivateKey = PrivateKey.fromString(recipientPrivateKeyString);

const tokenId = process.env.NFT_ID;

// -------------------------- Set up testnet client --------------------------

const client = Client.forTestnet();

client.setOperator(myAccountId, myPrivateKey);

// ---------------------------------------------------------------------------

async function main() {
    console.log(`--> Before transfer back to treasury`);

    // Check the balance before the transfer for the treasury account
    balanceCheckTx = await new AccountBalanceQuery().setAccountId(myAccountId).execute(client);
    console.log(`Treasury balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

    // Check the balance before the transfer for the buyer's account
    balanceCheckTx = await new AccountBalanceQuery().setAccountId(recipientAccountId).execute(client);
    console.log(`Buyer's balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

    // Transfer the NFT from treasury to the buyer
    // Sign with the treasury key to authorize the transfer
    let tokenTransferTx = await new TransferTransaction()
        .addNftTransfer(tokenId, 1, recipientAccountId, myAccountId)
        .freezeWith(client)
        .sign(recipientPrivateKey);

    let tokenTransferSubmit = await tokenTransferTx.execute(client);
    let tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

    console.log(`NFT transfer from Buyer to Treasury: ${tokenTransferRx.status}`);

    console.log(`--> After transfer back to treasury`);

    // Check the balance of the treasury account after the transfer
    balanceCheckTx = await new AccountBalanceQuery().setAccountId(myAccountId).execute(client);
    console.log(`Treasury balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

    // Check the balance of the buyer's account after the transfer
    balanceCheckTx = await new AccountBalanceQuery().setAccountId(recipientAccountId).execute(client);
    console.log(`Buyer's balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

    //Burn the nft and freeze the unsigned transaction for manual signing
    const transaction = await new TokenBurnTransaction()
        .setTokenId(tokenId)
        .setSerials([1])
        .freezeWith(client);

    //Sign with the supply private key of the token
    const signTx = await transaction.sign(myPrivateKey);

    //Submit the transaction to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status;

    console.log(`--> After burn`);

    console.log("The transaction consensus status " +transactionStatus.toString());

    // Check the balance of the treasury account after the transfer
    balanceCheckTx = await new AccountBalanceQuery().setAccountId(myAccountId).execute(client);
    console.log(`Treasury balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

    // Check the balance of the buyer's account after the transfer
    balanceCheckTx = await new AccountBalanceQuery().setAccountId(recipientAccountId).execute(client);
    console.log(`Buyer's balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

    process.exit();
}

main();
