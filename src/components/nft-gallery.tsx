'use client';

import { useState, useMemo } from 'react';
import type { NFT } from '@/lib/types';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { NftCard } from './nft-card';

const chains = ['All', 'Base', 'Ethereum', 'Polygon', 'Optimism'];

interface NftGalleryProps {
  initialNfts: NFT[];
}

export function NftGallery({ initialNfts }: NftGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChain, setSelectedChain] = useState('All');

  const filteredNfts = useMemo(() => {
    return initialNfts.filter((nft) => {
      const searchLower = searchQuery.toLowerCase();
      const nameMatch = nft.name.toLowerCase().includes(searchLower);
      const collectionMatch = nft.collection.toLowerCase().includes(searchLower);
      const chainMatch = selectedChain === 'All' || nft.chain === selectedChain;

      return (nameMatch || collectionMatch) && chainMatch;
    });
  }, [initialNfts, searchQuery, selectedChain]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
        <h1 className="font-headline text-4xl font-bold">Explore NFTs</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or collection..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedChain} onValueChange={setSelectedChain}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by chain" />
            </SelectTrigger>
            <SelectContent>
              {chains.map((chain) => (
                <SelectItem key={chain} value={chain}>
                  {chain}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredNfts.map((nft) => (
          <NftCard key={nft.id} nft={nft} />
        ))}
      </div>
    </div>
  );
}
