const {
    TokenBurnTransaction,
    Client,
    PrivateKey,
    AccountBalanceQuery,
    TransferTransaction
} = require("@hashgraph/sdk");
require('dotenv').config({ path: 'Token_Service/.env' });

const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

const otherAccountId = process.env.OTHER_ACCOUNT_ID;
const otherPrivateKey = PrivateKey.fromString(process.env.OTHER_PRIVATE_KEY);

const tokenId = process.env.NFT_ID;

// If we weren't able to grab it, we should throw a new error
if (myAccountId == null ||
    myPrivateKey == null ) {
    throw new Error("Environment variables myAccountId and myPrivateKey must be present");
}

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const client = Client.forTestnet();

client.setOperator(myAccountId, myPrivateKey);

async function main() {

    // Check the balance before the transfer for the treasury account
    balanceCheckTx = await new AccountBalanceQuery().setAccountId(myAccountId).execute(client);
    console.log(`- Treasury balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

    // Check the balance before the transfer for the buyer's account
    balanceCheckTx = await new AccountBalanceQuery().setAccountId(otherAccountId).execute(client);
    console.log(`- Buyer's balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

    // Transfer the NFT from treasury to the buyer
    // Sign with the treasury key to authorize the transfer
    let tokenTransferTx = await new TransferTransaction()
        .addNftTransfer(tokenId, 1, otherAccountId, myAccountId)
        .freezeWith(client)
        .sign(otherPrivateKey);

    let tokenTransferSubmit = await tokenTransferTx.execute(client);
    let tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

    console.log(`\n- NFT transfer from Buyer to Treasury: ${tokenTransferRx.status} \n`);

    // Check the balance of the treasury account after the transfer
    balanceCheckTx = await new AccountBalanceQuery().setAccountId(myAccountId).execute(client);
    console.log(`- Treasury balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

    // Check the balance of the buyer's account after the transfer
    balanceCheckTx = await new AccountBalanceQuery().setAccountId(otherAccountId).execute(client);
    console.log(`- Buyer's balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

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

    console.log("The transaction consensus status " +transactionStatus.toString());

    // Check the balance of the treasury account after the transfer
    balanceCheckTx = await new AccountBalanceQuery().setAccountId(myAccountId).execute(client);
    console.log(`- Treasury balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

    // Check the balance of the buyer's account after the transfer
    balanceCheckTx = await new AccountBalanceQuery().setAccountId(otherAccountId).execute(client);
    console.log(`- Buyer's balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

    process.exit();
}

main();
