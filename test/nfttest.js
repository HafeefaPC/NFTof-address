const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UserDataNFT", function () {
    let userDataNFT;
    let owner, addr1, addr2;

    beforeEach(async function () {
        // Get contract factory and deploy it
        const UserDataNFT = await ethers.getContractFactory("UserDataNFT");
        userDataNFT = await UserDataNFT.deploy();
        await userDataNFT.deployed();

        // Get test accounts
        [owner, addr1, addr2] = await ethers.getSigners();
    });

    it("Should create a new UserData NFT", async function () {
        const name = "John Doe";
        const addressDetails = "123 Main St";
        const email = "johndoe@example.com";
        const age = 30;

        // Create a new NFT
        await userDataNFT.createUserDataNFT(name, addressDetails, email, age);

        // Check if the NFT was minted successfully
        expect(await userDataNFT.tokenCounter()).to.equal(1);

        // Verify the stored data
        const userData = await userDataNFT.getUserData(0);
        expect(userData.name).to.equal(name);
        expect(userData.addressDetails).to.equal(addressDetails);
        expect(userData.email).to.equal(email);
        expect(userData.age).to.equal(age);
    });

    it("Should return the correct owner of the NFT", async function () {
        const name = "Jane Doe";
        const addressDetails = "456 Another St";
        const email = "janedoe@example.com";
        const age = 28;

        // Create a new NFT from addr1
        await userDataNFT.connect(addr1).createUserDataNFT(name, addressDetails, email, age);

        // Check the owner of the tokenId 0
        const ownerAddress = await userDataNFT.getNFTOwner(0);
        expect(ownerAddress).to.equal(addr1.address);
    });

    it("Should fail to create an NFT without valid data", async function () {
        await expect(
            userDataNFT.createUserDataNFT("", "", "", 0)
        ).to.be.revertedWith("Invalid data");
    });
});
