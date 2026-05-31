// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title Decentralized voting contract
/// @notice Owner creates proposals, voters can vote once before the deadline.
contract MonContrat is Ownable {
    struct Proposal {
        string title;
        string description;
        uint256 voteCount;
    }

    string public electionTitle;
    uint256 public votingDeadline;

    Proposal[] private _proposals;
    mapping(address => bool) public hasVoted;
    mapping(address => uint256) public votedProposalId;

    event ProposalCreated(uint256 indexed proposalId, string title, string description);
    event Voted(address indexed voter, uint256 indexed proposalId);

    constructor(string memory electionTitle_, uint256 votingDeadline_) Ownable(msg.sender) {
        require(votingDeadline_ > block.timestamp, "Deadline must be in the future");
        electionTitle = electionTitle_;
        votingDeadline = votingDeadline_;
    }

    modifier onlyWhileVotingOpen() {
        require(block.timestamp < votingDeadline, "Voting is closed");
        _;
    }

    function createProposal(
        string calldata title,
        string calldata description
    ) external onlyOwner onlyWhileVotingOpen {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");

        _proposals.push(Proposal({title: title, description: description, voteCount: 0}));
        emit ProposalCreated(_proposals.length - 1, title, description);
    }

    function vote(uint256 proposalId) external onlyWhileVotingOpen {
        require(!hasVoted[msg.sender], "You already voted");
        require(proposalId < _proposals.length, "Invalid proposal");

        hasVoted[msg.sender] = true;
        votedProposalId[msg.sender] = proposalId;
        _proposals[proposalId].voteCount += 1;

        emit Voted(msg.sender, proposalId);
    }

    function proposalCount() external view returns (uint256) {
        return _proposals.length;
    }

    function getProposal(uint256 proposalId)
        external
        view
        returns (string memory title, string memory description, uint256 voteCount, bool isOpen)
    {
        require(proposalId < _proposals.length, "Invalid proposal");
        Proposal storage proposal = _proposals[proposalId];
        return (proposal.title, proposal.description, proposal.voteCount, block.timestamp < votingDeadline);
    }

    function getAllProposals()
        external
        view
        returns (Proposal[] memory)
    {
        return _proposals;
    }

    function isVotingOpen() external view returns (bool) {
        return block.timestamp < votingDeadline;
    }
}
