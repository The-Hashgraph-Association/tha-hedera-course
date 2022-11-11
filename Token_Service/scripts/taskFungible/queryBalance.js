const {
    Client,
    AccountBalanceQuery, PrivateKey, Wallet
} = require("@hashgraph/sdk");
require('dotenv').config({ path: 'Token_Service/.env' });

const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

const otherAccountId = process.env.OTHER_ACCOUNT_ID;
const otherPrivateKey = PrivateKey.fromString(process.env.OTHER_PRIVATE_KEY);

const tokenId = process.env.TOKEN_ID;

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

const walletOther = new Wallet(
    otherAccountId,
    otherPrivateKey
);

async function main() {

    const userWalletBalance = await  queryBalance(walletUser);
    const otherWalletBalance = await queryBalance(walletOther);

    console.log("The balance of the user is: " + userWalletBalance.tokens.get(tokenId));
    console.log("The balance of the other user is: " + otherWalletBalance.tokens.get(tokenId));

    process.exit();
}

async function queryBalance(user) {
    //Create the query
    const balanceQuery = new AccountBalanceQuery()
        .setAccountId(user.accountId);

    //Sign with the client operator private key and submit to a Hedera network
    const tokenBalance = await balanceQuery.execute(client);

    return tokenBalance;
}

main();
