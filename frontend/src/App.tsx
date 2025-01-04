import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ScottNFT from './artifacts/contracts/ScottNFT.sol/ScottNFT.json';

declare global {
  interface Window {
    ethereum: any;
  }
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

const CONTRACT_ADDRESS = "0xBe186BbF5080C055cb85197F59caB05817046Fc9";

// Função para buscar metadados
const fetchMetadata = async (uri: string): Promise<NFTMetadata | null> => {
  try {
    console.log("Fetching metadata from URI:", uri);
    
    // Tentar diferentes gateways IPFS
    const gateways = [
      'https://gateway.pinata.cloud/ipfs/',
      'https://cloudflare-ipfs.com/ipfs/',
      'https://ipfs.io/ipfs/',
      'https://nftstorage.link/ipfs/'
    ];
    
    let metadata = null;
    let error = null;
    
    for (const gateway of gateways) {
      try {
        const url = uri.replace('ipfs://', gateway);
        console.log("Trying gateway:", url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          metadata = await response.json();
          console.log("Fetched metadata:", metadata);
          break;
        }
      } catch (e) {
        error = e;
        continue;
      }
    }
    
    if (metadata) return metadata;
    throw error || new Error('Failed to fetch metadata from all gateways');
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
  }
};

function App() {
  const [account, setAccount] = useState<string>("");
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [nftContract, setNftContract] = useState<ethers.Contract | null>(null);
  const [ownedNFTs, setOwnedNFTs] = useState<Array<NFTMetadata | null>>([]);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalSupply, setTotalSupply] = useState<number>(0);

  useEffect(() => {
    if (window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      setProvider(web3Provider);

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ScottNFT.abi,
        web3Provider.getSigner()
      );
      setNftContract(contract);

      // Atualizar quando a rede mudar
      web3Provider.on("network", (newNetwork, oldNetwork) => {
        if (oldNetwork) {
          window.location.reload();
        }
      });
    }
  }, []);

  const checkIfOwner = async (address: string) => {
    try {
      if (nftContract) {
        const contractOwner = await nftContract.owner();
        console.log("Contract owner:", contractOwner);
        console.log("Current address:", address);
        const isOwnerResult = contractOwner.toLowerCase() === address.toLowerCase();
        console.log("Is owner?", isOwnerResult);
        setIsOwner(isOwnerResult);
      }
    } catch (error) {
      console.error("Error checking owner:", error);
    }
  };

  const connectWallet = async () => {
    try {
      setError("");
      if (provider) {
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        await checkIfOwner(address);
        await loadOwnedNFTs(address);
        await updateTotalSupply();
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError("Error connecting wallet");
    }
  };

  const updateTotalSupply = async () => {
    try {
      if (nftContract) {
        const supply = await nftContract.totalSupply();
        setTotalSupply(supply.toNumber());
      }
    } catch (error) {
      console.error("Error getting total supply:", error);
    }
  };

  const mintNFT = async () => {
    try {
      setError("");
      setIsLoading(true);
      console.log("Starting mint...");
      
      if (!nftContract) {
        setError("Contract not initialized");
        return;
      }
      
      if (!account) {
        setError("Wallet not connected");
        return;
      }

      if (!isOwner) {
        setError("Only the owner can mint NFTs");
        return;
      }

      console.log("Calling safeMint...");
      const tx = await nftContract.safeMint(1, {
        gasLimit: BigInt(200000)
      });
      
      console.log("Transaction:", tx.hash);
      console.log("Waiting for confirmation...");
      await tx.wait();
      console.log("Mint confirmed!");
      
      await loadOwnedNFTs(account);
      await updateTotalSupply();
    } catch (error: any) {
      console.error("Detailed error while minting NFT:", error);
      setError(error.message || "Error minting NFT");
    } finally {
      setIsLoading(false);
    }
  };

  const loadOwnedNFTs = async (address: string) => {
    try {
      setError("");
      setIsLoading(true);
      if (nftContract) {
        const balance = await nftContract.balanceOf(address);
        const metadataPromises = [];
        
        for (let i = 0; i < balance.toNumber(); i++) {
          const tokenId = i;
          const uri = await nftContract.tokenURI(tokenId);
          metadataPromises.push(fetchMetadata(uri));
        }
        
        const metadata = await Promise.all(metadataPromises);
        setOwnedNFTs(metadata);
      }
    } catch (error) {
      console.error("Error loading NFTs:", error);
      setError("Error loading NFTs");
    } finally {
      setIsLoading(false);
    }
  };

  const NFTCard = ({ metadata, index }: { metadata: NFTMetadata | null, index: number }) => {
    if (!metadata) return null;
    
    const getImageUrl = (ipfsUrl: string) => {
      if (!ipfsUrl) return 'https://via.placeholder.com/400x300?text=No+Image';
      
      // Lista de gateways IPFS para tentar
      const gateways = [
        'https://gateway.pinata.cloud/ipfs/',
        'https://cloudflare-ipfs.com/ipfs/',
        'https://ipfs.io/ipfs/',
        'https://nftstorage.link/ipfs/'
      ];
      
      // Usar o primeiro gateway (podemos implementar fallback se necessário)
      return ipfsUrl.replace('ipfs://', gateways[0]);
    };
    
    return (
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <div className="relative w-full h-48 mb-4">
          <img 
            src={getImageUrl(metadata.image)} 
            alt={metadata.name}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
            }}
          />
        </div>
        <h3 className="font-bold text-lg mb-2">{metadata.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{metadata.description}</p>
        <div className="space-y-1">
          {metadata.attributes.map((attr, i) => (
            <div key={i} className="text-xs">
              <span className="font-semibold">{attr.trait_type}:</span> {attr.value}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold mb-8 text-center">ScottNFT</h1>
                
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                  </div>
                )}

                <div className="mb-8">
                  {!account ? (
                    <button
                      onClick={connectWallet}
                      className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors"
                      disabled={isLoading}
                    >
                      Connect Wallet
                    </button>
                  ) : (
                    <div>
                      <p className="text-sm mb-2">Connected: {account}</p>
                      {isOwner && (
                        <button
                          onClick={mintNFT}
                          className="w-full bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 transition-colors"
                          disabled={isLoading}
                        >
                          {isLoading ? "Minting..." : "Mint NFT"}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {totalSupply > 0 && (
                  <p className="text-sm text-gray-600 mb-4">
                    Total NFTs Minted: {totalSupply}
                  </p>
                )}

                {isLoading && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                  {ownedNFTs.map((metadata, index) => (
                    <NFTCard key={index} metadata={metadata} index={index} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
