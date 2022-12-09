// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./itoken.sol";


contract SUToken is ISUToken, ERC20, Ownable {

    //mapping (uint => mapping(address => bool)) public proposalid_to_address_cantusetoken;
    uint256 public proposal_num;
    address public myDAO;
    mapping (address => mapping(uint256 => bool)) public transferLock;
    


    constructor(string memory name, string memory symbol, address owner) ERC20(name, symbol) {
        _mint(owner, 1000 * 10 ** decimals());
        proposal_num = 0;
    }

    function mint(address to, uint256 amount) public override onlyOwner {
        //bu function cagirilan, _mint kendisinde iste boylece degisitrebliyorum anladin heralde
        _mint(to, amount);
    }

    function assignDAO(address in_dao) public override onlyOwner{
        myDAO = in_dao;
    }

    //between people
    //virtual vardi eskiden 
    function transfer(address to, uint256 amount) public override (ERC20, ISUToken) returns (bool) {
        address owner = _msgSender();
        for (uint i = 0; i < proposal_num; i ++ ){
            if(transferLock[owner][i] == true){
                //address_proposals_cant_vote_on[to][i] = address_proposals_cant_vote_on[owner][i];
                require(false , "have active voting");
            }
        }      
        _transfer(owner, to, amount);
        return true;
    }

    //when DAO does it
    function transferDAO(address to, uint256 amount) public override returns (bool) {
        address owner = _msgSender();
        require(owner == myDAO);
        //when dao sends it this is not the case
        _transfer(owner, to, amount);
        return true;
    }

    function update_proposal_num(uint proposals) public override {
        address owner = msg.sender;
        require(owner == myDAO);
        proposal_num = proposals;
    }

    function update_active_voter_lock_on(uint proposal, address sender) public override {
        address owner = msg.sender;
        require(owner == myDAO);
        transferLock[sender][proposal] = true;
    }    

    function update_active_voter_lock_off(uint proposal, address sender) public override {
        address owner = msg.sender;
        require(owner == myDAO);
        transferLock[sender][proposal] = false;
    }    
    function increaseAllowance(address spender, uint256 addedValue) public virtual override (ISUToken, ERC20) returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, allowance(owner, spender) + addedValue);
        return true;
    }

    function transferOwnership(address newOwner) public virtual override onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }



    //soyle oncelikle factory de tokenime dao adresim giriliyor, sonra ben yk olarak birine token gonderirsem bir sorun yok, ama normal 
    //bir sekilde transfer ile gonderirsem butun oyladigim proposallarda digerininkileri aliyorum, yani onun oy verdiklerine oy veremiyorum ve bu.
    //sirf true olanlarda gecerli yani bos bir adresten transferlede duzeltilemiyor, sonrasinda oy veriyorum oy verirken bu kisininki
    //oyle tutulmus mu diye  checkleniyor. sonrasinda direk ona gore geri donus aliyorum.


    //function isContract(address addr) view private returns (bool isContract) {    return addr.code.length > 0; }

}