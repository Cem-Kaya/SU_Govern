// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SUToken is ERC20, Ownable {
    constructor(string memory name, string memory symbol, address owner) ERC20(name, symbol) {
        mint(owner, 1000 * 10 ** decimals());

    }

    function mint(address to, uint256 amount) public onlyOwner {
        //bu function cagirilan, _mint kendisinde iste boylece degisitrebliyorum anladin heralde
        _mint(to, amount);
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        address spender = _msgSender();
        //approve is open to change we might be causing safety issues
        _approve(from, _msgSender(), amount);
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }


}