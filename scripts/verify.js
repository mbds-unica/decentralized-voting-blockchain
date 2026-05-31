const hre = require("hardhat");
const { loadDeployment, assertMatchingEnv } = require("./deploymentState");

async function main() {
  if (hre.network.name !== "sepolia") {
    throw new Error("Verification script is intended for Sepolia only");
  }

  const deployment = loadDeployment(hre.network.name);
  if (!deployment) {
    throw new Error(
      "Missing deployment metadata. Run deploy first to create deployments/sepolia.json"
    );
  }

  const { filePath, data } = deployment;
  const contractAddress = data.contractAddress;
  const electionTitle = data.electionTitle;
  const votingDeadline = Number(data.votingDeadline);

  assertMatchingEnv("DEPLOYED_CONTRACT_ADDRESS", contractAddress);
  assertMatchingEnv("ELECTION_TITLE", electionTitle);
  assertMatchingEnv("VOTING_DEADLINE", votingDeadline);

  console.log("Verifying contract:", contractAddress);
  console.log("Network:", hre.network.name);
  console.log("Using deployment metadata:", filePath);

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
