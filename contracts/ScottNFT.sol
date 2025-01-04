// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ScottNFT is ERC721A, Ownable {
    string private constant BASE_URI = "ipfs://Qmc7p1nVDaaJ7ZSqji4bwtKn65Mm76TPE5kYXhH1uuxe2A";
    uint256 public constant MAX_SUPPLY = 1000;

    event NFTMinted(address indexed owner, uint256 quantity);

    constructor() ERC721A("ScottNFT", "SCOTT") Ownable(msg.sender) {}

    function safeMint(uint256 quantity) public onlyOwner {
        require(quantity > 0, "Quantity must be greater than 0");
        require(totalSupply() + quantity <= MAX_SUPPLY, "Would exceed max supply");
        _mint(msg.sender, quantity);
        emit NFTMinted(msg.sender, quantity);
    }

    function _baseURI() internal pure override returns (string memory) {
        return BASE_URI;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721A)
        returns (string memory)
    {
        require(_exists(tokenId), "Token does not exist");
        return BASE_URI;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalMinted();
    }
}
