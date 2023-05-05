const {
    ScheduleSignTransaction,
    Client,
    PrivateKey
} = require("@hashgraph/sdk");
require('dotenv').config({ path: 'Scheduled_TX/.env' });

// ------------------ Get ENV variables and validate them --------------------

const otherAccountId = process.env.OTHER_ACCOUNT_ID;
const otherPrivateKeyString = process.env.OTHER_PRIVATE_KEY;

const scheduleId = process.env.SCHEDULE_ID;

// If we weren't able to grab it, we should throw a new error
if (otherAccountId == null ||
    otherPrivateKeyString == null ) {
    throw new Error("Environment variables myAccountId and myPrivateKey must be present");
}

const otherPrivateKey = PrivateKey.fromString(otherPrivateKeyString);

// -------------------------- Set up testnet client --------------------------

const client = Client.forTestnet();
client.setOperator(otherAccountId, otherPrivateKey);

// ---------------------------------------------------------------------------

async function main() {

    //Create the transaction
    const transaction = await new ScheduleSignTransaction()
        .setScheduleId(scheduleId)
        .freezeWith(client)
        .sign(otherPrivateKey);

    //Sign with the client operator key to pay for the transaction and submit to a Hedera network
    const txResponse = await transaction.execute(client);

    //Get the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction status
    const transactionStatus = receipt.status;
    console.log("The transaction consensus status is " +transactionStatus.toString());

    process.exit();
}

main();
