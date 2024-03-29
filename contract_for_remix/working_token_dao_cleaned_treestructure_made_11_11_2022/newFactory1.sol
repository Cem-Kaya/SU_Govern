// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;
//import "./DAO.sol";
import "./newDAO1.sol";
import "./token.sol";


contract DAOFactory {

    address public top_dao;
    mapping(MyDAO => MyDAO[]) public parent_child_daos;
    mapping(MyDAO => uint) public num_children;
    //MyDAO[] public _child_daos;
    //address[] public dao_creators_top;
    mapping(address => bool) public is_a_dao_creator;
    mapping(MyDAO => ERC20) public dao_tokens_yk;
    mapping(MyDAO => ERC20) public dao_tokens_voter;
    mapping(MyDAO => address) public dao_first_yk;
    mapping(ERC20 => address) public token_first_yk;
    mapping(MyDAO => bool) public dao_exists;
    mapping (MyDAO => MyDAO) public child_parent;
    event num_contracts(uint num);
    
    constructor() {

        is_a_dao_creator[msg.sender] = true;   
    }

    //so first the dao and the token will be created, factory will have the tokens and dao will have the allowance to use 
    //these tokens, the yk will be able to withdraw, send and deposit yk_tokens
    function createDAOTop( string memory dao_name,  string memory dao_symbol, string memory yk_token_name, string memory yk_token_symbol, string memory voter_token_name, string memory voter_token_symbol) public {
        require(is_a_dao_creator[msg.sender] == true, 'Not added as a DAO Creator');
        //line below mints 1000 tokens to this factory, also makes factory the owner of these tokens
 
        ERC20 yk_token = new SUToken(yk_token_name, yk_token_symbol, address(this));
        ERC20 voter_token = new SUToken(voter_token_name, voter_token_symbol, address(this));
        MyDAO c = new MyDAO(dao_name, dao_symbol, msg.sender, yk_token, voter_token);
        //token.mint(address(c), 1000*10**18);
        //with this function my dao can use the tokens my factory has however it wishes, it is currently only 1000, can add mint later
        yk_token.increaseAllowance(address(c), 1000* 10**18);
        yk_token.increaseAllowance(address(this), 1000* 10**18);
        voter_token.increaseAllowance(address(c), 1000* 10**18);
        voter_token.increaseAllowance(address(this), 1000* 10**18);
        //we save which dao has which yk tokens and which voter tokens

        dao_tokens_yk[c] = yk_token;
        dao_tokens_voter[c] = voter_token;
        dao_first_yk[c] = msg.sender;
        token_first_yk[yk_token] = msg.sender;
        top_dao = address(c);
        dao_exists[c] = true;

        //tokens are minted to factory right, we are sending them to dao so they can utilize it.
        voter_token.transferFrom(address(this), address(c), 1000 * 10**18);
        yk_token.transferFrom(address(this), address(c), (1000 * 10 ** 18));
    }


    function createChildDAO( MyDAO parent, string memory dao_name,  string memory dao_symbol, string memory yk_token_name, string memory yk_token_symbol, string memory voter_token_name, string memory voter_token_symbol) public {
        require(dao_tokens_yk[parent].balanceOf(msg.sender) >= 0, 'Not a YK of parent DAO');
        //line below mints 1000 tokens to this factory, also makes factory the owner of these tokens
 
        ERC20 yk_token = new SUToken(yk_token_name, yk_token_symbol, address(this));
        ERC20 voter_token = new SUToken(voter_token_name, voter_token_symbol, address(this));
        MyDAO c = new MyDAO(dao_name, dao_symbol, msg.sender, yk_token, voter_token);
        //token.mint(address(c), 1000*10**18);
        //with this function my dao can use the tokens my factory has however it wishes, it is currently only 1000, can add mint later
        yk_token.increaseAllowance(address(c), 1000* 10**18);
        yk_token.increaseAllowance(address(this), 1000* 10**18);
        voter_token.increaseAllowance(address(c), 1000* 10**18);
        voter_token.increaseAllowance(address(this), 1000* 10**18);
        //we save which dao has which yk tokens and which voter tokens

        dao_tokens_yk[c] = yk_token;
        dao_tokens_voter[c] = voter_token;
        dao_first_yk[c] = msg.sender;
        token_first_yk[yk_token] = msg.sender;
        top_dao = address(c);
        dao_exists[c] = true;
        parent_child_daos[parent].push(c);
        num_children[parent] += 1;
        child_parent[c] = parent;
        
        

        //tokens are minted to factory right, we are sending them to dao so they can utilize it.
        voter_token.transferFrom(address(this), address(c), 1000 * 10**18);
        yk_token.transferFrom(address(this), address(c), (1000 * 10 ** 18));
    }



    function addCreator(address input_creator) public
    {
        is_a_dao_creator[input_creator] = true;
    }

}