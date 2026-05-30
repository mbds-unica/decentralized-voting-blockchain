# Task Repartition (Team of 3)

## Context

- Program: MIAGE MBDS M2 Blockchain
- Project type: Mini-Projet Final
- Chosen topic: Vote decentralise
- Target network: Sepolia

## Required Output (from MAIN_ASSIGNMENT)

- Public GitHub repository
- Deployed contract address on sepolia.etherscan.io
- Demo video <= 3 minutes (or oral presentation)

## Scope

### Functional scope (must-have)

- Create proposals on-chain (owner/admin only)
- One wallet address = one vote maximum
- Automatic vote closure by deadline timestamp
- Read all proposals from front-end
- Vote from front-end with MetaMask
- Display voting status (open/closed) and vote counts

### Security and quality scope (must-have)

- Access control (only owner for admin actions)
- Clear require messages
- CEI pattern where relevant
- Revert-safe logic (no inconsistent state)
- Basic unit tests for key rules

### Bonus scope (if time remains)

- GitHub Pages deployment for front-end
- NatSpec comments in contract
- Extended tests and edge cases

## Team roles

### Member 1 - Smart Contract Lead

Primary ownership:

- Contract architecture and Solidity implementation
- Security patterns and code quality
- Deployment on Sepolia

Deliverables:

- contracts/MonContrat.sol
- scripts/deploy.js (or equivalent)
- Deployed address + Etherscan link

### Member 2 - Front-end and Wallet Lead

Primary ownership:

- Front-end UI for proposals and vote flow
- MetaMask connection and transaction UX
- Contract read/write integration with ethers.js

Deliverables:

- front/index.html
- front/app.js
- Screenshots of UI + transaction flow

### Member 3 - QA, Tests, Documentation and Demo Lead

Primary ownership:

- Unit tests and regression checks
- README and repository quality
- Demo scenario, recording and submission package

Deliverables:

- test/MonContrat.test.js (or Foundry equivalent)
- README.md
- screenshots/
- Demo video <= 3 min

## Execution plan by phase

## Phase 1 - Architecture and setup

Shared goals:

- Confirm exact feature list and out-of-scope list
- Create repository structure
- Initialize toolchain (Hardhat or Foundry)

Task split:

- Member 1: Draft contract interfaces and state model
- Member 2: Create front-end skeleton and wallet connect button
- Member 3: Prepare README template + test plan + acceptance checklist

Exit criteria:

- Repo initialized
- Architecture agreed
- Base files committed

## Phase 2 - Core implementation

Task split:

- Member 1:
  - Implement proposal creation
  - Implement vote function with one-vote-per-address rule
  - Implement deadline checks and auto-close behavior
- Member 2:
  - Implement proposal listing UI
  - Implement vote action and tx state handling (pending/success/error)
  - Add network guard (Sepolia only)
- Member 3:
  - Write tests for happy path
  - Write tests for key constraints (double vote, closed vote, invalid proposal)
  - Start README sections: setup, run, deploy, usage

Exit criteria:

- End-to-end vote works locally
- Initial tests pass
- First integration commit done

## Phase 3 - Integration and hardening

Task split:

- Member 1:
  - Add defensive checks and events
  - Refactor for readability and gas sanity
  - Prepare Sepolia deploy script and env variables
- Member 2:
  - Improve UX and error display
  - Add status labels: Open / Closed / Voted
  - Finalize front-to-contract ABI wiring
- Member 3:
  - Extend tests for edge cases
  - Run regression pass after every merge
  - Build screenshot pack and validate README commands

Exit criteria:

- Stable contract + front integration
- Tests covering core rules
- Ready for Sepolia deployment

## Phase 4 - Deployment and production checks

Task split:

- Member 1:
  - Deploy to Sepolia
  - Verify contract on Etherscan if possible
  - Provide deployed address and ABI to team
- Member 2:
  - Connect front-end to deployed contract
  - Run full smoke test with real Sepolia tx
  - Capture key UI screenshots
- Member 3:
  - Validate final checklist against evaluation criteria
  - Finalize README with contract address and usage
  - Draft demo script (flow + talking points)

Exit criteria:

- Live contract address available
- Front-end reads/writes on Sepolia
- README nearly final

## Phase 5 - Submission package

Task split:

- Member 1: Final contract review and tagged release commit
- Member 2: Final UI polish and optional GitHub Pages deploy
- Member 3: Record demo video <= 3 min and finalize submission links

Exit criteria:

- Public repo complete
- Etherscan address included in README
- Demo asset ready
- Submission checklist complete

## Mapping to grading criteria (/20)

- Conception du contrat (5/20): Member 1 lead, Members 2-3 review
- Securite (4/20): Member 1 lead, Member 3 validation via tests
- Front-end fonctionnel (4/20): Member 2 lead, Member 1 support for ABI/events
- README & Repository (3/20): Member 3 lead, all contribute artifacts
- Demo (4/20): Member 3 lead, Members 1-2 provide technical walkthrough

## Risk management

- Risk: Sepolia faucet delays
  - Mitigation: Request test ETH as early as possible
- Risk: Integration mismatch ABI/front
  - Mitigation: Shared ABI file and interface freeze before final deployment
- Risk: Time overrun
  - Mitigation: Freeze features before final phase, then fix/stabilize only
- Risk: Last-minute bugs
  - Mitigation: Keep a final buffer for fixes only

## Git workflow (lightweight)

- Branches:
  - feature/contract
  - feature/frontend
  - feature/tests-docs
- Merge rule:
  - At least one teammate review before merge to main
- Commit style:
  - Small, frequent, descriptive commits

## Definition of done

- Smart contract deployed on Sepolia
- Decentralized vote flow works end-to-end
- One vote per address enforced
- Deadline closure enforced
- Front-end connected with MetaMask
- README complete with setup, run, deploy, and links
- Demo video prepared (<= 3 minutes)
