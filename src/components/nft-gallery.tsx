'use client';

import { useState, useEffect } from 'react';
import type { NFT } from '@/lib/types';
import { useAccount } from 'wagmi';
import { NftCard } from './nft-card';
import { Skeleton } from './ui/skeleton';

const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

async function fetchBaseNFTs(walletAddress: string, apiKey: string) {
  const url = `https://base-mainnet.g.alchemy.com/nft/v3/${apiKey}/getNFTsForOwner?owner=${walletAddress}&withMetadata=true&pageSize=100`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'accept': 'application/json' }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch NFTs');
  }

  const data = await response.json();
  return data.ownedNfts;
}

export function NftGallery() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      const fetchNfts = async () => {
        setIsLoading(true);
        setError(null);
        try {
          if (!alchemyApiKey || alchemyApiKey === 'YOUR_API_KEY') {
            console.error("Please set your Alchemy API key in the .env file.");
            throw new Error("Invalid Alchemy API key. Get your free key from: https://www.alchemy.com/");
          }
          const fetchedNfts = await fetchBaseNFTs(address, alchemyApiKey);
          setNfts(fetchedNfts);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
          setIsLoading(false);
        }
      };
      fetchNfts();
    } else {
      setNfts([]);
    }
  }, [address]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
        <h1 className="font-headline text-4xl font-bold">My NFTs on Base</h1>
        {address && <p className="text-muted-foreground">Total: {nfts.length}</p>}
      </div>

      {!address && <p>Please connect your wallet to see your NFTs.</p>}

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      )}

      {error && <p className="text-red-500">Error: {error}</p>}

      {!isLoading && !error && address && nfts.length === 0 && (
        <p>No NFTs found on Base for this wallet.</p>
      )}

      {!isLoading && !error && address && nfts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {nfts.map((nft) => (
            <NftCard key={`${nft.contract.address}-${nft.tokenId}`} nft={nft} />
          ))}
        </div>
      )}
    </div>
  );
}
