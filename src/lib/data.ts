import { PlaceHolderImages } from './placeholder-images';
import type { NFT } from './types';

const collections = [
  'CryptoPunks',
  'Bored Ape Yacht Club',
  'Azuki',
  'DeGods',
  'Pudgy Penguins',
];
const names = [
  'Chrono-Shifter',
  'Aether-Weaver',
  'Quantum-Quasar',
  'Void-Strider',
  'Cypher-Golem',
  'Nexus-Wraith',
  'Helio-Specter',
  'Omega-Sentinel',
  'Rift-Walker',
  'Pulsar-Phantom',
];
const chains: NFT['chain'][] = ['Base', 'Ethereum', 'Polygon', 'Optimism'];

export const getMockNfts = (): NFT[] => {
  return PlaceHolderImages.map((image, index) => ({
    id: (index + 1).toString(),
    name: `${names[index % names.length]} #${Math.floor(Math.random() * 1000)}`,
    collection: collections[index % collections.length],
    chain: chains[index % chains.length],
    price: parseFloat((Math.random() * 10).toFixed(2)),
    image: image,
  }));
};
