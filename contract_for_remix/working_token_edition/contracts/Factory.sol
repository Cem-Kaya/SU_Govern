// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;
import "./DAO.sol";
import "./token.sol";

contract DAOFactory {

 
    MyDAO[] public _child_daos;
    //address[] public dao_creators_top;
    mapping(address => bool) public is_a_dao_creator;
    mapping(MyDAO => ERC20) public dao_tokens;
    mapping(MyDAO => address) public dao_first_yk;
    mapping(ERC20 => address) public token_first_yk;
    event num_contracts(uint num);

   constructor() {

        is_a_dao_creator[msg.sender] = true; // AVAX address
        
    }

  // useful to know the row count in contracts index
    function getChildCount() public
    {
        emit num_contracts(_child_daos.length);
    }

    //so first the dao and the token will be created, factory will have the tokens and dao will have the allowance to use 
    //these tokens, the yk will be able to withdraw, send and deposit yk_tokens
    function createDAO( string memory dao_name, string memory dao_symbol) public {
        require(is_a_dao_creator[msg.sender] == true, 'Not added as a DAO Creator');
        //line below mints 1000 tokens to this factory
        ERC20 token = new SUToken(dao_name, dao_symbol, address(this));
        MyDAO c = new MyDAO(dao_name, dao_symbol, msg.sender, token);
        //token.mint(address(c), 1000*10**18);
        //with this function my dao can use the tokens my factory has however it wishes, it is currently only 1000, can add mint later
        token.increaseAllowance(address(c), 1000* 10**18);
        token.increaseAllowance(address(this), 1000* 10**18);
        dao_tokens[c] = token;
        dao_first_yk[c] = msg.sender;
        token_first_yk[token] = msg.sender;
        _child_daos.push(c);
        //token.transferFrom(msg.sender, address(c), 100 * 10**18);
        //return address(c);  implement edilebilir
        createDAO2(token, c);
    }

    function createDAO2  (ERC20 in_token, MyDAO in_dao) public{
        in_token.transferFrom(address(this), address(in_dao), 100 * 10**18);
    }

    function addCreator(address input_creator) public
    {
        is_a_dao_creator[input_creator] = true;
    }
    function allFoundations(uint256 limit, uint256 offset) public view returns (MyDAO[] memory coll)
    {
        return _child_daos;
    }
}