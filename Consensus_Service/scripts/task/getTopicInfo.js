const {
    TopicInfoQuery,
    Client, PrivateKey
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
    //Create the account info query
    const query = new TopicInfoQuery()
        .setTopicId(topicId);

    //Submit the query to a Hedera network
    const info = await query.execute(client);

    //Print the account key to the console
    console.log(info);
}

main();
