// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;


contract Bakery {

  // index of created contracts

  address[] public contracts;
  event num_contracts(uint num);

  // useful to know the row count in contracts index

  function getContractCount() public
  {
    emit num_contracts(contracts.length);
  }

  // deploy a new contract

  function newCookie() public returns(address newContract)
  {
    Cookie c = new Cookie();
    contracts.push(address(c));
    return address(c);
  }
}


contract Cookie {

  // suppose the deployed contract has a purpose

  function getFlavor() public returns (string memory flavor)
  {
    return "mmm ... chocolate chip";
  }    
}