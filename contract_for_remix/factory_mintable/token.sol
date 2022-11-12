// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SUToken is ERC20, Ownable {
    constructor(string memory name, string memory symbol, address owner) ERC20(name, symbol) {
        _mint(owner, 1000 * 10 ** decimals());

    }

    function mint(address to, uint256 amount) public onlyOwner {
        //bu function cagirilan, _mint kendisinde iste boylece degisitrebliyorum anladin heralde
        _mint(to, amount);
    }

  

}