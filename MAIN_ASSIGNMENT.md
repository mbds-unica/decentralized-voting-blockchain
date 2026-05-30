# Main Assignment

## MIAGE MBDS M2 Blockchain Project

## 10. Mini-Projet Final

- Travail en groupe de 5.
- Rendu dans 14 jours apres la fin du module.

### Livrables attendus

- Un repository GitHub public (lien a soumettre).
- L'adresse du contrat deploye sur sepolia.etherscan.io.
- Une video de demonstration <= 3 minutes (Loom, YouTube non-liste) OU presentation orale.

## 10.1 Sujets proposes

| # | Sujet | Description |
| --- | --- | --- |
| 1 | Vote decentralise | Propositions on-chain, vote une fois par adresse, cloture automatique par deadline. |
| 2 | Token ERC-20 avec vesting | Tokens debloques lineairement sur N mois. Whitelist, cliff, revocation. |
| 3 | Mini NFT Marketplace | Mint ERC-721, listing prix ETH, achat (ETH->NFT), galerie front. |
| 4 | Loterie on-chain | Achat ticket ETH, tirage (block.prevrandao ou VRF mock), distribution prix. |
| 5 | Diplome Soulbound (EIP-5114) | NFT non-transferable = diplome academique. Seul l'owner emet. |
| 6 | Crowdfunding on-chain | Objectif ETH + deadline. Si atteint -> owner retire. Sinon -> remboursement auto. |

## 10.2 Criteres d'evaluation

| Critere | Points /20 | Attendus |
| --- | --- | --- |
| Conception du contrat | 5 / 20 | Architecture claire, bonnes pratiques Solidity, logique metier correcte |
| Securite | 4 / 20 | Modifiers, require avec messages, pattern CEI, gestion des erreurs |
| Front-end fonctionnel | 4 / 20 | Connexion MetaMask, lecture/ecriture contrat, UX lisible, gestion d'erreurs |
| README & Repository | 3 / 20 | Description, instructions, adresse contrat Sepolia, captures d'ecran |
| Demo | 4 / 20 | Clarte de la demonstration, explication des choix techniques |

### Points bonus

- Tests unitaires avec Hardhat ou Foundry.
- Deploiement front sur GitHub Pages (URL publique dans le README).
- Documentation NatSpec dans le contrat (/// @param, @return...).
- Utilisation d'OpenZeppelin (ERC20, ERC721, Ownable, AccessControl...).
- Integration Chainlink VRF (pour la loterie) ou Price Feed.

## 10.3 Structure GitHub recommandee

```text
mon-projet-blockchain/
├── README.md              # Description, adresse contrat, lien demo, captures
├── contracts/
│   └── MonContrat.sol     # Smart contract Solidity principal
├── test/                  # Tests unitaires (bonus - Hardhat ou Foundry)
├── scripts/               # Scripts de deploiement (bonus)
├── front/
│   ├── index.html
│   └── app.js             # Logique ethers.js
└── screenshots/           # Captures DApp + Etherscan + MetaMask
```
