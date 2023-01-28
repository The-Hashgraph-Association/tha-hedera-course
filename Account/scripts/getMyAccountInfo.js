const {
    Client,
    AccountBalanceQuery
} = require("@hashgraph/sdk");

const myAccountId = "0.0.14077";
const myPrivateKey = "70b86ec7c816795d896e64dcf6a50d84a2a8a287b6e919033a6457f3f725b211";

async function main() {
    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();

    client.setOperator(myAccountId, myPrivateKey);

    // Create the query
    const query = new AccountBalanceQuery()
     .setAccountId(myAccountId);

    // Sign with the client operator account private key and submit to a Hedera network
    const accountBalance = await query.execute(client);

    if (accountBalance) {
        console.log(`The account balance for account ${myAccountId} is ${accountBalance.hbars} HBar`);

        console.log("All account Info:")
        console.log(JSON.stringify(accountBalance));
    }

    process.exit();
}

main();
