const {
    FileContentsQuery,
    LocalProvider,
    Wallet
} = require("@hashgraph/sdk");
require('dotenv').config({ path: 'File_Service/.env' });
const fs = require('fs');
const { exit } = require("process");

if (process.env.MY_ACCOUNT_ID == null || process.env.MY_PRIVATE_KEY == null) {
    throw new Error(
        "Environment variables OPERATOR_ID, and OPERATOR_KEY are required."
    );
}

const fileId = process.env.FILE_ID;

const wallet = new Wallet(
    process.env.MY_ACCOUNT_ID,
    process.env.MY_PRIVATE_KEY,
    new LocalProvider()
);

async function main() {
    const query = new FileContentsQuery()
    .setFileId(fileId);

    const contents = await query.executeWithSigner(wallet);

    console.log(`The size of the data is ${contents.length}`);

    fs.writeFileSync('File_Service/hedera-retrieved.pdf', contents);
    
    process.exit();
}

main();
