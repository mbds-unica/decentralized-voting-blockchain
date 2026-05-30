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
    throw new Error("Smoke check script is intended for Sepolia only");
  }

  const contractAddress = assertEnv("DEPLOYED_CONTRACT_ADDRESS");
  const contract = await hre.ethers.getContractAt("MonContrat", contractAddress);

  const [title, deadline, count, isOpen] = await Promise.all([
    contract.electionTitle(),
    contract.votingDeadline(),
    contract.proposalCount(),
    contract.isVotingOpen()
  ]);

  console.log("Smoke check report");
  console.log("- Network:", hre.network.name);
  console.log("- Contract:", contractAddress);
  console.log("- Election title:", title);
  console.log("- Voting deadline:", Number(deadline));
  console.log("- Proposal count:", Number(count));
  console.log("- Voting open:", isOpen);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
