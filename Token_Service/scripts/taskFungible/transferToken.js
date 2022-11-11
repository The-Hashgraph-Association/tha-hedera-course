const {
    TransferTransaction,
    Client,
    TokenAssociateTransaction,
    Wallet,
    PrivateKey
} = require("@hashgraph/sdk");
require('dotenv').config({ path: 'Token_Service/.env' });

const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

const otherAccountId = process.env.OTHER_ACCOUNT_ID;
const otherPrivateKey = PrivateKey.fromString(process.env.OTHER_PRIVATE_KEY);

const tokenId = process.env.TOKEN_ID;

// If we weren't able to grab it, we should throw a new error
if (myAccountId == null ||
    myPrivateKey == null ) {
    throw new Error("Environment variables myAccountId and myPrivateKey must be present");
}

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const client = Client.forTestnet();

client.setOperator(myAccountId, myPrivateKey);

const wallet = new Wallet(
    otherAccountId,
    otherPrivateKey
);

async function main() {

    //  Before an account that is not the treasury for a token can receive or send this specific token ID, the account
    //  must become “associated” with the token.
    let associateOtherWalletTx = await new TokenAssociateTransaction()
        .setAccountId(wallet.accountId)
        .setTokenIds([tokenId])
        .freezeWith(client)
        .sign(otherPrivateKey)

    //SUBMIT THE TRANSACTION
    let associateOtherWalletTxSubmit = await associateOtherWalletTx.execute(client);

    //GET THE RECEIPT OF THE TRANSACTION
    let associateOtherWalletRx = await associateOtherWalletTxSubmit.getReceipt(client);

    //LOG THE TRANSACTION STATUS
    console.log(`- Token association with the users account: ${associateOtherWalletRx.status} \n`);

    //Create the transfer transaction
    const transaction = await new TransferTransaction()
        .addTokenTransfer(tokenId, client.operatorAccountId, -3)
        .addTokenTransfer(tokenId, wallet.accountId, 3)
        .freezeWith(client);

    //Sign with the sender account private key
    const signTx =  await transaction.sign(myPrivateKey);

    //Sign with the client operator private key and submit to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Obtain the transaction consensus status
    const transactionStatus = receipt.status;

    console.log("The transaction consensus status " +transactionStatus.toString());

    process.exit();
}

main();
