import type { ImagePlaceholder } from './placeholder-images';

export type Chain = 'Base' | 'Ethereum' | 'Polygon' | 'Optimism';

export type NFT = {
  id: string;
  name: string;
  collection: string;
  chain: Chain;
  price: number;
  image: ImagePlaceholder;
};
