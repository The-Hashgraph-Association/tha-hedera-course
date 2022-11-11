const {
    PrivateKey,
    TopicMessageSubmitTransaction,
    Client
} = require("@hashgraph/sdk");
require('dotenv').config({ path: 'Consensus_Service/.env' });

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
    // Send one message
    let sendResponse = await new TopicMessageSubmitTransaction({
        topicId: topicId,
        message: "This is a very first message to my new topic!",
    }).execute(client);

    //Get the receipt of the transaction
    const getReceipt = await sendResponse.getReceipt(client);

    //Get the status of the transaction
    const transactionStatus = getReceipt.status;
    console.log("The message transaction status: " + transactionStatus);

    process.exit();
}

main();
