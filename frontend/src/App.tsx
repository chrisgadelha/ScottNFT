import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ScottNFT from './artifacts/contracts/ScottNFT.sol/ScottNFT.json';

declare global {
  interface Window {
    ethereum: any;
  }
}

const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS"; // Replace after deployment

function App() {
  const [account, setAccount] = useState<string>("");
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [nftContract, setNftContract] = useState<ethers.Contract | null>(null);
  const [ownedNFTs, setOwnedNFTs] = useState<string[]>([]);

  useEffect(() => {
    if (window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ScottNFT.abi,
        web3Provider.getSigner()
      );
      setNftContract(contract);
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (provider) {
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        loadOwnedNFTs(address);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const mintNFT = async () => {
    try {
      if (nftContract && account) {
        const tx = await nftContract.safeMint(account, "1"); // Using token ID 1 as example
        await tx.wait();
        loadOwnedNFTs(account);
      }
    } catch (error) {
      console.error("Error minting NFT:", error);
    }
  };

  const loadOwnedNFTs = async (address: string) => {
    try {
      if (nftContract) {
        // This is a simple implementation. In a real app, you'd want to use events or other methods
        // to efficiently fetch owned NFTs
        const balance = await nftContract.balanceOf(address);
        const tokenIds = [];
        for (let i = 0; i < balance.toNumber(); i++) {
          const tokenId = await nftContract.tokenOfOwnerByIndex(address, i);
          const uri = await nftContract.tokenURI(tokenId);
          tokenIds.push(uri);
        }
        setOwnedNFTs(tokenIds);
      }
    } catch (error) {
      console.error("Error loading NFTs:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold mb-8 text-center">ScottNFT</h1>
                
                {!account ? (
                  <button
                    onClick={connectWallet}
                    className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors"
                  >
                    Connect Wallet
                  </button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm">Connected: {account}</p>
                    <button
                      onClick={mintNFT}
                      className="w-full bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 transition-colors"
                    >
                      Mint NFT
                    </button>

                    <div className="mt-8">
                      <h2 className="text-xl font-semibold mb-4">Your NFTs</h2>
                      {ownedNFTs.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                          {ownedNFTs.map((uri, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <p className="text-sm">Token URI: {uri}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No NFTs owned yet</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
