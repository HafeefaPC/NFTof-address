// scripts/deploy.js
async function main() {
    const UserDataNFT = await ethers.getContractFactory("UserDataNFT");
    console.log("Deploying UserDataNFT...");
    const userDataNFT = await UserDataNFT.deploy();
    await userDataNFT.deployed();
    console.log("UserDataNFT deployed to:", userDataNFT.address);
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
