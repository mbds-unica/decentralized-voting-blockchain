const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

function assertAddress(value) {
  const address = (value || "").trim();
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
    throw new Error(
      "DEPLOYED_CONTRACT_ADDRESS must be a valid Ethereum address in .env"
    );
  }
  return address;
}

function buildConfigContent(contractAddress, abi) {
  const abiJson = JSON.stringify(abi, null, 2);

  return `const contractConfig = {
  contractAddress: "${contractAddress}",
  network: {
    name: "sepolia",
    chainId: 11155111,
    hexChainId: "0xaa36a7"
  },
  abi: ${abiJson}
};

if (typeof window !== "undefined") {
  window.CONTRACT_CONFIG = contractConfig;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = contractConfig;
}
`;
}

function main() {
  const projectRoot = path.resolve(__dirname, "..");
  const artifactPath = path.join(
    projectRoot,
    "artifacts",
    "contracts",
    "MonContrat.sol",
    "MonContrat.json"
  );
  const outputPath = path.join(projectRoot, "front", "contractConfig.js");

  const contractAddress = assertAddress(process.env.DEPLOYED_CONTRACT_ADDRESS);

  if (!fs.existsSync(artifactPath)) {
    throw new Error(
      "Missing artifact artifacts/contracts/MonContrat.sol/MonContrat.json. Run `npm run compile` first."
    );
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  if (!Array.isArray(artifact.abi)) {
    throw new Error("Invalid artifact ABI format");
  }

  const content = buildConfigContent(contractAddress, artifact.abi);
  fs.writeFileSync(outputPath, content, "utf8");

  console.log("Updated front/contractConfig.js from .env");
  console.log("Contract address:", contractAddress);
}

main();