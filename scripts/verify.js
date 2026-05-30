const hre = require("hardhat");

function assertEnv(name) {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

function getVotingDeadline() {
  const raw = process.env.VOTING_DEADLINE;
  const now = Math.floor(Date.now() / 1000);

  if (!raw || raw.trim() === "") {
    return now + 7 * 24 * 60 * 60;
  }

  const parsed = Number(raw);
  if (!Number.isInteger(parsed)) {
    throw new Error("VOTING_DEADLINE must be a unix timestamp in seconds");
  }

  return parsed;
}

async function main() {
  if (hre.network.name !== "sepolia") {
    throw new Error("Verification script is intended for Sepolia only");
  }

  const contractAddress = assertEnv("DEPLOYED_CONTRACT_ADDRESS");
  const electionTitle = process.env.ELECTION_TITLE || "Decentralized Vote";
  const votingDeadline = getVotingDeadline();

  console.log("Verifying contract:", contractAddress);
  console.log("Network:", hre.network.name);

  await hre.run("verify:verify", {
    address: contractAddress,
    constructorArguments: [electionTitle, votingDeadline]
  });

  console.log("Verification completed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
