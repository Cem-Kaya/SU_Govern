// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;

import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol';




contract MyDAO {
    
    enum VotingOptions { Yes, No }
    enum Status { Accepted, Rejected, Pending }
    struct Proposal {
        uint256 id;
        address author;
        string name;
        uint256 createdAt;
        uint256 votesForYes;
        uint256 votesForNo;
        Status status;
    }
    
    struct Proposal2 {
        uint256 id;
        address author;
        string name;
        uint256 createdAt;
        string[] options;
        uint256[] options_num;
        Status status;
        uint256 proposal_info_type;
    }    

    struct Proposal3 {
        uint256 id;
        address author;
        string name;
        uint256 createdAt;
        string[] options;
        uint256[] options_num;
        Status status;
        uint256 power;
        uint256 proposal_info_type;

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
    mapping(uint => Proposal2) public proposals2;
    mapping(uint => Proposal3) public proposals3;    
    //to print out proposals
    event proposal_info(uint256 id, address author, string name, uint256 votesForYes, uint256 votesForNo);
    event proposal_info2(uint256 id, address author, string name, string[] options, uint256[] num_options);
    event proposal_info3(uint256 id, address author, string name, string[] options, uint256[] num_options, uint256 power, uint256 proposal_info_type);
    // who already votes for who and to avoid vote twice
    mapping(address => mapping(uint => bool)) public votes;
    // one share for governance tokens
    mapping(address => uint256) public shares;
    uint public totalShares;
    // the IERC20 allow us to use avax like our governance token.
    IERC20 public token;
    // the user need minimum 25 AVAX to create a proposal.
    uint constant CREATE_PROPOSAL_MIN_SHARE = 25 * 10 ** 18;
    uint constant VOTING_PERIOD = 7 days;
    uint public nextProposalId;
    uint public nextProposalId2;
    
    constructor() {
        token = IERC20(0xA048B6a5c1be4b81d99C3Fd993c98783adC2eF70); // AVAX address
    }
    
    function iterate_proposals() public //ama sanirim boyle degilde teker teker yapmamiz gerekcek cok pahali olabilir obur turlu
    {
        for(uint i=0;i<nextProposalId;i++)
        {
            emit proposal_info(proposals[i].id, proposals[i].author, proposals[i].name, proposals[i].votesForYes, proposals[i].votesForNo);
        }
    }    
    
    function iterate_proposals2() public //ama sanirim boyle degilde teker teker yapmamiz gerekcek cok pahali olabilir obur turlu
    {
        for(uint i=0;i<nextProposalId2;i++)
        {
            emit proposal_info2(proposals2[i].id, proposals2[i].author, proposals2[i].name, proposals2[i].options, proposals2[i].options_num);
        }
    }    

    function iterate_proposals3() public //ama sanirim boyle degilde teker teker yapmamiz gerekcek cok pahali olabilir obur turlu
    {
        for(uint i=0;i<nextProposalId2;i++)
        {
            emit proposal_info3(proposals3[i].id, proposals3[i].author, proposals3[i].name, proposals3[i].options, proposals3[i].options_num, proposals3[i].power, proposals3[i].proposal_info_type);
        }
    }        

    function iterate_proposals_ultimate() public //ama sanirim boyle degilde teker teker yapmamiz gerekcek cok pahali olabilir obur turlu
    {
        for(uint i=0;i<nextProposalId2;i++) //degistirmedim cunku artik sirf bunu kullaniriz yani
        {
            emit proposal_info3(proposals3[i].id, proposals3[i].author, proposals3[i].name, proposals3[i].options, proposals3[i].options_num, proposals3[i].power, proposals3[i].proposal_info_type);
        }
    }        

    function deposit(uint _amount) external {
        shares[msg.sender] += _amount;
        totalShares += _amount;
        token.transferFrom(msg.sender, address(this), _amount);
    }
 /** since we need 25 tokens to vote and one token is 25 wei so 25 * 10^18 shares */
    function deposit_tokens(uint _amount) external {
        shares[msg.sender] += (_amount * 10 ** 18);
        totalShares += (_amount * 10 ** 18);
        token.transferFrom(msg.sender, address(this), (_amount * 10 ** 18));
    }
        
    
    function withdraw(uint _amount) external {
        require(shares[msg.sender] >= _amount, 'Not enough shares');
        shares[msg.sender] -= _amount;
        totalShares -= _amount;
        token.transfer(msg.sender, _amount);
    }

    function createProposal(string memory name) external {
        // validate the user has enough shares to create a proposal
        require(shares[msg.sender] >= CREATE_PROPOSAL_MIN_SHARE, 'Not enough shares to create a proposal');
        
        proposals[nextProposalId] = Proposal(
            nextProposalId,
            msg.sender,
            name,
            block.timestamp,
            0,
            0,
            Status.Pending
        );
        nextProposalId++;
    }  
    
    function createProposal2(string memory name, string[] memory _options, uint256[] memory _options_num) external {
        // validate the user has enough shares to create a proposal
        require(shares[msg.sender] >= CREATE_PROPOSAL_MIN_SHARE, 'Not enough shares to create a proposal');
        
        proposals2[nextProposalId2] = Proposal2(
            nextProposalId2,
            msg.sender,
            name,
            block.timestamp,
            _options,
            _options_num,
            Status.Pending,
            2
        );
        nextProposalId2++;
    }      

    function createProposal3(string memory name, string[] memory _options, uint256[] memory _options_num, uint256 _power) external {
        // validate the user has enough shares to create a proposal
        require(shares[msg.sender] >= CREATE_PROPOSAL_MIN_SHARE, 'Not enough shares to create a proposal');
        
        proposals3[nextProposalId2] = Proposal3(
            nextProposalId2,
            msg.sender,
            name,
            block.timestamp,
            _options,
            _options_num,
            Status.Pending,
            _power,
            3
        );
        nextProposalId2++; //might need nextproposalId3 for this
    }      

    function vote(uint _proposalId, VotingOptions _vote) external {
        Proposal storage proposal = proposals[_proposalId];
        require(votes[msg.sender][_proposalId] == false, 'already voted');
        require(block.timestamp <= proposal.createdAt + VOTING_PERIOD, 'Voting period is over');
        votes[msg.sender][_proposalId] = true;
        if(_vote == VotingOptions.Yes) {
           /** proposal.votesForYes += shares[msg.sender];*/
            proposal.votesForYes += 1;

            if(proposal.votesForYes * 100 / totalShares > 50) {
                proposal.status = Status.Accepted;
            }
        } else {
            proposal.votesForNo += 1;
            if(proposal.votesForNo * 100 / totalShares > 50) {
                proposal.status = Status.Rejected;
            }
        }
    }  

    function vote2(uint _proposalId, string memory _vote) external {
        Proposal2 storage proposal = proposals2[_proposalId];
        require(votes[msg.sender][_proposalId] == false, 'already voted');
        require(block.timestamp <= proposal.createdAt + VOTING_PERIOD, 'Voting period is over');
        bool init = false;
        for(uint i=0;i<proposal.options.length;i++)
        {
            if(stringsEquals(proposal.options[i], _vote)){
                init = true;
            }
        }           
        require(init == true);
        /** make sure to add the necessary require checks */
        votes[msg.sender][_proposalId] = true;

        for(uint i=0;i<proposal.options.length;i++)
        {
            if(stringsEquals(proposal.options[i], _vote)){
                proposal.options_num[i]+= 1;
            }
        }        
       
        
    }   

    function vote3(uint _proposalId, string memory _vote, uint _power) external {
        Proposal3 storage proposal = proposals3[_proposalId];
        require(votes[msg.sender][_proposalId] == false, 'already voted');
        require(block.timestamp <= proposal.createdAt + VOTING_PERIOD, 'Voting period is over');
        require(_power <= proposal.power);
        bool init = false;
        for(uint i=0;i<proposal.options.length;i++)
        {
            if(stringsEquals(proposal.options[i], _vote)){
                init = true;
            }
        }           
        require(init == true);
        /** make sure to add the necessary require checks */
        votes[msg.sender][_proposalId] = true;

        for(uint i=0;i<proposal.options.length;i++)
        {
            if(stringsEquals(proposal.options[i], _vote)){
                proposal.options_num[i]+= _power;
            }
        }        
       
        
    }  

    function vote3_multiplevotesedition(uint _proposalId, string[] memory _vote, uint[] memory _power) external {
        Proposal3 storage proposal = proposals3[_proposalId];
        require(votes[msg.sender][_proposalId] == false, 'already voted');
        require(block.timestamp <= proposal.createdAt + VOTING_PERIOD, 'Voting period is over');
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
       
        
    }                      
      
    function vote_weighted(uint _proposalId, VotingOptions _vote) external {
        Proposal storage proposal = proposals[_proposalId];
        require(votes[msg.sender][_proposalId] == false, 'already voted');
        require(block.timestamp <= proposal.createdAt + VOTING_PERIOD, 'Voting period is over');
        votes[msg.sender][_proposalId] = true;
        if(_vote == VotingOptions.Yes) {
           /** proposal.votesForYes += shares[msg.sender];*/
            if(shares[msg.sender] >= CREATE_PROPOSAL_MIN_SHARE ){
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
            if(shares[msg.sender] >= CREATE_PROPOSAL_MIN_SHARE ){
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
}