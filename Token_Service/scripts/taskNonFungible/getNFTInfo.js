const {
    TokenNftInfoQuery,
    TokenInfoQuery,
    Client,
    PrivateKey,
    NftId,
    TokenId,
    AccountId
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

const tokenId = process.env.NFT_ID;

// -------------------------- Set up testnet client --------------------------

const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

// ---------------------------------------------------------------------------

// The index of the NFT on the token object - this is the actual NFT
const NFTTokenIndex = 1;

async function main() {
    console.log(`Searching for NFT ID ${NFTTokenIndex} on token ${tokenId}`);
    
    // Plausibility check - has the token been set up?
    const tokenSupplyInfo = await new TokenInfoQuery().setTokenId(tokenId).execute(client);
    if (!tokenSupplyInfo || tokenSupplyInfo?.totalSupply == 0) {
        throw new Error(`Total supply on NFT ${tokenId} is 0, you need to mint something first`);
    }

    const nftId = new NftId(TokenId.fromString(tokenId), NFTTokenIndex);
    const nftInfos = await new TokenNftInfoQuery()
        .setNftId(nftId)
        .execute(client);

    console.log("The ID of the token is: " + nftInfos[0].nftId.tokenId.toString());
    console.log("The serial of the token is: " + nftInfos[0].nftId.serial.toString());
    console.log("The metadata of the token is: " + nftInfos[0].metadata.toString());
    console.log("Current owner: " + new AccountId(nftInfos[0].accountId).toString());

    process.exit();
}

main();
