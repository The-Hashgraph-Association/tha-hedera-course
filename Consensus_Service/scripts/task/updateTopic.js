const {
    TopicUpdateTransaction,
    Client,
    Wallet, PrivateKey
} = require("@hashgraph/sdk");
require('dotenv').config({ path: '../../.env' });

const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
const otherAccountId = process.env.OTHER_ACCOUNT_ID;
const otherPrivateKey = PrivateKey.fromString(process.env.OTHER_PRIVATE_KEY);
const topicId = process.env.TOPIC_ID;

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
    //Create a transaction to add a submit key
    const transaction = await new TopicUpdateTransaction()
        .setTopicId(topicId)
        .setSubmitKey(wallet.publicKey)
        .freezeWith(client);

    //Sign the transaction with the admin key to authorize the update
    const signTx = await transaction.sign(myPrivateKey);

    //Sign with the client operator private key and submit to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status;

    console.log("The transaction consensus status is " +transactionStatus);

}

main();
