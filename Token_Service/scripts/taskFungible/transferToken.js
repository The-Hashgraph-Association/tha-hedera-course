const {
    TransferTransaction,
    Client,
    TokenAssociateTransaction,
    Wallet,
    PrivateKey
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

const myWallet = new Wallet(
    myAccountId,
    myPrivateKey
)

const recipientWallet = new Wallet(
    recipientAccountId,
    recipientPrivateKey
);

const tokenId = process.env.TOKEN_ID;

// -------------------------- Set up testnet client --------------------------

const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

// ---------------------------------------------------------------------------

async function main() {

    //  Before an account that is not the treasury for a token can receive or send this specific token ID, the account
    //  must become “associated” with the token.
    let associateOtherWalletTx = await new TokenAssociateTransaction()
        .setAccountId(recipientWallet.accountId)
        .setTokenIds([tokenId])
        .freezeWith(client)
        .sign(recipientPrivateKey)

    //SUBMIT THE TRANSACTION
    let associateOtherWalletTxSubmit = await associateOtherWalletTx.execute(client);

    //GET THE RECEIPT OF THE TRANSACTION
    let associateOtherWalletRx = await associateOtherWalletTxSubmit.getReceipt(client);

    //LOG THE TRANSACTION STATUS
    console.log(`Token association with the users account: ${associateOtherWalletRx.status}`);

    //Create the transfer transaction
    const transaction = await new TransferTransaction()
        .addTokenTransfer(tokenId, client.operatorAccountId, -3)
        .addTokenTransfer(tokenId, recipientWallet.accountId, 3)
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
