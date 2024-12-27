# ScottNFT Project

A full-stack NFT (Non-Fungible Token) project built with Hardhat, Solidity, and React.

## Project Structure

- `contracts/`: Solidity smart contracts
- `frontend/`: React frontend application
- `metadata/`: NFT metadata JSON files
- `scripts/`: Deployment and other utility scripts
- `test/`: Smart contract tests

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MetaMask wallet
- Sepolia testnet ETH

## Setup Instructions

1. Clone the repository and install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   ```

2. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   Fill in your Sepolia endpoint URL and wallet private key.

3. Compile the smart contracts:
   ```bash
   npx hardhat compile
   ```

4. Deploy to Sepolia testnet:
   ```bash
   npx hardhat run scripts/deploy.ts --network sepolia
   ```

5. Update the contract address:
   - Copy the deployed contract address
   - Update `CONTRACT_ADDRESS` in `frontend/src/App.tsx`

6. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Testing

Run the test suite:
```bash
npx hardhat test
```

## Frontend Features

- Connect MetaMask wallet
- Mint new NFTs (owner only)
- View owned NFTs
- Modern UI with Tailwind CSS

## Smart Contract Features

- ERC-721 compliant
- Owner-restricted minting
- Metadata URI support
- Base URI management

## Deployment

The smart contract can be deployed to:
- Sepolia testnet (configured)
- Other networks (add configuration to hardhat.config.ts)

## Security Considerations

- Keep your private key secure
- Never commit your `.env` file
- The contract owner has special privileges
- Test thoroughly before mainnet deployment

## License

MIT
