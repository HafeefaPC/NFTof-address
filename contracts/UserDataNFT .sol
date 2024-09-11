// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract UserDataNFT is ERC721 {
    uint256 public tokenCounter;

    struct UserData {
        string name;
        string addressDetails;
        string email;
        uint256 age;  
    }

    mapping(uint256 => UserData) public tokenIdToUserData;

    constructor() ERC721("UserDataNFT", "UDNFT") {
        tokenCounter = 0;
    }

    function createUserDataNFT(
        string memory _name,
        string memory _addressDetails,
        string memory _email,
        uint256 _age
    ) public returns (uint256) {
        uint256 newTokenId = tokenCounter;

        _safeMint(msg.sender, newTokenId);

        tokenIdToUserData[newTokenId] = UserData(_name, _addressDetails, _email, _age);

        tokenCounter += 1;
        
        return newTokenId;
    }

    function getNFTOwner(uint256 tokenId) public view returns (address) {
        return ownerOf(tokenId);
    }
    function getUserData(uint256 tokenId) public view returns (
        string memory name,
        string memory addressDetails,
        string memory email,
        uint256 age
    ) {
        UserData memory data = tokenIdToUserData[tokenId];
        return (data.name, data.addressDetails, data.email, data.age);
    }
}
