import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { NFT } from '@/lib/types';
import { cn } from '@/lib/utils';

interface NftCardProps {
  nft: NFT;
}

const chainColors: Record<NFT['chain'], string> = {
  Base: 'bg-blue-500 hover:bg-blue-600',
  Ethereum: 'bg-gray-500 hover:bg-gray-600',
  Polygon: 'bg-purple-500 hover:bg-purple-600',
  Optimism: 'bg-red-500 hover:bg-red-600',
};

export function NftCard({ nft }: NftCardProps) {
  return (
    <Card className="overflow-hidden bg-card/60 backdrop-blur-sm border-border/20 transition-all hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="aspect-square relative">
          <Image
            src={nft.image.imageUrl}
            alt={nft.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            data-ai-hint={nft.image.imageHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{nft.collection}</p>
        <h3 className="font-semibold truncate">{nft.name}</h3>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <Badge
          className={cn(
            'border-transparent text-white',
            chainColors[nft.chain]
          )}
        >
          {nft.chain}
        </Badge>
        <p className="font-semibold text-sm">{nft.price} ETH</p>
      </CardFooter>
    </Card>
  );
}
