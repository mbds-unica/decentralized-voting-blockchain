# Sepolia Deployment Checklist

Use this checklist to go from zero setup to a verified Sepolia contract and smoke-check report.

## 0) Safety Rules (Do first)

- [ ] Use a dedicated test wallet only (never a main wallet).
- [ ] Never share the private key or seed phrase.
- [ ] Keep .env local only (already ignored by .gitignore).
- [ ] Confirm you are targeting Sepolia, not Ethereum mainnet.

## 1) Create Required External Accounts and Keys

### 1.1 Create RPC provider project (Infura or Alchemy)

- [ ] Create an account on Infura or Alchemy.
- [ ] Create a new project/app for Sepolia.
- [ ] Copy the HTTPS Sepolia RPC URL.
- [ ] Test that the URL starts with http:// or https://.

### 1.2 Create Etherscan API key

- [ ] Sign in on Etherscan.
- [ ] Generate an API key.
- [ ] Save it securely for local .env usage.

### 1.3 Create/fund a Sepolia wallet

- [ ] Create or select a dedicated test wallet.
- [ ] Export the private key (0x + 64 hex chars).
- [ ] Get Sepolia ETH from a faucet.
- [ ] Confirm wallet balance is enough for deploy + verify tx costs.

## 2) Configure Local Environment

From repository root, create .env based on .env.example.

- [ ] Create .env file.
- [ ] Set SEPOLIA_RPC_URL with your real provider URL.
- [ ] Set PRIVATE_KEY with your real test wallet key.
- [ ] Set ETHERSCAN_API_KEY with your real key.
- [ ] Set ELECTION_TITLE.
- [ ] Set VOTING_DEADLINE as Unix timestamp in seconds (at least +5 minutes in future).
- [ ] Leave DEPLOYED_CONTRACT_ADDRESS empty before first deployment.

Validation notes:

- PRIVATE_KEY format must be 0x + 64 hex chars.
- VOTING_DEADLINE must be integer seconds.
- The deploy script enforces minimum future buffer.

## 3) Pre-Deployment Local Checks

- [ ] Install dependencies (if not done): npm install
- [ ] Compile contracts: npm run compile
- [ ] Run tests: npm test
- [ ] Confirm all tests pass before deploying.

## 4) Deploy to Sepolia

- [ ] Run deployment: npm run deploy:sepolia
- [ ] Copy the deployed contract address from terminal output.
- [ ] Paste it into .env as DEPLOYED_CONTRACT_ADDRESS.
- [ ] Save the transaction hash and explorer link.

Expected output includes:

- Deploying account address
- Target network name
- Deployed contract address
- Election title and deadline

## 5) Verify Contract on Etherscan

- [ ] Confirm ELECTION_TITLE and VOTING_DEADLINE in .env are exactly the same values used during deployment.
- [ ] Run verification: npm run verify:sepolia
- [ ] Open Etherscan contract page and confirm source is verified.

If verification fails:

- [ ] Re-check constructor arguments.
- [ ] Re-check DEPLOYED_CONTRACT_ADDRESS.
- [ ] Re-check ETHERSCAN_API_KEY.
- [ ] Re-run verify command.

## 6) Run Post-Deploy Smoke Check

- [ ] Run smoke check: npm run smoke:sepolia
- [ ] Confirm output shows correct network, address, title, deadline.
- [ ] Confirm proposal count and voting status are returned without error.

## 7) Record Delivery Artifacts

- [ ] Add contract address to project README.
- [ ] Add Sepolia Etherscan verified link to README.
- [ ] Capture screenshots (deploy output, Etherscan verified page, smoke-check output).
- [ ] Keep a short deployment log for demo prep.

## 8) Final Go/No-Go Gate

Ship only if all boxes below are checked.

- [ ] Compile success
- [ ] Test success
- [ ] Deploy success
- [ ] Verify success
- [ ] Smoke-check success
- [ ] README updated with live links

---

## Quick Command Sequence

Run these from repository root:

1. npm run compile
2. npm test
3. npm run deploy:sepolia
4. npm run verify:sepolia
5. npm run smoke:sepolia
