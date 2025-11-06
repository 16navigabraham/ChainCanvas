import { NftGallery } from "@/components/nft-gallery";
import { getMockNfts } from "@/lib/data";

export default function Home() {
  const nfts = getMockNfts();

  return (
    <div>
      <NftGallery initialNfts={nfts} />
    </div>
  );
}
