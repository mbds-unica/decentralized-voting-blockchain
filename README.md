# decentralized-voting-blockchain

Decentralized voting dApp for the MIAGE MBDS M2 Blockchain mini-project.

## Live Sepolia Deployment

- Contract address: `0xaD49331ce757CE1AEAc4FD64Ea3255Ade28b6986`
- Etherscan: https://sepolia.etherscan.io/address/0xaD49331ce757CE1AEAc4FD64Ea3255Ade28b6986#code
- Election title: `MBDS Election`
- Voting deadline: `1782788453` (2026-12-29T15:00:53Z)

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

## Run Frontend

The frontend now reads the contract address from `.env` (`DEPLOYED_CONTRACT_ADDRESS`) through the generated `front/contractConfig.js`.

Start the frontend server with:

```bash
npm run front
```

Then open:

```text
http://localhost:5500
```

Useful related command:

```bash
npm run sync:front-config
```

Use it if you only want to regenerate `front/contractConfig.js` from `.env` without starting the frontend server.

## Sepolia Deployment Guide

### 1) Configure environment

Create `.env` from `.env.example` and set:

- `SEPOLIA_RPC_URL`
- `PRIVATE_KEY`
- `ETHERSCAN_API_KEY`
- `ELECTION_TITLE`
- `VOTING_DEADLINE` (unix timestamp in seconds, at least +5 minutes in the future)
- `DEPLOYED_CONTRACT_ADDRESS` (leave empty before first deployment)

### 2) Install dependencies

```bash
npm install
```

### 3) Compile and test

```bash
npm run compile
npm test
```

### 4) Deploy to Sepolia

```bash
npm run deploy:sepolia
```

After deployment, metadata is written to:

- `deployments/sepolia.json`

### 5) Verify on Etherscan

```bash
npm run verify:sepolia
```

### 6) Run smoke checks

```bash
npm run smoke:sepolia
```

### 7) Sync frontend with deployed address

Set `DEPLOYED_CONTRACT_ADDRESS` in `.env` to the deployed contract address, then run:

```bash
npm run sync:front-config
```

Finally start the frontend:

```bash
npm run front
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