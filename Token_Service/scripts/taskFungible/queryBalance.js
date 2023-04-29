const {
    Client,
    AccountBalanceQuery, PrivateKey, Wallet
} = require("@hashgraph/sdk");
require('dotenv').config({ path: 'Token_Service/.env' });

// ------------------ Get ENV variables and validate them --------------------

const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKeyString = process.env.MY_PRIVATE_KEY;

if (myAccountId == null ||
    myPrivateKeyString == null ) {
    throw new Error("Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be present");
}

const myPrivateKey = PrivateKey.fromString(myPrivateKeyString);

const recipientAccountId = process.env.OTHER_ACCOUNT_ID;
const recipientPrivateKeyString = process.env.OTHER_PRIVATE_KEY;

if (recipientAccountId == null ||
    recipientPrivateKeyString == null ) {
    throw new Error("Environment variables OTHER_ACCOUNT_ID and OTHER_PRIVATE_KEY must be present");
}

const recipientPrivateKey = PrivateKey.fromString(recipientPrivateKeyString);

const myWallet = new Wallet(
    myAccountId,
    myPrivateKey
)

const recipientWallet = new Wallet(
    recipientAccountId,
    recipientPrivateKey
);

const tokenId = process.env.TOKEN_ID;

// -------------------------- Set up testnet client --------------------------

const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

// ---------------------------------------------------------------------------

async function main() {

    const userWalletBalance = await  queryBalance(myWallet);
    const otherWalletBalance = await queryBalance(recipientWallet);

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
