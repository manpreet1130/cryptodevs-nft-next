// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./IWhitelist.sol";


contract NFT is Ownable, ERC721Enumerable {
    event PresaleStarted(uint256 indexed startTime);
    event Mint(uint256 indexed tokenId, address indexed to);

    uint256 public total;
    uint256 public tokenId;
    string public baseURI;
    mapping(address => uint256) public ownerOfTokenId;
    uint256 public presaleMintPrice;
    uint256 public publicMintPrice;
    uint256 public totalPresaleTime;
    bool public hasPresaleStarted;
    bool public hasPresaleEnded;
    uint256 public presaleStartTime;
    uint256 public presaleEndTime;
    bool public paused;

    IWhitelist whitelist; // 0x204d0E513C657fdDF1e7FC0e097268C40bD7a4d0

    constructor(string memory _name, string memory _symbol, string memory _baseURI, address _whitelist) ERC721(_name, _symbol) {
        total = 20;
        baseURI = _baseURI;
        tokenId = 1;
        presaleMintPrice = 0.05 ether;
        publicMintPrice = 0.1 ether;
        totalPresaleTime = 5 minutes;
        whitelist = IWhitelist(_whitelist);
    }

    modifier ifNotPaused {
        if(paused) {
            revert("contract is in paused state");
        }
        _;
    }

    // start presale
    function startPresale() external onlyOwner {
        require(!hasPresaleStarted, "presale has already started");
        presaleStartTime = block.timestamp;
        presaleEndTime = block.timestamp + totalPresaleTime;
        emit PresaleStarted(presaleStartTime);
    }

    // presale mint
    function presaleMint() external payable ifNotPaused {
        require(hasPresaleStarted, "presale hasn't started yet");
        require(!hasPresaleEnded, "presale has already ended");
        require(tokenId <= total, "sold out");
        require(whitelist.whitelistedAddresses(msg.sender), "not on the whitelist, wait for the public sale");
        require(ownerOfTokenId[msg.sender] == 0, "already minted an nft, one per address applciable...");
        require(msg.value >= presaleMintPrice, "presale mint price is 0.05 ether");

        mintNFT(msg.sender);
    }

    // public mint
    function publicMint() external payable ifNotPaused {
        require(hasPresaleStarted, "presale hasn't started yet");
        require(hasPresaleEnded, "presale hasn't ended yet");
        require(tokenId <= total, "sold out");
        require(ownerOfTokenId[msg.sender] == 0, "already minted an nft, one per address applciable...");
        require(msg.value >= publicMintPrice, "public mint price is 0.1 ether");

        mintNFT(msg.sender);
    }

    function mintNFT(address _minter) internal {
        _safeMint(_minter, tokenId);
        ownerOfTokenId[msg.sender] = tokenId;
        emit Mint(tokenId, msg.sender);
        tokenId += 1;
    }

    // pause
    function pauseContract() external onlyOwner {
        require(!paused, "contract already in pause state");
        paused = true;
    }

    // withdraw
    function withdraw() external onlyOwner {
        (bool success, ) = msg.sender.call{
            value: address(this).balance
        }("");
        require(success, "error while withdrawing");
    }

    receive() external payable {}
    fallback() external payable {}
}