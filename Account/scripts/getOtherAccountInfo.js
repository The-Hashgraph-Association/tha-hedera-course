const {
    Client,
    AccountBalanceQuery
} = require("@hashgraph/sdk");

const myAccountId = "0.0.47664706";
const myPrivateKey = "302e020100300506032b657004220420c1e58e47370a0135097e843a9d56b3531b59d9265b30c12b185abcaa7570181a";

const otherAccountId = "0.0.47664706";

async function main() {
    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();

    client.setOperator(myAccountId, myPrivateKey);

    // Create the query
    const query = new AccountBalanceQuery()
     .setAccountId(otherAccountId);

    // Sign with the client operator account private key and submit to a Hedera network
    const accountBalance = await query.execute(client);

    if (accountBalance) {
        console.log(`The account balance for someone else's account ${otherAccountId} is ${accountBalance.hbars} HBar`);

        console.log("All account Info for the other account:")
        console.log(JSON.stringify(accountBalance));
    }
    
    process.exit();
}

main();
