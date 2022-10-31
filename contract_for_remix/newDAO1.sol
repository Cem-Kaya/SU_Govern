// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;

import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol';




contract MyDAO {
    
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



    // store all proposals
    mapping(uint => Proposal) public proposals;    
    //to print out proposals
    event proposal_info(uint256 id, address author, string name, string[] options, uint256[] num_options, uint256 power, string proposal_info_type);
    // who already votes for who and to avoid vote twice
    mapping(address => mapping(uint => bool)) public votes;
    mapping(address => mapping(uint => bool)) public tokens_not_refunded;
    mapping(address => mapping(uint => uint)) public token_amount_to_be_refunded;
    // one share for governance tokens
    mapping(address => uint256) public voter_shares;
    mapping(address => uint256) public yk_shares;
    uint public totalShares;
    uint public total_voter_shares;
    uint public total_yk_shares;
    // the IERC20 allow us to use avax like our governance token.
    IERC20 public voter_token;
    IERC20 public yk_token;
    // the user need minimum 25 AVAX to create a proposal.
    uint constant CREATE_PROPOSAL_MIN_SHARE = 25 * 10 ** 18;
    uint constant VOTING_PERIOD = 7 days;
    uint public nextProposalId;
    

    constructor(string memory name, address pos_yk) {
        if(pos_yk == address(0)){
            voter_token = IERC20(0xA048B6a5c1be4b81d99C3Fd993c98783adC2eF70); // AVAX address
            yk_token = IERC20(0xA048B6a5c1be4b81d99C3Fd993c98783adC2eF70); // AVAX address
        }
        else{
            voter_token = IERC20(0xA048B6a5c1be4b81d99C3Fd993c98783adC2eF70); // AVAX address
            yk_token = IERC20(0xA048B6a5c1be4b81d99C3Fd993c98783adC2eF70); // AVAX address
            //make yk token
            yk_shares[pos_yk] += (25 * 10 ** 18);
            totalShares += (25 * 10 ** 18);
            total_yk_shares += (25 * 10 ** 18);
            yk_token.transferFrom(pos_yk, address(this), (25 * 10 ** 18));
            DAO_NAME = name;
        }
    }
    

    function iterate_proposals() public //ama sanirim boyle degilde teker teker yapmamiz gerekcek cok pahali olabilir obur turlu
    {
        for(uint i=0;i<nextProposalId;i++) //degistirmedim cunku artik sirf bunu kullaniriz yani
        {
            emit proposal_info(proposals[i].id, proposals[i].author, proposals[i].name, proposals[i].options, proposals[i].options_num, proposals[i].power, proposals[i].proposal_info_type);
            if(proposals[i].status != Status.Pending){ //if the proposal has ended
                if(tokens_not_refunded[msg.sender][i] == true){ //if i have voted in this one and my tokens haven't been refunded yet
                    tokens_not_refunded[msg.sender][i] = false;
                    deposit_voter_tokens(token_amount_to_be_refunded[msg.sender][i]);
                }

            }
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

    function deposit_voter(uint _amount) external {
        voter_shares[msg.sender] += _amount;
        totalShares += _amount;
        total_voter_shares += _amount;
        voter_token.transferFrom(msg.sender, address(this), _amount);
    }
 /** since we need 25 tokens to vote and one token is 25 wei so 25 * 10^18 shares */
    function deposit_voter_tokens(uint _amount) public {
        voter_shares[msg.sender] += (_amount * 10 ** 18);
        totalShares += (_amount * 10 ** 18);
        total_voter_shares += (_amount * 10 ** 18);
        voter_token.transferFrom(msg.sender, address(this), (_amount * 10 ** 18));
    }
        
    
    function withdraw_voter(uint _amount) external {
        require(voter_shares[msg.sender] >= _amount, 'Not enough shares');
        voter_shares[msg.sender] -= _amount;
        totalShares -= _amount;
        total_voter_shares -= _amount;
        voter_token.transfer(msg.sender, _amount);
    }

    function withdraw_voter_tokens(uint _amount) public {
        require(voter_shares[msg.sender] >= _amount, 'Not enough shares');
        voter_shares[msg.sender] -= (_amount * 10 ** 18);
        totalShares -= (_amount * 10 ** 18);
        total_voter_shares -= (_amount * 10 ** 18);
        voter_token.transfer(msg.sender, (_amount * 10 ** 18));
    }    

    function deposit_yk(uint _amount) external {
        yk_shares[msg.sender] += _amount;
        totalShares += _amount;
        total_yk_shares += _amount;
        yk_token.transferFrom(msg.sender, address(this), _amount);

    }

    function deposit_yk_tokens(uint _amount) external {
        yk_shares[msg.sender] += (_amount * 10 ** 18);
        totalShares += (_amount * 10 ** 18);
        total_yk_shares += (_amount * 10 ** 18);
        yk_token.transferFrom(msg.sender, address(this), (_amount * 10 ** 18));
    }
        
    
    function withdraw_yk(uint _amount) external {
        require(yk_shares[msg.sender] >= _amount, 'Not enough shares');
        yk_shares[msg.sender] -= _amount;
        totalShares -= _amount;
        total_yk_shares -= _amount;
        yk_token.transfer(msg.sender, _amount);
    }

    function withdraw_yk_tokens(uint _amount) external {
        require(yk_shares[msg.sender] >= _amount, 'Not enough shares');
        yk_shares[msg.sender] -= (_amount * 10 ** 18);
        totalShares -= (_amount * 10 ** 18);
        total_yk_shares -= (_amount * 10 ** 18);
        yk_token.transfer(msg.sender, (_amount * 10 ** 18));
    }    
    

    function createProposal(string memory name, string[] memory _options, uint256[] memory _options_num, uint256 _power, uint256 _type) external {
        // validate the user has enough shares to create a proposal
        require(yk_shares[msg.sender] >= CREATE_PROPOSAL_MIN_SHARE, 'Not enough shares to create a proposal');
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
    }      


    function vote_power(uint _proposalId, string[] memory _vote, uint[] memory _power) external {
        Proposal storage proposal = proposals[_proposalId];
        //require(votes[msg.sender][_proposalId] == false, 'already voted');
        //i check if the user is a yk or has voter shares
        require(voter_shares[msg.sender] > 0, 'Not enough shares to vote on a proposal');
        tokens_not_refunded[msg.sender][_proposalId] = true;
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
        votes[msg.sender][_proposalId] = true;

        for(uint i=0;i<proposal.options.length;i++)
        {
            for(uint y=0; y<_vote.length; y++){
                if(stringsEquals(proposal.options[i], _vote[y])){
                    proposal.options_num[i]+= _power[y];
                }
            }
        }
        if(voter_shares[msg.sender]>0){
            withdraw_voter_tokens(1);   
            token_amount_to_be_refunded[msg.sender][_proposalId] = 1;
    
        }
        
    }  

    function vote_power_weighted(uint _proposalId, string[] memory _vote, uint[] memory _power) external {
        Proposal storage proposal = proposals[_proposalId];
        //require(votes[msg.sender][_proposalId] == false, 'already voted');
        //i check if the user is a yk or has voter shares
        require(voter_shares[msg.sender] > 0, 'Not enough shares to vote on a proposal');
        tokens_not_refunded[msg.sender][_proposalId] = true;
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
        votes[msg.sender][_proposalId] = true;

        uint vote_weight = voter_shares[msg.sender] / (10 ** 18); 

        for(uint i=0;i<proposal.options.length;i++)
        {
            for(uint y=0; y<_vote.length; y++){
                if(stringsEquals(proposal.options[i], _vote[y])){
                    proposal.options_num[i]+= _power[y] * vote_weight;
                }
            }
        }
        if(voter_shares[msg.sender]>0){
            uint voter_token_number = voter_shares[msg.sender] / (10 ** 18);
            withdraw_voter_tokens(voter_token_number); 
            token_amount_to_be_refunded[msg.sender][_proposalId] = voter_token_number;

                  
        }
        
    }   
}                   


      
    /**function vote_weighted(uint _proposalId, VotingOptions _vote) external {
        Proposal storage proposal = proposals[_proposalId];
        require(votes[msg.sender][_proposalId] == false, 'already voted');
        require(block.timestamp <= proposal.createdAt + VOTING_PERIOD, 'Voting period is over');
        votes[msg.sender][_proposalId] = true;
        if(_vote == VotingOptions.Yes) {
           /** proposal.votesForYes += shares[msg.sender];*/
            /**if(shares[msg.sender] >= CREATE_PROPOSAL_MIN_SHARE ){
             proposal.votesForYes += 3;
            }
            if(shares[msg.sender] < CREATE_PROPOSAL_MIN_SHARE){
                proposal.votesForYes += 1;
            }

            if(proposal.votesForYes * 100 / totalShares > 50) {
                proposal.status = Status.Accepted;
            }
        } else {
            /**proposal.votesForNo += shares[msg.sender];*/
            /**if(shares[msg.sender] >= CREATE_PROPOSAL_MIN_SHARE ){
                proposal.votesForNo += 3;
            }
            if(shares[msg.sender] < CREATE_PROPOSAL_MIN_SHARE){
                proposal.votesForNo += 1;
            }            
            if(proposal.votesForNo * 100 / totalShares > 50) {
                proposal.status = Status.Rejected;
            }
        }
    } 
    */   
