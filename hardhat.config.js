require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const { SEPOLIA_RPC_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

function normalizePrivateKey(rawKey) {
  if (!rawKey || rawKey.trim() === "") {
    return [];
  }

  const key = rawKey.trim();
  if (!/^0x[0-9a-fA-F]{64}$/.test(key)) {
    throw new Error("Invalid PRIVATE_KEY format in .env (expected 0x + 64 hex chars)");
  }

  return [key];
}

function isRunningWithSepoliaNetwork() {
  const argv = process.argv.join(" ");
  return argv.includes("--network sepolia");
}

if (isRunningWithSepoliaNetwork()) {
  if (!SEPOLIA_RPC_URL || SEPOLIA_RPC_URL.trim() === "") {
    throw new Error("SEPOLIA_RPC_URL is required when running with --network sepolia");
  }

  if (!PRIVATE_KEY || PRIVATE_KEY.trim() === "") {
    throw new Error("PRIVATE_KEY is required when running with --network sepolia");
  }
}

module.exports = {
  solidity: "0.8.24",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    hardhat: {},
    sepolia: {
      chainId: 11155111,
      url: (SEPOLIA_RPC_URL || "").trim(),
      accounts: normalizePrivateKey(PRIVATE_KEY),
      timeout: 120000
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY || ""
  }
};
