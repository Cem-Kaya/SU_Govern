// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract ExampleAPI {
    function getNumber() public returns (uint256) {}
}
 
contract Example {
 
    uint256 num;
    address parent;
 
    constructor(uint256 _num, address _parent) public {
        num = _num;
        parent = _parent;
    }
 
    function getNumber() public returns (uint256) {
        return num;
    }
 
    function getParentNumber() public returns (uint256) {
        ExampleAPI e = ExampleAPI(parent);
        return e.getNumber();
    }
 
}
 
contract ExampleFactory {
 
    function create (address parent) public {
        address NULL_ADDRESS;
        uint256 num = 0;
        if (parent != NULL_ADDRESS) {
            Example e = Example(parent);
            num = e.getNumber() + 1;
        }
        Example child = new Example(num, parent);
    }
 
}