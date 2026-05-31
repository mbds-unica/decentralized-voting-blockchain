const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MonContrat", function () {
  async function deployFixture() {
    const [owner, voter, other] = await ethers.getSigners();
    const latestBlock = await ethers.provider.getBlock("latest");
    const votingDeadline = latestBlock.timestamp + 3600;

    const MonContrat = await ethers.getContractFactory("MonContrat");
    const contract = await MonContrat.deploy("MBDS Election", votingDeadline);
    await contract.waitForDeployment();

    await contract.createProposal("Proposal A", "First proposal");
    await contract.createProposal("Proposal B", "Second proposal");

    return { contract, owner, voter, other, votingDeadline };
  }

  async function deployEmptyFixture() {
    const [owner, voter] = await ethers.getSigners();
    const latestBlock = await ethers.provider.getBlock("latest");
    const votingDeadline = latestBlock.timestamp + 3600;

    const MonContrat = await ethers.getContractFactory("MonContrat");
    const contract = await MonContrat.deploy("MBDS Election", votingDeadline);
    await contract.waitForDeployment();

    return { contract, owner, voter, votingDeadline };
  }

  it("rejects constructor deadline in the past", async function () {
    const latestBlock = await ethers.provider.getBlock("latest");
    const MonContrat = await ethers.getContractFactory("MonContrat");

    await expect(
      MonContrat.deploy("MBDS Election", latestBlock.timestamp)
    ).to.be.revertedWith("Deadline must be in the future");
  });

  it("lets the owner create proposals", async function () {
    const { contract } = await deployFixture();

    expect(await contract.proposalCount()).to.equal(2);
    const proposal = await contract.getProposal(0);
    expect(proposal.title).to.equal("Proposal A");
    expect(proposal.description).to.equal("First proposal");
    expect(proposal.voteCount).to.equal(0);
    expect(proposal.isOpen).to.equal(true);
  });

  it("rejects proposal creation from non-owners", async function () {
    const { contract, voter } = await deployFixture();

    await expect(
      contract.connect(voter).createProposal("Proposal C", "Unauthorized")
    ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount").withArgs(voter.address);
  });

  it("emits ProposalCreated when owner creates a proposal", async function () {
    const { contract } = await deployEmptyFixture();

    await expect(contract.createProposal("Proposal A", "First proposal"))
      .to.emit(contract, "ProposalCreated")
      .withArgs(0, "Proposal A", "First proposal");
  });

  it("rejects empty proposal title", async function () {
    const { contract } = await deployEmptyFixture();

    await expect(contract.createProposal("", "Description"))
      .to.be.revertedWith("Title cannot be empty");
  });

  it("rejects empty proposal description", async function () {
    const { contract } = await deployEmptyFixture();

    await expect(contract.createProposal("Proposal", ""))
      .to.be.revertedWith("Description cannot be empty");
  });

  it("allows one vote per address", async function () {
    const { contract, voter } = await deployFixture();

    await expect(contract.connect(voter).vote(0))
      .to.emit(contract, "Voted")
      .withArgs(voter.address, 0);

    expect(await contract.hasVoted(voter.address)).to.equal(true);
    expect(await contract.votedProposalId(voter.address)).to.equal(0);
    expect((await contract.getProposal(0)).voteCount).to.equal(1);
  });

  it("rejects double voting", async function () {
    const { contract, voter } = await deployFixture();

    await contract.connect(voter).vote(0);

    await expect(contract.connect(voter).vote(1)).to.be.revertedWith("You already voted");
  });

  it("rejects invalid proposal ids", async function () {
    const { contract, voter } = await deployFixture();

    await expect(contract.connect(voter).vote(99)).to.be.revertedWith("Invalid proposal");
  });

  it("rejects voting when no proposal exists", async function () {
    const { contract, voter } = await deployEmptyFixture();

    await expect(contract.connect(voter).vote(0)).to.be.revertedWith("Invalid proposal");
  });

  it("closes voting after the deadline", async function () {
    const { contract, voter, votingDeadline } = await deployFixture();

    await ethers.provider.send("evm_setNextBlockTimestamp", [votingDeadline + 1]);
    await ethers.provider.send("evm_mine");

    await expect(contract.connect(voter).vote(0)).to.be.revertedWith("Voting is closed");
    expect(await contract.isVotingOpen()).to.equal(false);
  });

  it("rejects proposal creation after deadline", async function () {
    const { contract, votingDeadline } = await deployEmptyFixture();

    await ethers.provider.send("evm_setNextBlockTimestamp", [votingDeadline + 1]);
    await ethers.provider.send("evm_mine");

    await expect(contract.createProposal("Late Proposal", "Too late"))
      .to.be.revertedWith("Voting is closed");
  });
});
