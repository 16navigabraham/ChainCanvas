'use client';

import { useState, useMemo } from 'react';
import type { NFT } from '@/lib/types';
import { useAccount } from 'wagmi';
import { NftCard } from './nft-card';

export function NftGallery() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const { address } = useAccount();

  useMemo(() => {
    if (address) {
      // In a real application, you would fetch the NFTs for the connected address here.
      setNfts([]);
    } else {
      setNfts([]);
    }
  }, [address]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
        <h1 className="font-headline text-4xl font-bold">My NFTs</h1>
      </div>

      {address ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {nfts.map((nft) => (
            <NftCard key={nft.id} nft={nft} />
          ))}
        </div>
      ) : (
        <p>Please connect your wallet to see your NFTs.</p>
      )}
    </div>
  );
}
