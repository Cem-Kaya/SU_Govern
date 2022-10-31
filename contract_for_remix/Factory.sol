// SPDX-License-Identifier: MIT
pragma solidity >0.4.23 <0.9.0;
import "./Foundation.sol";
contract FoundationFactory {
    Foundation[] private _foundations;
    function createFoundation( string memory name) public {
        Foundation foundation = new Foundation(name,msg.sender
        );

        _foundations.push(foundation);
    }
    function allFoundations(uint256 limit, uint256 offset) public view returns (Foundation[] memory coll)
    {
        return coll;
    }
}