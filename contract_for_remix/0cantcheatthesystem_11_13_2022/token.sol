// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SUToken is ERC20, Ownable {

    //mapping (uint => mapping(address => bool)) public proposalid_to_address_cantusetoken;
    mapping (address => mapping(uint256 => bool)) public address_proposals_cant_vote_on;
    uint256 public proposal_num;
    address public myDAO;
    


    constructor(string memory name, string memory symbol, address owner) ERC20(name, symbol) {
        _mint(owner, 1000 * 10 ** decimals());
        proposal_num = 0;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        //bu function cagirilan, _mint kendisinde iste boylece degisitrebliyorum anladin heralde
        _mint(to, amount);
    }

    function assignDAO(address in_dao) public onlyOwner{
        myDAO = in_dao;
    }

    //between people
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        for (uint i = 0; i < proposal_num; i ++ ){
            if(address_proposals_cant_vote_on[owner][i] == true){
                address_proposals_cant_vote_on[to][i] = address_proposals_cant_vote_on[owner][i];
            }
        }      
        _transfer(owner, to, amount);
        return true;
    }

    //when DAO does it
    function transferDAO(address to, uint256 amount) public returns (bool) {
        address owner = _msgSender();
        //when dao sends it this is not the case
        _transfer(owner, to, amount);
        return true;
    }

    function update_proposal_num(uint proposals) public {
        address owner = msg.sender;
        require(owner == myDAO);
        proposal_num = proposals;
    }
    //called when voted
    function proposalSafetyUpdate(address voter,  uint pid) public {
        address owner = msg.sender;
        require(owner == myDAO);
        address_proposals_cant_vote_on[voter][pid] = true;
        //this holds which address voter has voted on which pid
    }

    //called when voted
    function proposalSafetyCheck(address voter,  uint pid) public view returns (bool){
        return address_proposals_cant_vote_on[voter][pid];
        //this holds which address voter has voted on which pid
    }    

    //soyle oncelikle factory de tokenime dao adresim giriliyor, sonra ben yk olarak birine token gonderirsem bir sorun yok, ama normal 
    //bir sekilde transfer ile gonderirsem butun oyladigim proposallarda digerininkileri aliyorum, yani onun oy verdiklerine oy veremiyorum ve bu.
    //sirf true olanlarda gecerli yani bos bir adresten transferlede duzeltilemiyor, sonrasinda oy veriyorum oy verirken bu kisininki
    //oyle tutulmus mu diye  checkleniyor. sonrasinda direk ona gore geri donus aliyorum.


    //function isContract(address addr) view private returns (bool isContract) {    return addr.code.length > 0; }

}