const {
    Client,
    AccountBalanceQuery
} = require("@hashgraph/sdk");

// const myAccountId = "0.0.47664706";
// const myPrivateKey = "302e020100300506032b657004220420c1e58e47370a0135097e843a9d56b3531b59d9265b30c12b185abcaa7570181a";

const myAccountId = "put your account ID here";
const myPrivateKey = "put your private key here";

async function main() {
    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();

    client.setOperator(myAccountId, myPrivateKey);

    //Create the query
    const query = new AccountBalanceQuery()
     .setAccountId(myAccountId);

    //Sign with the client operator account private key and submit to a Hedera network
    const accountBalance = await query.execute(client);

    if (accountBalance) {
        console.log(`The account balance for account ${myAccountId} is ${accountBalance.hbars} HBar`);

        console.log("All account Info:")
        console.log(JSON.stringify(accountBalance));
    }
}

main();
