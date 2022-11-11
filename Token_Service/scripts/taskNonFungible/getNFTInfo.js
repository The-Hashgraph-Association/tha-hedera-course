const {
    TokenNftInfoQuery,
    Client,
    PrivateKey,
    NftId,
    TokenId,
    AccountId
} = require("@hashgraph/sdk");
require('dotenv').config({ path: 'Token_Service/.env' });

const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

const tokenId = process.env.NFT_ID;

// The index of the NFT on the token object - this is the actual NFT
const NFTTokenIndex = 1;

// If we weren't able to grab it, we should throw a new error
if (myAccountId == null ||
    myPrivateKey == null ) {
    throw new Error("Environment variables myAccountId and myPrivateKey must be present");
}

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const client = Client.forTestnet();

client.setOperator(myAccountId, myPrivateKey);

async function main() {
    console.log(`Searching for NFT ID ${NFTTokenIndex} on token ${tokenId}`);
    
    //Returns the info for the specified NFT ID
    const nftInfos = await new TokenNftInfoQuery()
        .setNftId(new NftId(TokenId.fromString(tokenId), NFTTokenIndex))
        .execute(client);

    console.log("The ID of the token is: " + nftInfos[0].nftId.tokenId.toString());
    console.log("The serial of the token is: " + nftInfos[0].nftId.serial.toString());
    console.log("The metadata of the token is: " + nftInfos[0].metadata.toString());
    console.log("Current owner: " + new AccountId(nftInfos[0].accountId).toString());

    process.exit();
}

main();
