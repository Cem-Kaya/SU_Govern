// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;

import "./token.sol";
import "./newFactory1.sol";



contract MyDAO {
    string dao_name;
    string dao_symbol;
    enum VotingOptions { Yes, No }
    enum Status { Accepted, Rejected, Pending }
    string DAO_NAME;
    

    

    struct Proposal {
        uint256 id;
        address author;
        string name;
        uint256 createdAt;
        string[] options;
        uint256[] options_num;
        Status status;
        uint256 power;
        string proposal_info_type;

    }   
    

    function stringsEquals(string memory s1, string memory s2) private pure returns (bool) {
        bytes memory b1 = bytes(s1);
        bytes memory b2 = bytes(s2);
        uint256 l1 = b1.length;
        if (l1 != b2.length) return false;
        for (uint256 i=0; i<l1; i++) {
            if (b1[i] != b2[i]) return false;
        }
        return true;
    }

    DAOFactory factory;

    // store all proposals
    mapping(uint => Proposal) public proposals;    
    //to print out proposals
    event proposal_info(uint256 id, address author, string name, string[] options, uint256[] num_options, uint256 power, string proposal_info_type);
    // who already votes for who and to avoid vote twice
    mapping(address => mapping(uint => bool)) public votes;
    mapping(address => mapping(uint => bool)) public tokens_not_refunded;
    mapping(address => mapping(uint => uint)) public token_amount_to_be_refunded;
    // one share for governance tokens
    mapping(address => uint256) public voter_shares_to_be_given;
    mapping(address => uint256) public yk_shares_to_be_given;

    // the IERC20 allow us to use avax like our governance token.
    SUToken public voter_token;
    SUToken public yk_token;
    // the user need minimum 25 AVAX to create a proposal.
    uint constant CREATE_PROPOSAL_MIN_SHARE = 1 * 10 ** 18;
    uint constant VOTING_PERIOD = 7 days;
    uint public nextProposalId;
    
    mapping(address => bool) transferLock;

    constructor(string memory _dao_name, string memory _dao_symbol, address first_yk, SUToken yk_token_in, SUToken voter_token_in, DAOFactory _factory) {
        factory = _factory;
        dao_name = _dao_name;
        dao_symbol = _dao_symbol;
        yk_token = yk_token_in; // AVAX address
        voter_token = voter_token_in;

        //maybe mintabele amount can be taken as an input and 1000 yerine konabilir
        yk_shares_to_be_given[first_yk] += (1 * 10 ** 18);
        
        voter_shares_to_be_given[first_yk] += (1 * 10 ** 18);

    }

    function mint_from_DAO_yk_token(uint _amount) internal {
        factory.mint_dao_yk(this, _amount, msg.sender);
    }

    function mint_from_DAO_voter_token(uint _amount) internal {
        factory.mint_dao_voter(this, _amount, msg.sender);
    }


    function iterate_proposals() public //ama sanirim boyle degilde teker teker yapmamiz gerekcek cok pahali olabilir obur turlu
    {
        for(uint i=0;i<nextProposalId;i++) //degistirmedim cunku artik sirf bunu kullaniriz yani
        {
            if(proposals[i].status != Status.Pending){
                voter_token.update_active_voter_lock_off(i, msg.sender);
            }

            emit proposal_info(proposals[i].id, proposals[i].author, proposals[i].name, proposals[i].options, proposals[i].options_num, proposals[i].power, proposals[i].proposal_info_type);

        }
        
    }        

    function accept_proposal(uint _proposalId) external {
        proposals[_proposalId].status = Status.Accepted;
    }

    function reject_proposal(uint _proposalId) external {
        proposals[_proposalId].status = Status.Rejected;
    }    

    function pending_proposal(uint _proposalId) external {
        proposals[_proposalId].status = Status.Pending;
    }       

        


    function withdraw_voter_tokens(uint _amount) external {
        require(voter_shares_to_be_given[msg.sender] >= _amount*10**18, 'Not enough shares');
        voter_shares_to_be_given[msg.sender] -= (_amount * 10 ** 18);
        voter_token.transferDAO(msg.sender, (_amount * 10 ** 18));
        mint_from_DAO_voter_token(_amount);
    }    



    


    function withdraw_yk_tokens(uint _amount) external {
        require(yk_shares_to_be_given[msg.sender] >= _amount, 'Not enough shares');
        yk_shares_to_be_given[msg.sender] -= (_amount * 10 ** 18);
        yk_token.transferDAO(msg.sender, (_amount * 10 ** 18));
        mint_from_DAO_yk_token(_amount);

    }    
    
    function send_yk_tokens_to_address_yk(address yk_candidate, uint _amount) external {
        require(yk_token.balanceOf(msg.sender) >= 1 * 10 **18, 'Not a YK');
        //yk_shares[msg.sender] -= (_amount * 10 ** 18);
        //totalShares -= (_amount * 10 ** 18);
        //total_yk_shares -= (_amount * 10 ** 18);
        //neden olmuyor bu
        //yk_token.transfer(yk_candidate, _amount * 18 **18);
        yk_shares_to_be_given[yk_candidate] += _amount * 10 ** 18;
        //yk_token.transfer(yk_candidate, (_amount * 10 ** 18));
    } 

    function send_yk_tokens_to_address_yk_directly(address yk_candidate, uint _amount) external {
        require(yk_token.balanceOf(msg.sender) >= 1 * 10 **18, 'Not a YK');
        //yk_shares[msg.sender] -= (_amount * 10 ** 18);
        //totalShares -= (_amount * 10 ** 18);
        //total_yk_shares -= (_amount * 10 ** 18);
        //neden olmuyor bu
        //yk_token.transfer(yk_candidate, _amount * 18 **18);
        //yk_shares_to_be_given[yk_candidate] += _amount * 10 ** 18;
        //yk_token.transfer(yk_candidate, (_amount * 10 ** 18));
        yk_token.transferDAO(yk_candidate, (_amount * 10 ** 18));
        mint_from_DAO_yk_token(_amount);
    } 
 
 
    function send_voter_tokens_to_address_yk(address voter_candidate, uint _amount) external {
        require(yk_token.balanceOf(msg.sender) >= 1* 10 **18, 'Not a YK');
        //yk_shares[msg.sender] -= (_amount * 10 ** 18);
        //totalShares -= (_amount * 10 ** 18);
        //total_yk_shares -= (_amount * 10 ** 18);
        //ones above are in comments becaue this whole process is done in the contract
        voter_shares_to_be_given[voter_candidate] += _amount * 10 ** 18;
        //voter_token.transfer(voter_candidate, (_amount * 10 ** 18));
    }                   

    function send_voter_tokens_to_address_yk_directly(address voter_candidate, uint _amount) external {
        require(yk_token.balanceOf(msg.sender) >= 1* 10 **18, 'Not a YK');
        //yk_shares[msg.sender] -= (_amount * 10 ** 18);
        //totalShares -= (_amount * 10 ** 18);
        //total_yk_shares -= (_amount * 10 ** 18);
        //ones above are in comments becaue this whole process is done in the contract
        voter_token.transferDAO(voter_candidate, (_amount * 10 ** 18));
        mint_from_DAO_voter_token(_amount);

        //voter_token.transfer(voter_candidate, (_amount * 10 ** 18));
    }        
    //in yk functions token verification tokens have to be in the contract however in voter sending function 
     

    function createProposal(string memory name, string[] memory _options, uint256[] memory _options_num, uint256 _power, uint256 _type) external {
        // validate the user has enough shares to create a proposal
        require(yk_token.balanceOf(msg.sender) >= CREATE_PROPOSAL_MIN_SHARE, 'Not enough shares to create a proposal');
        string memory proposal_type;
        //sorun olursa buradan
        if(_type == 0){
            proposal_type = "normal";
        }
        else if(_type == 1){
            proposal_type = "weighted";
        }

        proposals[nextProposalId] = Proposal(
            nextProposalId,
            msg.sender,
            name,
            block.timestamp,
            _options,
            _options_num,
            Status.Pending,
            _power,
            proposal_type
        );
        nextProposalId++; //might need
        voter_token.update_proposal_num(nextProposalId);
    }      


    function vote_power(uint _proposalId, string[] memory _vote, uint[] memory _power) external {
        Proposal storage proposal = proposals[_proposalId];
        require(votes[msg.sender][_proposalId] == false, 'already voted');
        //i check if the user is a yk or has voter shares
        require(voter_token.balanceOf(msg.sender) > 0, 'Not enough shares to vote on a proposal');
        //bu alttaki sadece 1 kez oylamayi garantilemek icin, teoride bunu kullanmayacakgiz
        //requires(tokens_refunded[msg.sender][_proposalId] == false, 'Already voted);
        require(block.timestamp <= proposal.createdAt + VOTING_PERIOD, 'Voting period is over');
        require(proposals[_proposalId].status == Status.Pending, 'Voting period is finished');
        uint total_power = 0; 
        for(uint i=0;i<_power.length;i++) //checks if the amount of votes given is equal to the max amount of votes
        {
            total_power = total_power + _power[i];
        }          
        require(total_power <= proposal.power);
        bool init = false;
        //asagida yaptiklarim: iste yapiyo yazmaya usendim
        for(uint i=0;i<proposal.options.length;i++)
        {
            for(uint y=0; y<_vote.length; y++){
                
                if(stringsEquals(proposal.options[i], _vote[y])){
                    init = true;
                }
            }
        }           
        require(init == true);
        /** make sure to add the necessary require checks */

        for(uint i=0;i<proposal.options.length;i++)
        {
            for(uint y=0; y<_vote.length; y++){
                if(stringsEquals(proposal.options[i], _vote[y])){
                    proposal.options_num[i]+= _power[y];
                }
            }
        }

        votes[msg.sender][_proposalId] = true;
        voter_token.update_active_voter_lock_on(_proposalId, msg.sender);


        
    }  

    

    function vote_power_weighted(uint _proposalId, string[] memory _vote, uint[] memory _power, uint weight) external {
        Proposal storage proposal = proposals[_proposalId];
        require(votes[msg.sender][_proposalId] == false, 'already voted');
        require(weight <= (voter_token.balanceOf(msg.sender) / (10 ** 18)), "Dont have enough tokens (change weight)" );

        //i check if the user is a yk or has voter shares
        require(voter_token.balanceOf(msg.sender) > 0, "Dont have enough tokens (literally 0)");
        //bu alttaki sadece 1 kez oylamayi garantilemek icin, teoride bunu kullanmayacakgiz
        //requires(tokens_refunded[msg.sender][_proposalId] == false, 'Already voted);
        require(block.timestamp <= proposal.createdAt + VOTING_PERIOD, 'Voting period is over');
        require(proposals[_proposalId].status == Status.Pending, 'Voting period is finished');
        uint total_power = 0; 
        for(uint i=0;i<_power.length;i++) //checks if the amount of votes given is equal to the max amount of votes
        {
            total_power = total_power + _power[i];
        }          
        require(total_power <= proposal.power);
        bool init = false;
        //asagida yaptiklarim: iste yapiyo yazmaya usendim
        for(uint i=0;i<proposal.options.length;i++)
        {
            for(uint y=0; y<_vote.length; y++){
                
                if(stringsEquals(proposal.options[i], _vote[y])){
                    init = true;
                }
            }
        }           
        require(init == true);
        /** make sure to add the necessary require checks */

        

        for(uint i=0;i<proposal.options.length;i++)
        {
            for(uint y=0; y<_vote.length; y++){
                if(stringsEquals(proposal.options[i], _vote[y])){
                    proposal.options_num[i]+= _power[y] * weight;
                }
            }
        }

        votes[msg.sender][_proposalId] = true;
        voter_token.update_active_voter_lock_on(_proposalId, msg.sender);


    }   
}                   


   
