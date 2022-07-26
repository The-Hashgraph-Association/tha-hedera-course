const { utils } = require("ethers");
const { expect } = require("chai");

// ----------------------- contact deployment -----------------------

async function deployEsealContract() {
    console.log("Deploy NFT contract");
    const Eseal = await ethers.getContractFactory("Eseal");

    const eseal = await Eseal.deploy();
    await eseal.deployed();

    return eseal;
}

// ----------------------- contact state changing calls -----------------------

async function seal(contract, msgSender, hash) {
    console.log(`The address ${msgSender} is sealing ${hash}.`);
    return await expect(contract.connect(msgSender).seal(hash)).to.emit(contract, 'DocumentSealed');
}

async function sealReverted(contract, msgSender, hash, message) {
    console.log(`The address ${msgSender} is sealing ${hash}. It is expected to revert with: "${message}".`);
    return await expect(contract.connect(msgSender).seal(hash)).to.be.revertedWith(message);
}

async function revokeSeal(contract, msgSender, hash) {
    console.log(`The address ${msgSender} is sealing ${hash}.`);
    return await expect(contract.connect(msgSender).revokeSeal(hash)).to.emit(contract, 'DocumentRevoced');
}

async function revokeSealReverted(contract, msgSender, hash, message) {
    console.log(`The address ${msgSender} is sealing ${hash}. It is expected to revert with: "${message}".`);
    return await expect(contract.connect(msgSender).revokeSeal(hash)).to.be.revertedWith(message);
}

// ----------------------- contract getters -----------------------------------

async function getSeal(contract, hash) {
    return await contract.getSeal(hash);
}

async function checkSealRevocationStatus(contract, hash) {
    return await contract.checkSealRevocationStatus(hash);
}

module.exports = {
    deployEsealContract: deployEsealContract,

    seal:seal,
    sealReverted:sealReverted,
    revokeSeal: revokeSeal,
    revokeSealReverted: revokeSealReverted,

    getSeal: getSeal,
    checkSealRevocationStatus:checkSealRevocationStatus,

};
