const {
    Client,
    AccountBalanceQuery,
    TransferTransaction,
    Hbar
} = require("@hashgraph/sdk");

// const myAccountId = "0.0.48813362";
// const myPrivateKey = "9dcc33fcdea6bbe71ccd45012743518767c144c057824f8228f6abfc5be1fb4e";

const myAccountId = "put your account ID here";
const myPrivateKey = "put your private key here";

const otherAccountId = "0.0.47664706";

async function main() {
    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();

    client.setOperator(myAccountId, myPrivateKey);

    // Create the transfer transaction
    const transaction = new TransferTransaction()
    .addHbarTransfer(myAccountId, new Hbar(-10))
    .addHbarTransfer(otherAccountId, new Hbar(10));
    
    console.log(`Doing transfer from ${myAccountId} to ${otherAccountId}`);
    
    // Sign with the client operator key and submit the transaction to a Hedera network
    const txId = await transaction.execute(client);

    // console.log(JSON.stringify(txId));

    // Request the receipt of the transaction
    const receipt = await txId.getReceipt(client);

    // Get the transaction consensus status
    const transactionStatus = receipt.status;

    console.log("The transaction consensus status is " + transactionStatus);

    // Create the queries
    const queryMine = new AccountBalanceQuery().setAccountId(myAccountId);
    const queryOther = new AccountBalanceQuery().setAccountId(otherAccountId);

    const accountBalanceMine = await queryMine.execute(client);
    const accountBalanceOther = await queryOther.execute(client);

    console.log(`My account balance ${accountBalanceMine.hbars} HBar, other account balance ${accountBalanceOther.hbars}`);
}

main();
