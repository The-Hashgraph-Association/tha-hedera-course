# Hedera Course Overview

This repo holds all assets which are required for the three day course of Hedera.
It will give an introduction to the mayor functionalities of Hedera, being:

1. The Hedera Consensus Service
2. The Hedera Token Service
3. Scheduled Transactions 
4. Delpoy and interact with Solidity contracts

# Preconditions

## Testnet Access

In order to interact with the Hedera Testnet, one will need to create an account.
You can do so by visiting https://portal.hedera.com .

Once you completed the registration, you will receive a keypair for the three networks
which Hedera is currently operating on. The pairs will look like this:

```
    "accountId": "0.0.1234",
    "publicKey": "578299302a300032100f7da48026c74d86a1502b9ecdd4d69707d16032b657054dc54c63900cdd592cb714e3",
    "privateKey": "74bf327a45a6e26bbc7eb038f7e89b0ed0214ca47fe4b382360e6867202671d2"
```

## node

Make sure to have node installed. If you don't have, please follow the guide on https://nodejs.org/en/download/
for your operation system.

If you want to be able to switch between different versions of node, we recommend using nvm, which can be downloaded
here: https://github.com/nvm-sh/nvm or via npm by running ``npm i nvm``.

