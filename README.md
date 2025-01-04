# ScottNFT

A modern ERC721A NFT implementation with minting capabilities and metadata support.

## Features

- ERC721A implementation for gas-efficient minting
- Owner-only minting with quantity validation
- Maximum supply cap of 1000 NFTs
- IPFS metadata support
- Event emission for minting tracking
- Frontend interface for minting and viewing NFTs

## Tech Stack

- Solidity ^0.8.20
- Hardhat
- TypeScript
- React
- ethers.js
- ERC721A
- OpenZeppelin Contracts

## Project Structure

```
├── contracts/          # Smart contract source files
├── frontend/          # React frontend application
├── metadata/          # NFT metadata JSON files
├── scripts/           # Deployment and utility scripts
└── test/             # Contract test files
```

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ScottNFT.git
cd ScottNFT
```

2. Install dependencies:
```bash
npm install
cd frontend && npm install
```

3. Create a `.env` file in the root directory with:
```
PRIVATE_KEY=your_wallet_private_key
SEPOLIA_RPC_URL=your_sepolia_rpc_url

```

4. Compile the contract:
```bash
npx hardhat compile
```

5. Deploy to Sepolia testnet:
```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

6. Update the contract address in `frontend/src/App.tsx`

7. Start the frontend:
```bash
cd frontend
npm run dev
```

## Smart Contract

The ScottNFT contract includes:
- Owner-only minting functionality
- Maximum supply of 1000 NFTs
- Quantity validation on minting
- IPFS metadata integration
- Minting event emission

## Frontend

The frontend application provides:
- Wallet connection
- NFT minting interface
- Owned NFTs display
- Metadata and image viewing

## Testing

The project includes a comprehensive test suite covering all contract functionality:

### Deployment Tests
- Validates correct owner assignment
- Verifies maximum supply configuration

### Minting Tests
- Owner minting permissions
- NFTMinted event emission
- Non-owner minting restrictions
- Quantity validation (no zero mints)
- Maximum supply enforcement
- Total supply tracking

### URI Functionality Tests
- Token URI verification
- Non-existent token handling

### Batch Minting Tests
- Multiple token minting
- Consecutive minting operations
- Ownership verification

Run the test suite:
```bash
npx hardhat test
```

Example test output:
```
ScottNFT
  Deployment
    ✔ Should set the right owner
    ✔ Should set the correct max supply
  Minting
    ✔ Should allow owner to mint NFTs
    ✔ Should emit NFTMinted event
    ✔ Should not allow non-owner to mint NFTs
    ✔ Should not allow minting zero quantity
    ✔ Should not allow minting more than max supply
    ✔ Should track total supply correctly
  URI Functionality
    ✔ Should return correct token URI
    ✔ Should revert for non-existent token
  Batch Minting
    ✔ Should allow minting multiple tokens
    ✔ Should handle consecutive mints correctly

12 passing (1s)
```

## Deployment

The contract is deployed on Sepolia testnet. View on [OpenSea Testnet](https://testnets.opensea.io/).

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
