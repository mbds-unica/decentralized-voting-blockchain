const hre = require("hardhat");

function assertEnv(name) {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

async function main() {
  if (hre.network.name !== "sepolia") {
    throw new Error("Seed script is intended for Sepolia only");
  }

  const contractAddress = assertEnv("DEPLOYED_CONTRACT_ADDRESS");
  const contract = await hre.ethers.getContractAt("MonContrat", contractAddress);
  const proposalCount = Number(await contract.proposalCount());

  if (proposalCount > 0) {
    throw new Error(`Contract already has ${proposalCount} proposal(s); aborting seed to avoid duplicates`);
  }

  const proposals = [
    {
      title: "Adopt On-Chain Final Vote",
      description: "Validate the decentralized voting workflow for the MBDS final project demonstration."
    },
    {
      title: "Publish GitHub Pages Front-End",
      description: "Decide whether the project front-end should be deployed publicly on GitHub Pages before submission."
    },
    {
      title: "Include Extended Test Suite",
      description: "Decide whether extended edge-case tests should be part of the final delivery package."
    }
  ];

  console.log("Seeding proposals into:", contractAddress);
  console.log("Proposal count before seed:", proposalCount);

  for (const proposal of proposals) {
    const tx = await contract.createProposal(proposal.title, proposal.description);
    await tx.wait();
    console.log(`Created proposal: ${proposal.title}`);
  }

  const finalCount = Number(await contract.proposalCount());
  console.log("Proposal count after seed:", finalCount);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
