const {
    TransferTransaction,
    Client,
    ScheduleCreateTransaction,
    PrivateKey,
    Hbar
} = require("@hashgraph/sdk");
require('dotenv').config({ path: 'Scheduled_TX/.env' });

// ------------------ Get ENV variables and validate them --------------------

const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKeyString = process.env.MY_PRIVATE_KEY;

const otherAccountId = process.env.OTHER_ACCOUNT_ID;
const otherAccountId2 = process.env.OTHER_ACCOUNT_ID_2;

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

    //Create a transaction to schedule
    const transaction = new TransferTransaction()
        .addHbarTransfer(otherAccountId, Hbar.fromTinybars(-100))
        .addHbarTransfer(otherAccountId2, Hbar.fromTinybars(100));

    //Schedule a transaction
    const scheduleTransaction = await new ScheduleCreateTransaction()
        .setScheduledTransaction(transaction)
        .setScheduleMemo("Scheduled Transaction Demo!")
        .setAdminKey(myPrivateKey)
        .execute(client);

    //Get the receipt of the transaction
    const receipt = await scheduleTransaction.getReceipt(client);

    //Get the schedule ID
    const scheduleId = receipt.scheduleId;
    console.log("The schedule ID is " +scheduleId);

    //Get the scheduled transaction ID
    const scheduledTxId = receipt.scheduledTransactionId;
    console.log("The scheduled transaction ID is " +scheduledTxId.toString());

    process.exit();
}

main();
