const {
    TopicDeleteTransaction,
    Client,
    PrivateKey
} = require("@hashgraph/sdk");
require('dotenv').config({ path: '../../.env' });

const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
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

async function main() {
    //Create the transaction
    const transaction = await new TopicDeleteTransaction()
        .setTopicId(topicId)
        .freezeWith(client);

    //Sign the transaction with the admin key
    const signTx = await transaction.sign(myPrivateKey);

    //Sign with the client operator private key and submit to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status;

    console.log("The transaction consensus status is " +transactionStatus);

//v2.0.5

}

main();
