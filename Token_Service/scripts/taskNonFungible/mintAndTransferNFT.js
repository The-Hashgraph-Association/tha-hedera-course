const {
    TokenMintTransaction,
    Client,
    PrivateKey,
    AccountBalanceQuery, TokenAssociateTransaction, TransferTransaction, Wallet
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

const recipientWallet = new Wallet(
    recipientAccountId,
    recipientPrivateKey
);

const tokenId = process.env.NFT_ID;

// -------------------------- Set up testnet client --------------------------

const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

// ---------------------------------------------------------------------------

async function main() {
    //IPFS content identifiers for which we will create a NFT
    CID = "ipfs://bafybeig5vygdwxnahwgp7vku6kyz4e3hdjsg4uikfz5sujbsummozw3wp4";

    // Mint new NFT
    let mintTx = await new TokenMintTransaction()
        .setTokenId(tokenId)
        .setMetadata([Buffer.from(CID)])
        .freezeWith(client);

    //Sign the transaction with the supply key
    let mintTxSign = await mintTx.sign(myPrivateKey);

    //Submit the transaction to a Hedera network
    let mintTxSubmit = await mintTxSign.execute(client);

    //Get the transaction receipt
    let mintRx = await mintTxSubmit.getReceipt(client);

    //Log the serial number
    console.log(`Created NFT ${tokenId} with serial: ${mintRx.serials[0].low}`);

    let balanceCheckTx = await new AccountBalanceQuery().setAccountId(myAccountId).execute(client);

    console.log(`--> After Creation`);
    console.log(`User balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} units of token ID ${tokenId}`);

    //  Before an account that is not the treasury for a token can receive or send this specific token ID, the account
    //  must become “associated” with the token.
    let associateBuyerTx = await new TokenAssociateTransaction()
        .setAccountId(recipientWallet.accountId)
        .setTokenIds([tokenId])
        .freezeWith(client);

    await recipientWallet.signTransaction(associateBuyerTx);

    //SUBMIT THE TRANSACTION
    let associateBuyerTxSubmit = await associateBuyerTx.execute(client);

    //GET THE RECEIPT OF THE TRANSACTION
    let associateBuyerRx = await associateBuyerTxSubmit.getReceipt(client);

    //LOG THE TRANSACTION STATUS
    console.log(`Token association with the users account: ${associateBuyerRx.status}`);

    console.log(`--> After Association`);

    // Check the balance before the transfer for the treasury account
    balanceCheckTx = await new AccountBalanceQuery().setAccountId(myAccountId).execute(client);
    console.log(`Treasury balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

    // Check the balance before the transfer for Alice's account
    balanceCheckTx = await new AccountBalanceQuery().setAccountId(recipientWallet.accountId).execute(client);
    console.log(`Buyer's balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

    // Transfer the NFT from treasury to Alice
    // Sign with the treasury key to authorize the transfer
    let tokenTransferTx = await new TransferTransaction()
        .addNftTransfer(tokenId, 1, myAccountId, recipientWallet.accountId)
        .freezeWith(client)
        .sign(myPrivateKey);

    let tokenTransferSubmit = await tokenTransferTx.execute(client);
    let tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

    console.log(`NFT transfer from Treasury to Buyer: ${tokenTransferRx.status}`);

    console.log(`--> After Transfer`);
    // Check the balance of the treasury account after the transfer
    balanceCheckTx = await new AccountBalanceQuery().setAccountId(myAccountId).execute(client);
    console.log(`Treasury balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

    // Check the balance of Alice's account after the transfer
    balanceCheckTx = await new AccountBalanceQuery().setAccountId(recipientWallet.accountId).execute(client);
    console.log(`Buyer's balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

    process.exit();
}

main();
