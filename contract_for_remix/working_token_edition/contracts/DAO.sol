// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./token.sol";
contract MyDAO {
    string dao_name;
    string dao_symbol;
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
    mapping(address => bool) public can_use_yk;

    // store all proposals
    mapping(uint => Proposal) public proposals;
    // who already votes for who and to avoid vote twice
    mapping(address => mapping(uint => bool)) public votes;
    // one share for governance tokens
    mapping(address => uint256) public shares;
    uint public totalShares;
    // the IERC20 allow us to use avax like our governance token.
    ERC20 public token;
    // the user need minimum 25 AVAX to create a proposal.
    uint constant CREATE_PROPOSAL_MIN_SHARE = 5* 10**18;
    uint constant VOTING_PERIOD = 7 days;
    uint public nextProposalId;
    
    constructor(string memory _dao_name, string memory _dao_symbol, address first_yk, ERC20 token_in) {
        dao_name = _dao_name;
        dao_symbol = _dao_symbol;
        token = token_in; // AVAX address
        shares[first_yk] += 1000 * 10**18;
        totalShares += 1000 * 10 ** 18;
        
    }
    
    function deposit(uint _amount) external {
        shares[msg.sender] += _amount * 10**18;
        totalShares += _amount * 10 ** 18;
        token.transferFrom(msg.sender, address(this), _amount* 10**18);
    }
    
    function withdraw(uint _amount) external {
        require(shares[msg.sender] >= _amount* 10**18, 'Not enough shares');
        shares[msg.sender] -= _amount* 10**18;
        totalShares -= _amount* 10**18;
        token.transfer(msg.sender, _amount* 10**18);
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
    function vote(uint _proposalId, VotingOptions _vote) external {
        Proposal storage proposal = proposals[_proposalId];
        require(votes[msg.sender][_proposalId] == false, 'already voted');
        require(block.timestamp <= proposal.createdAt + VOTING_PERIOD, 'Voting period is over');
        votes[msg.sender][_proposalId] = true;
        if(_vote == VotingOptions.Yes) {
            proposal.votesForYes += shares[msg.sender];
            if(proposal.votesForYes * 100 / totalShares > 50) {
                proposal.status = Status.Accepted;
            }
        } else {
            proposal.votesForNo += shares[msg.sender];
            if(proposal.votesForNo * 100 / totalShares > 50) {
                proposal.status = Status.Rejected;
            }
        }
    }
}