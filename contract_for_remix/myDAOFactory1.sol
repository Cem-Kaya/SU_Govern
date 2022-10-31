// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;
import "./newDAO1.sol";
contract DAOFactory {
    MyDAO[] public _child_daos;
    address[] public _child_daos_addresses;
    event num_contracts(uint num);

  // useful to know the row count in contracts index
    function getChildCount() public
    {
        emit num_contracts(_child_daos_addresses.length);
    }

    function createDAO( string memory name) public {
        MyDAO c = new MyDAO(name,msg.sender);
        _child_daos.push(c);
        _child_daos_addresses.push(address(c));
        //return address(c);  implement edilebilir
    }
    function allFoundations(uint256 limit, uint256 offset) public view returns (MyDAO[] memory coll)
    {
        return _child_daos;
    }
}