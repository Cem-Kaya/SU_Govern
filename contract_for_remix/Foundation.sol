// SPDX-License-Identifier: MIT
pragma solidity >0.4.23 <0.9.0;

contract Foundation {
    string public name;
    address public owner;

    constructor(string memory _name, address _owner) public {
        name = _name;
        owner = _owner;
    }
    
}