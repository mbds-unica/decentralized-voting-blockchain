# Member 1 Progress Log

## Scope
- Smart contract architecture and Solidity implementation
- Security patterns and code quality
- Deployment on Sepolia

## Current Status
- Project context reviewed
- Chosen topic: decentralized voting
- Contract architecture chosen: a single poll with a global deadline
- Next step: add the Hardhat project scaffold and deployment/test wiring

## Notes
- The contract must enforce one vote per address.
- Proposal creation is restricted to the owner/admin.
- Votes must stop automatically after the deadline.
- The front-end should be able to read proposals, vote, and display open/closed status.

## Modification 1 - Contract Architecture

### What was decided
- One election contract handles the full poll.
- The owner creates proposals before the deadline.
- Each wallet can vote only once for one proposal.
- Voting closes automatically when `block.timestamp` reaches the deadline.

### Why this design
- It is the fastest design to ship reliably before the deadline.
- It keeps the front-end simple because proposal status is derived from the same deadline for every proposal.
- It avoids extra admin flows like closing votes manually or managing separate election phases.

### Difficult parts
- The contract must reject late votes purely from timestamp checks, so the deadline logic must be consistent everywhere.
- The `vote` function must update state before emitting the event so the contract stays in a valid state even if the call is extended later.
- The proposal list needs a clean getter so the front-end can read all proposals without custom off-chain indexing.

## Modification 2 - Project Scaffold

### What was added
- Hardhat project metadata in `package.json`
- Solidity compiler and Sepolia network configuration in `hardhat.config.js`
- Deployment script in `scripts/deploy.js`
- Ignore rules for generated and secret files in `.gitignore`

### Why this matters
- The deployment script gives us a repeatable way to deploy the same contract to Sepolia.
- The config keeps the contract sources and tests in the expected folders.
- The scripts are simple enough for the whole team to reuse without extra setup overhead.

### Difficult parts
- The Sepolia network configuration must stay empty when the RPC URL or private key is missing, otherwise Hardhat fails early.
- The deployment script needs a future deadline, so it falls back to a relative timestamp when no explicit deadline is provided.
- The compile step still depends on installing the Node packages, so the next validation will check that the scaffold matches the dependency set.

## Modification 3 - Contract Tests

### What was added
- A Hardhat test suite for owner-only proposal creation
- A one-vote-per-address test
- A duplicate-vote rejection test
- A deadline closure test using Hardhat time manipulation

### Why this matters
- The tests lock in the most important voting rules before the rest of the project builds on top of them.
- They give fast feedback during later front-end integration and Sepolia deployment.

### Difficult parts
- Deadline testing needs direct EVM time control, so the suite advances the next block timestamp instead of waiting in real time.
- The duplicate-vote test has to vote once successfully first, otherwise it would not prove that the second vote is the one being rejected.
- OpenZeppelin v5 uses a custom error for unauthorized ownership checks, so the owner-only test must assert `OwnableUnauthorizedAccount` instead of a revert string.

## Modification 4 - Deployment Environment Sample

### What was added
- A `.env.example` file with the Sepolia RPC URL and private key placeholders
- Optional election title and deadline variables for the deploy script

### Why this matters
- The team can copy the example file into a local `.env` and deploy without guessing which variables are required.
- The deploy script already reads these values, so this keeps the runtime contract configuration aligned with the code.

### Difficult parts
- The private key must never be committed, so the repository needs an example file rather than a real `.env`.
- The deadline can be omitted, but then the deployment script must fall back to a future timestamp so the contract is always deployable.

## Modification 5 - Deploy Script Fail-Fast Validation

### What was changed
- Added required env checks for `SEPOLIA_RPC_URL` and `PRIVATE_KEY`
- Added strict private key format validation (`0x` + 64 hex chars)
- Added strict deadline parsing and validation for `VOTING_DEADLINE`
- Added a 5-minute minimum future buffer for custom deadlines
- Logged deployer address and target network before deployment

### Why this hardens deployment
- It prevents accidental deployments with empty RPC URL or missing key.
- It prevents malformed private keys from causing confusing runtime failures.
- It avoids deploying elections that are already closed or almost closed.
- It gives an explicit deploy trace (network + account) to reduce operator mistakes.

### Difficult parts
- `VOTING_DEADLINE` must be parsed as an integer timestamp in seconds; loose parsing can silently accept bad values.
- A very short deadline might pass constructor checks but still be operationally unusable, which is why the extra 5-minute safety margin was added.

## Modification 6 - Sepolia Network Config Hardening

### What was changed
- Added explicit Sepolia `chainId` (`11155111`) in Hardhat network config
- Added private key normalization and strict key format checks in config
- Added fail-fast checks that trigger when a command is run with `--network sepolia`
- Added a network timeout value for Sepolia operations

### Why this hardens deployment
- Explicit chain ID reduces risk of accidental RPC misrouting.
- Config-level validation catches bad secrets before transaction broadcasting.
- Conditional fail-fast checks keep local compile/test workflows working while enforcing strictness for Sepolia commands.

### Difficult parts
- Throwing on missing env vars unconditionally would break local development, so checks are only strict when `--network sepolia` is used.
- Validation now exists both in deploy script and config by design: config protects all Sepolia tasks, deploy script protects constructor/runtime assumptions.

## Modification 7 - Verification and Post-Deploy Smoke Check

### What was changed
- Added Etherscan API key wiring in Hardhat config
- Added `verify:sepolia` npm script and `scripts/verify.js`
- Added `smoke:sepolia` npm script and `scripts/smokeCheck.js`
- Extended `.env.example` with `ETHERSCAN_API_KEY` and `DEPLOYED_CONTRACT_ADDRESS`

### Why this hardens deployment
- Verification on Etherscan improves trust and demo clarity by making source code publicly auditable.
- Smoke checks confirm that the deployed contract is reachable and constructor state is correct.
- A scripted post-deploy check reduces risk of presenting the wrong contract address.

### Difficult parts
- Verification requires constructor arguments to match the original deployment exactly; mismatches fail verification.
- Smoke checks must target the deployed contract address explicitly to avoid accidentally reading from a stale or local address.

## Modification 8 - Checkable Sepolia Runbook

### What was changed
- Added a new step-by-step checklist guide file: `SEPOLIA_DEPLOYMENT_CHECKLIST.md`
- Structured it with checkboxes from account/key setup to deploy, verify, smoke-check, and final go/no-go gate

### Why this helps
- It gives a clear execution path for real Sepolia operations under deadline pressure.
- It reduces omissions by turning each deployment stage into a checkable gate.
- It supports demo preparation by explicitly tracking the final artifacts required in README and screenshots.

### Difficult parts
- Verification depends on exact constructor argument replay, so the checklist emphasizes value consistency between deploy and verify.
- Secret management is operationally critical, so the checklist includes explicit safety rules before any command execution.

## Modification 9 - Etherscan V2 Compatibility Fix

### What was changed
- Updated Hardhat Etherscan config to use a single `apiKey` string instead of the deprecated per-network object format

### Why this was needed
- Sepolia verification failed against the deprecated V1 endpoint shape.
- The current Etherscan integration expects the V2-compatible config format.

### Difficult parts
- The deployment itself was correct; only the verification wiring was outdated, so the fix had to be narrow to avoid disturbing the working Sepolia deployment flow.

## Modification 10 - README Live Deployment Update and Proposal Seeding

### What was changed
- Updated the README with the live Sepolia contract address and Etherscan link
- Added a `seed:sepolia` admin command and `scripts/seedProposals.js`
- Added a one-time proposal seeding flow for the deployed contract

### Why this helps
- The README now contains the concrete live deployment information needed for delivery and demo prep.
- The seed script gives the owner a repeatable way to create the initial proposals without manual Remix interaction.
- The seed logic refuses to run when proposals already exist, which reduces accidental duplication on the live contract.

### Difficult parts
- Proposal creation must happen from the owner account, so the script relies on the same deployer-controlled environment used for Sepolia deployment.
- Seeding a live contract is not naturally reversible, so the script aborts when proposal count is already non-zero.

## Modification 11 - Member 2 ABI and Contract Config Handoff

### What was changed
- Added `front/contractConfig.js` with the live Sepolia contract address
- Exported the Sepolia chain metadata needed for MetaMask network checks
- Included the contract ABI in a browser-friendly and Node-friendly format

### Why this helps
- Member 2 now has a single importable source for contract address, ABI, and network identification.
- It removes the need for Member 2 to read Hardhat artifacts directly or copy ABI fragments by hand.

### Difficult parts
- The handoff file needs to work in both plain browser usage and script-based tooling, so it exposes the config through `window` and `module.exports`.

## Modification 12 - Deterministic Deployment Metadata, Contract Input Hardening, and Edge-Case Tests

### What was changed
- Added `scripts/deploymentState.js` to persist and load deployment metadata per network (`deployments/<network>.json`)
- Updated `scripts/deploy.js` to save immutable deployment artifacts (address, constructor args, deployer, tx hash, chain ID, timestamp)
- Updated `scripts/verify.js` to use frozen constructor args from deployment metadata instead of recomputing from environment defaults
- Updated `scripts/smokeCheck.js` to consume deployment metadata when available, with mismatch checks against optional env overrides
- Hardened `contracts/MonContrat.sol` by rejecting empty proposal title/description
- Simplified `Proposal` storage by removing the redundant `exists` field
- Extended `test/MonContrat.test.js` with edge cases and event assertions (past constructor deadline, no-proposal vote, proposal creation after deadline, empty input guards, `ProposalCreated` event)

### Why this hardens Member 1 scope
- Verification is now reproducible because constructor arguments are replayed from deployment-time values, not derived at runtime.
- Post-deploy operations now point to a single source of truth, reducing operator errors and stale env mismatches.
- Contract-level input validation blocks empty proposal data from entering permanent on-chain state.
- Additional tests improve confidence for grading criteria tied to security and reliability.

### Difficult parts
- Etherscan verification fails if constructor args are even slightly different, so deploy-time metadata had to be treated as authoritative.
- Backward compatibility was preserved in smoke checks by allowing env fallback only when metadata is unavailable.
- Edge-case tests needed a separate empty-fixture deployment path to validate invalid votes and proposal event indexing cleanly.
