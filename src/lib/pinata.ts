
import { PinataSDK } from "pinata-web3";

// Get API keys from: https://app.pinata.cloud/developers/api-keys
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || "your_jwt_here";

export const pinata = new PinataSDK({
  pinataJwt: PINATA_JWT,
  pinataGateway: "example-gateway.mypinata.cloud", // Your gateway
});

// Upload image to IPFS
export async function uploadImageToPinata(file: File): Promise<string> {
  try {
    const upload = await pinata.upload.file(file);
    const ipfsUrl = `ipfs://${upload.IpfsHash}`;
    return ipfsUrl;
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    throw new Error("Failed to upload image");
  }
}

// Upload metadata JSON to IPFS
export async function uploadMetadataToPinata(
  metadata: NFTMetadata
): Promise<string> {
  try {
    const upload = await pinata.upload.json(metadata);
    const ipfsUrl = `ipfs://${upload.IpfsHash}`;
    return ipfsUrl;
  } catch (error) {
    console.error("Error uploading metadata:", error);
    throw new Error("Failed to upload metadata");
  }
}

// NFT Metadata standard (ERC721)
export interface NFTMetadata {
  name: string;
  description: string;
  image: string; // IPFS URL of image
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}
