//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./PriceConverter.sol";

error FundMe_NotOwner();

// Interfaces, libraries, then contracts
/**
 * @title Acontract for cloud funding
 * @author Christopher Sesugh
 * @notice This contract is to demo a sample funding contract
 * @dev This implements pricefeeds as our library
 */

contract FundMe {
    //Type decorations
    using PriceConverter for uint256;

    // State variables
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    address public immutable i_owner;

    AggregatorV3Interface public priceFeed;

    modifier onlyOwner() {
        //    require(msg.sender == i_owner, "Sender is not owner");
        if (msg.sender != i_owner) {
            revert FundMe_NotOwner();
        }
        _;
    }

    // FUNCTIONS
    //constructor
    //receive
    //fallback
    //external
    //public
    //internal
    //private
    //view / pure

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function fund() public payable {
        //want to be able to set a minimum fund amount in USD
        //1. how do we send eth to this contract
        require(
            msg.value.getConversionRate(priceFeed) >= MINIMUM_USD,
            "Didn't send enough funds"
        ); //1e18 = 1*10^18
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];

            //reset the funder address
            addressToAmountFunded[funder] = 0;
        }
        //reset the array
        funders = new address[](0);
        // withdraw funds

        //transfer
        //    payable(msg.sender).transfer(address(this).balance);
        //send
        //    bool sendSuccess = payable (msg.sender).send(address(this).balance);
        //    require(sendSuccess,"Send failed");
        //call (recommended)
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }
}
