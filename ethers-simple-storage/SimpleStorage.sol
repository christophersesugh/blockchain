// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract SimpleStorage {
    uint256 public favNumber;

    function store(uint256 _favNumber) public {
        favNumber = _favNumber;
    }

    function retrieve() public view returns (uint256) {
        return favNumber;
    }

    struct People {
        string name;
        uint256 favNum;
    }

    People[] public person;

    mapping(string => uint256) public nameToFav;

    function addPerson(string memory _name, uint256 _favNum) public {
        People memory newPerson = People({name: _name, favNum: _favNum});
        nameToFav[_name] = _favNum;
        person.push(newPerson);
    }
}
