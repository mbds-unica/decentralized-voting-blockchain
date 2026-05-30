const hre = require("hardhat");

function assertEnv(name) {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

function assertPrivateKey(privateKey) {
  if (!/^0x[0-9a-fA-F]{64}$/.test(privateKey)) {
    throw new Error("PRIVATE_KEY must be a 32-byte hex string prefixed with 0x");
  }
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

  // Keep at least a small safety buffer to avoid near-expired deployments.
  if (parsed <= now + 300) {
    throw new Error("VOTING_DEADLINE must be at least 5 minutes in the future");
  }

  return parsed;
}

async function main() {
  const sepoliaRpcUrl = assertEnv("SEPOLIA_RPC_URL");
  const privateKey = assertEnv("PRIVATE_KEY");
  assertPrivateKey(privateKey);

  if (hre.network.name === "sepolia" && !/^https?:\/\//.test(sepoliaRpcUrl)) {
    throw new Error("SEPOLIA_RPC_URL must start with http:// or https://");
  }

  const electionTitle = process.env.ELECTION_TITLE || "Decentralized Vote";
  const votingDeadline = getVotingDeadline();

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Target network:", hre.network.name);

  const MonContrat = await hre.ethers.getContractFactory("MonContrat");
  const contract = await MonContrat.deploy(electionTitle, votingDeadline);
  await contract.waitForDeployment();

  console.log("MonContrat deployed to:", await contract.getAddress());
  console.log("Election title:", electionTitle);
  console.log("Voting deadline:", votingDeadline);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
