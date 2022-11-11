const { expect } = require("chai");
const { ethers } = require("hardhat");
const testUtilsEseal = require("./testUtils/esealUtils");

describe("Eseal sealing functionality", function () {
    it("Should allow an user to seal a new document which is then checked as valid", async function () {
        // create a wallet with ethers.getSigners();
        const [sealerOne] = await ethers.getSigners();
        // deploy the eseal contract and create a hash to store
        const eseal = await testUtilsEseal.deployEsealContract();
        const hash = "11e55b3d19c9de09ebb78cc68df5a621af9722f75c1a7ba559091693301c9339";
        // call the seal function
        await testUtilsEseal.seal(eseal, sealerOne, hash);
        // check if the sealed hash exists
        const seal = await testUtilsEseal.getSeal(eseal, hash);
        expect(seal.sealOwner === sealerOne);
        expect(seal.sealingBlock === 2);
        expect(seal.revokingBlock === 0);
        // check if the sealed hash is valid
        const revocationStatus = await testUtilsEseal.checkSealRevocationStatus(eseal, hash);
        expect(revocationStatus === false);
    });

    it("Should not allow an user to seal an already existing document", async function () {
        const [sealerOne, sealerTwo] = await ethers.getSigners();

        const eseal = await testUtilsEseal.deployEsealContract();
        const hash = "11e55b3d19c9de09ebb78cc68df5a621af9722f75c1a7ba559091693301c9339";

        await testUtilsEseal.seal(eseal, sealerOne, hash);

        await testUtilsEseal.sealReverted(eseal, sealerTwo, hash, "This document has already been sealed before");
    });

    it("Should allow an user to revoke a seal if he is the owner", async function () {
        const [sealerOne] = await ethers.getSigners();

        const eseal = await testUtilsEseal.deployEsealContract();
        const hash = "11e55b3d19c9de09ebb78cc68df5a621af9722f75c1a7ba559091693301c9339";

        await testUtilsEseal.seal(eseal, sealerOne, hash);

        let seal = await testUtilsEseal.getSeal(eseal, hash);
        expect(seal.sealOwner === sealerOne);
        expect(seal.sealingBlock === 2);
        expect(seal.revokingBlock === 0);

        let revocationStatus = await testUtilsEseal.checkSealRevocationStatus(eseal, hash);
        expect(revocationStatus === false);

        await testUtilsEseal.revokeSeal(eseal, sealerOne, hash);

        seal = await testUtilsEseal.getSeal(eseal, hash);
        expect(seal.sealOwner === sealerOne);
        expect(seal.sealingBlock === 2);
        expect(seal.revokingBlock === 8);

        revocationStatus = await testUtilsEseal.checkSealRevocationStatus(eseal, hash);
        expect(revocationStatus === true);
    });

    it("Should not allow an user to revoke a seal if he is not the owner", async function () {
        const [sealerOne, sealerTwo] = await ethers.getSigners();

        const eseal = await testUtilsEseal.deployEsealContract();
        const hash = "11e55b3d19c9de09ebb78cc68df5a621af9722f75c1a7ba559091693301c9339";

        await testUtilsEseal.seal(eseal, sealerOne, hash);

        let seal = await testUtilsEseal.getSeal(eseal, hash);
        expect(seal.sealOwner === sealerOne);
        expect(seal.sealingBlock === 2);
        expect(seal.revokingBlock === 0);

        let revocationStatus = await testUtilsEseal.checkSealRevocationStatus(eseal, hash);
        expect(revocationStatus === false);

        await testUtilsEseal.revokeSealReverted(eseal, sealerTwo, hash, "Only the owner of the seal can call this function");
    });

});
