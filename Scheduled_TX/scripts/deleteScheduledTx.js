const {
    ScheduleDeleteTransaction,
    Client,
    PrivateKey
} = require("@hashgraph/sdk");
require('dotenv').config({ path: 'Scheduled_TX/.env' });

// ------------------ Get ENV variables and validate them --------------------

const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKeyString = process.env.MY_PRIVATE_KEY;

const scheduleId = process.env.SCHEDULE_ID;
if (myAccountId == null ||
    myPrivateKeyString == null ) {
    throw new Error("Environment variables myAccountId and myPrivateKey must be present");
}

const myPrivateKey = PrivateKey.fromString(myPrivateKeyString);

// -------------------------- Set up testnet client --------------------------

const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

// ---------------------------------------------------------------------------

async function main() {
    //Create the transaction and sign with the admin key
    const transaction = await new ScheduleDeleteTransaction()
        .setScheduleId(scheduleId)
        .freezeWith(client)
        .sign(myPrivateKey);

    //Sign with the operator key and submit to a Hedera network
    const txResponse = await transaction.execute(client);

    //Get the transaction receipt
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction status
    const transactionStatus = receipt.status;
    console.log("The transaction consensus status is " +transactionStatus.toString());

    process.exit();
}

main();
