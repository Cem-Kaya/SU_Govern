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
    
    address[] public dao_transfers;
    mapping (address => uint256 ) public dao_transfers_value;
    mapping (address => address[]) public user_delegations;
    //below can also be called debt value
    mapping (address=> mapping(address=> uint256)) public user_delegations_value;
    //my_tokens are sendable tokens while debt tokens ssay in your wallet until they are called back.
    mapping (address => uint256) public my_tokens;
    mapping (address => uint256) public debt_tokens; 
    //all tokens the dao itself has given.
    uint256 total_my_tokens_given;
    

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
                require(false , "have active voting");
            }
        }      
        _transfer(owner, to, amount);
        my_tokens[owner] -= amount;
        debt_tokens[to] += amount;
        user_delegations_value[owner][to] += amount;
        
    }

    //when DAO does it
    function transferDAO(address to, uint256 amount) public override returns (bool) {
        address owner = _msgSender();
        require(owner == myDAO);
        //when dao sends it this is not the case
        _transfer(owner, to, amount);
        return true;
    }

    //form = b tokeni gecici olarak alan kisi to = a tokeni basta gonderen kisi 
    function delegation_single_getback(address from, address to, uint256 amount) public  returns (bool) {
        for (uint i = 0; i < proposal_num; i ++ ){
            if(transferLock[from][i] == true){
                transferLock[to][i] == true; // lockthe original owner               
            }
        }      
        _transfer(from, to, amount);
        debt_tokens[from] -= amount;
        my_tokens[to] += amount;
        user_delegations_value[to][from] -= amount;
        user_delegations[to].pop(from);
        for ( uint i = 0; i < user_delegations[to].length; i++){
            if(user_delegations[to][i] == from){
                //user_delegations[to][i];
                //string element = myArray[index];
                user_delegations[to][i] = user_delegations[to][user_delegations[to].length - 1];
                user_delegations[to].popElement();//user_delegations[to]
                break;
            }
        }
        return true;
    }
    

    //call from DAO for one person
    function clawback_dao(address to) public returns (bool) {
        
        //if the function caller is dao maybe do msg.sender
        require(_msgSender() == myDAO);
        //tmp is the user we are performing clawback on
        address tmp = to;
        if(dao_transfers_value[tmp] == 0){
            return true;
        }
        //if the user has enough transfarable tokens in their wallet
        if(my_tokens[tmp] == dao_transfers_value[tmp]){
            total_my_tokens_given -= my_tokens[tmp];
            _transfer(tmp, myDAO, my_tokens[tmp]);
            dao_transfers_value[tmp] = 0;
            my_tokens[tmp] = 0;
            return true;
        }
        else{
            //then the user must have sent tokens to other addresses so has less my_tokens currently in their wallet than the dao has sent them
            total_my_tokens_given -= my_tokens[tmp];
            _transfer(tmp, myDAO, my_tokens[tmp]);
            dao_transfers_value[tmp] -= my_tokens[tmp];
            my_tokens[tmp] = 0;
            //transfer da sey yap iste ne kadar ognderiyorsa my tokensdan cikar debt e ekle o zaman sorun yok
            //geri gonderme olayini belki koyabilirim ondada iste yine mappingde tutarim tamamiyle debt ve my_tokens olayi 
            //so here i will check all the addresses he might have sent tokens and withdraw from them to DAO 
            for(uint i = 0; i < user_transfers[tmp].length; i++){
                if(dao_transfers_value[tmp] == 0){
                    break;
                }
                address tmp_sent_to_by_user = user_transfers[tmp][i];
                //if the address message sender has sent tokens to 
                if( (user_transfers_value[tmp][tmp_sent_to_by_user] > 0) && debt_tokens[tmp_sent_to_by_user] > 0){
                    //i have enough debt tokens to give back all tokens user has sent, which should be the case
                    //if everything works well
                    total_my_tokens_given -= user_transfers_value[tmp][tmp_sent_to_by_user];
                    debt_tokens[tmp_sent_to_by_user] -= user_transfers_value[tmp][tmp_sent_to_by_user];
                    _transfer(tmp_sent_to_by_user, myDAO, user_transfers_value[tmp][tmp_sent_to_by_user]);
                    dao_transfers_value[tmp] -= user_transfers_value[tmp][tmp_sent_to_by_user];
                    user_transfers_value[tmp][tmp_sent_to_by_user] = 0;
            
                }
            }
            return true;

        }
       
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