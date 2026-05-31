# decentralized-voting-blockchain

Decentralized voting dApp for the MIAGE MBDS M2 Blockchain mini-project.

## Live Sepolia Deployment

- Contract address: `0xB53D16534CD4d9F0B8361b3A7DF99beEf9508c05`
- Etherscan: https://sepolia.etherscan.io/address/0xB53D16534CD4d9F0B8361b3A7DF99beEf9508c05#code
- Election title: `MBDS Election`

## Features

- Owner-only proposal creation
- One vote per wallet address
- Automatic vote closure based on deadline timestamp
- Proposal listing for front-end integration
- Sepolia deployment, verification, and smoke-check scripts

## Project Structure

```text
contracts/        Solidity smart contract
scripts/          Deployment, verification, smoke-check, and admin scripts
test/             Hardhat test suite
member1.md        Member 1 implementation journal
```

## Commands

```bash
npm install
npm run compile
npm test
npm run deploy:sepolia
npm run verify:sepolia
npm run smoke:sepolia
```

## Deterministic Deploy Verify Workflow

To avoid constructor argument mismatches during verification, this project stores deployment metadata at deploy time.

When you run `npm run deploy:sepolia`, the script writes a network file:

- `deployments/sepolia.json`

This file contains the source-of-truth values used for verification and smoke checks:

- deployed contract address
- election title
- voting deadline
- deployer address
- deployment transaction hash
- chain ID and timestamp

Recommended command order:

```bash
npm run deploy:sepolia
npm run verify:sepolia
npm run smoke:sepolia
```

Notes:

- `verify:sepolia` reads constructor arguments from `deployments/sepolia.json`.
- `smoke:sepolia` also prefers `deployments/sepolia.json` when available.
- If you set `DEPLOYED_CONTRACT_ADDRESS`, `ELECTION_TITLE`, or `VOTING_DEADLINE` in `.env`, they must match metadata values when metadata exists.

## Environment Variables

Create a local `.env` file from `.env.example` and set:

- `SEPOLIA_RPC_URL`
- `PRIVATE_KEY`
- `ETHERSCAN_API_KEY`
- `ELECTION_TITLE`
- `VOTING_DEADLINE`
- `DEPLOYED_CONTRACT_ADDRESS`

## Project Context

The main context for this project is maintained in [BASE_CONTEXT.md](BASE_CONTEXT.md).

All planning and implementation decisions should align with this file.