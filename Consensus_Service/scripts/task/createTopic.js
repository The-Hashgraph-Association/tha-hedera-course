const {
    TopicCreateTransaction,
    Client,
    Wallet,
    PrivateKey
} = require("@hashgraph/sdk");
require('dotenv').config({ path: '../../.env' })

const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

// If we weren't able to grab it, we should throw a new error
if (myAccountId == null ||
    myPrivateKey == null ) {
    throw new Error("Environment variables myAccountId and myPrivateKey must be present");
}

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const client = Client.forTestnet();

client.setOperator(myAccountId, myPrivateKey);

const walletUser = new Wallet(
    myAccountId,
    myPrivateKey
)

async function main() {

    //Create the transaction
    let transaction = new TopicCreateTransaction()
        .setSubmitKey(walletUser.publicKey)
        .setAdminKey(walletUser.publicKey)
        .setTopicMemo('Fluffy Unicorn News');

    console.log(`Created a new TopicCreateTransaction with admin and submit key both set to: ${walletUser.publicKey}`);

    //Sign with the client operator private key and submit the transaction to a Hedera network
    let txResponse = await transaction.execute(client);

    //Get the receipt of the transaction
    let receipt = await txResponse.getReceipt(client);

    //Grab the new topic ID from the receipt
    let topicId = receipt.topicId;

    //Log the topic ID
    console.log(`Your topic ID is: ${topicId}`);

    // Wait 5 seconds between consensus topic creation and subscription
    await new Promise((resolve) => setTimeout(resolve, 5000));

}

main();
