const {
    Client,
    PrivateKey,
    ScheduleInfoQuery,
    Timestamp,
    ScheduleId,
    AccountId
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

    //Create the query
    const query = new ScheduleInfoQuery()
        .setScheduleId(scheduleId);

    //Sign with the client operator private key and submit the query request to a node in a Hedera network
    const info = await query.execute(client);
    console.log("The scheduledId you queried for is: ", new ScheduleId(info.scheduleId).toString());
    console.log("The memo for it is: ", info.scheduleMemo);
    console.log("It got created by: ", new AccountId(info.creatorAccountId).toString());
    console.log("It got payed by: ", new AccountId(info.payerAccountId).toString());
    console.log("The expiration time of the scheduled tx is: ", new Timestamp(info.expirationTime).toDate());
    if(new Timestamp(info.executed).toDate().getTime() === new Date("1970-01-01T00:00:00.000Z").getTime()) {
        console.log("The transaction has not been executed yet.");
    } else {
        console.log("The time of execution of the scheduled tx is: ", new Timestamp(info.executed).toDate());
    }

    // Get the inner transaction and dump it out
    const innerTransaction = info.schedulableTransactionBody.cryptoTransfer;
    console.log(`Inner transaction body: ${JSON.stringify(innerTransaction)}`)

    process.exit();
}

main();
