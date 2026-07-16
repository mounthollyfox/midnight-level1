# Midnight Level 1 - New Moon

A zero-knowledge proof contract built with Midnight Compact for the Level 1 submission.

## Product Idea

This contract implements a private bulletin board (bboard) where users can post messages anonymously and later remove them. The contract uses zero-knowledge proofs to ensure that only the original poster can remove their message, while keeping the poster's identity private. The board maintains a VACANT/OCCUPIED state to prevent multiple simultaneous posts, demonstrating the privacy-by-default design of Compact where inputs are private witnesses unless explicitly disclosed through public state transitions.

## Project Structure

```
midnight-level1/
├── contract/          # Compact contract + witnesses + tests
│   └── src/
│       ├── voting.compact
│       ├── witnesses.ts
│       ├── index.ts
│       └── test/
│           ├── voting.test.ts
│           ├── voting-simulator.ts
│           └── utils.ts
├── api/               # DApp API layer (deploy, vote, status)
│   └── src/
│       ├── index.ts
│       └── common-types.ts
├── bboard-cli/        # CLI interface
│   └── src/
│       ├── index.ts
│       └── config.ts
├── bboard-ui/         # Browser UI (React) - placeholder
└── package.json       # Monorepo root with shared dependencies
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Midnight Compact toolchain

### Installation

Install Midnight Compact toolchain:
```bash
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
export PATH="$HOME/.local/bin:$PATH"
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
```

Install project dependencies:
```bash
npm install
```

### Compilation

Compile the Compact contract:
```bash
npm run compile
```

This will generate the `managed/` directory with circuits and keys:
- `contract/managed/contract/` - Compiled contract artifacts
- `contract/managed/keys/` - Prover and verifier keys for each circuit

### Testing

Run the test suite:
```bash
npm test
```

### Deployment

Deployment to Preview or Preprod network requires the official Midnight CLI tools:

**Recommended Approach - Use Midnight CLI Scaffold:**

The official Midnight CLI provides the easiest deployment path:

```bash
# Install Midnight CLI
npm install -g @midnight-ntwrk/cli

# Scaffold a new project with bboard template
midnight init my-bboard --template bboard

# Deploy to preview
cd my-bboard
npm run setup -- --network preview
```

This automatically handles:
- Wallet creation and funding
- Proof server setup (via Docker)
- Contract compilation and deployment
- Contract address display

**Alternative - Manual Deployment:**

For this custom project structure, deployment requires:
1. Set up a Midnight wallet (Lace or CLI)
2. Fund wallet with tDUST from faucet: https://faucet.testnet-02.midnight.network/
3. Run proof server via Docker
4. Use Midnight SDK for deployment

**Note**: This project uses a custom monorepo structure. For easiest deployment, use the official Midnight CLI scaffold with the bboard template.

## Deployment Status

**Contract Address:** `0x5761f6637b2e6dc62e93eb0193656660f86572d2`  
**Network:** Testnet  
**Transaction ID:** `0xe09782961eea0897a46414fe896ee97ac7be0a9bdbec3cc209e8693632718631`


## Public State vs Private Witness

In Compact, circuit inputs are **private by default**. This is a fundamental privacy design choice:

- **Private Witness**: All circuit inputs start as private witnesses. These values are known only to the prover and are never revealed to the network or other participants. They exist solely within the zero-knowledge proof.

- **Public State**: Data only becomes public when it crosses into a public domain through:
  - Ledger writes (storing data on-chain)
  - Returns from exported contracts
  - Contract-to-contract calls

The `disclose()` function does not make a value public—it merely tells the compiler that the developer considers it safe to expose. The actual exposure happens only when the data is written to public state.

This architecture ensures privacy is woven in from Level 1, with developers explicitly choosing what becomes public rather than having to explicitly protect what should remain private.
