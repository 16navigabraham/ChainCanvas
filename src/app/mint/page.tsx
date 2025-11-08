'use client';
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { uploadImageToPinata, uploadMetadataToPinata, NFTMetadata } from "../../lib/pinata";
import { mintNFT, getUserPoints, switchToBase } from "../../lib/contract";

export default function MintNFTPage() {
  const [account, setAccount] = useState<string>("");
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  
  // Form state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [nftName, setNftName] = useState("");
  const [nftSymbol, setNftSymbol] = useState("");
  const [description, setDescription] = useState("");
  
  // Upload & Mint state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingMetadata, setUploadingMetadata] = useState(false);
  const [minting, setMinting] = useState(false);
  const [imageIpfsUrl, setImageIpfsUrl] = useState("");
  const [metadataIpfsUrl, setMetadataIpfsUrl] = useState("");
  
  // User stats
  const [userPoints, setUserPoints] = useState(0);
  
  // Status messages
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    checkWalletConnection();
  }, []);

  useEffect(() => {
    if (account && provider) {
      loadUserPoints();
    }
  }, [account, provider]);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        connectWallet();
      }
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setStatus({ type: "error", message: "Please install MetaMask" });
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      await switchToBase();
      
      const ethersSigner = await ethersProvider.getSigner();
      
      setProvider(ethersProvider);
      setSigner(ethersSigner);
      setAccount(accounts[0]);
      setStatus({ type: "success", message: "Wallet connected!" });
    } catch (error: any) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const loadUserPoints = async () => {
    if (!provider || !account) return;
    try {
      const points = await getUserPoints(provider, account);
      setUserPoints(points);
    } catch (error) {
      console.error("Error loading points:", error);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setStatus({ type: "error", message: "Please select an image file" });
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setStatus({ type: "error", message: "File size must be less than 10MB" });
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUploadImage = async () => {
    if (!imageFile) {
      setStatus({ type: "error", message: "Please select an image" });
      return;
    }

    setUploadingImage(true);
    setStatus({ type: "info", message: "Uploading image to IPFS..." });

    try {
      const ipfsUrl = await uploadImageToPinata(imageFile);
      setImageIpfsUrl(ipfsUrl);
      setStatus({ type: "success", message: "Image uploaded to IPFS!" });
    } catch (error: any) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleMint = async () => {
    if (!signer || !imageIpfsUrl || !nftName || !nftSymbol) {
      setStatus({ type: "error", message: "Please fill all required fields" });
      return;
    }

    try {
      // Step 1: Create and upload metadata
      setUploadingMetadata(true);
      setStatus({ type: "info", message: "Creating metadata..." });

      const metadata: NFTMetadata = {
        name: nftName,
        description: description || `${nftName} NFT`,
        image: imageIpfsUrl,
      };

      const metadataUrl = await uploadMetadataToPinata(metadata);
      setMetadataIpfsUrl(metadataUrl);
      setUploadingMetadata(false);

      // Step 2: Mint NFT
      setMinting(true);
      setStatus({ type: "info", message: "Minting NFT... Please confirm transaction" });

      const receipt = await mintNFT(signer, metadataUrl, nftName, nftSymbol);

      setStatus({
        type: "success",
        message: `NFT Minted! Tx: ${receipt.hash}`,
      });

      // Reset form
      setImageFile(null);
      setImagePreview("");
      setNftName("");
      setNftSymbol("");
      setDescription("");
      setImageIpfsUrl("");
      setMetadataIpfsUrl("");

      // Refresh points
      await loadUserPoints();
    } catch (error: any) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setUploadingMetadata(false);
      setMinting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">Mint Your NFT</h1>
          <p className="text-blue-200">Upload to IPFS and mint on Base mainnet</p>
        </div>

        {/* Status Message */}
        {status.message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              status.type === "success"
                ? "bg-green-500/20 text-green-300"
                : status.type === "error"
                ? "bg-red-500/20 text-red-300"
                : "bg-blue-500/20 text-blue-300"
            }`}
          >
            {status.message}
          </div>
        )}

        {!account ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 text-center">
            <button
              onClick={connectWallet}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Stats */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-white font-bold text-xl mb-2">Your Stats</h2>
              <p className="text-blue-200">
                Points: <span className="text-yellow-400 font-bold">{userPoints}</span> ({userPoints / 2} NFTs minted)
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Wallet: {account.slice(0, 6)}...{account.slice(-4)}
              </p>
            </div>

            {/* Upload Form */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-white font-bold text-xl mb-4">Step 1: Upload Image</h2>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="mb-4 text-white"
              />

              {imagePreview && (
                <div className="mb-4">
                  <img src={imagePreview} alt="Preview" className="w-64 h-64 object-cover rounded-lg" />
                </div>
              )}

              <button
                onClick={handleUploadImage}
                disabled={!imageFile || uploadingImage}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white rounded-lg font-bold"
              >
                {uploadingImage ? "Uploading..." : "Upload to IPFS"}
              </button>

              {imageIpfsUrl && (
                <p className="text-green-400 text-sm mt-2">✓ Uploaded: {imageIpfsUrl}</p>
              )}
            </div>

            {/* NFT Details */}
            {imageIpfsUrl && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-white font-bold text-xl mb-4">Step 2: NFT Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-blue-200 mb-2">NFT Name *</label>
                    <input
                      type="text"
                      value={nftName}
                      onChange={(e) => setNftName(e.target.value)}
                      placeholder="e.g., Cool Ape #123"
                      className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-blue-200 mb-2">Symbol *</label>
                    <input
                      type="text"
                      value={nftSymbol}
                      onChange={(e) => setNftSymbol(e.target.value.toUpperCase())}
                      placeholder="e.g., APE123"
                      maxLength={10}
                      className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-blue-200 mb-2">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your NFT..."
                      rows={3}
                      className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white"
                    />
                  </div>

                  <button
                    onClick={handleMint}
                    disabled={minting || uploadingMetadata || !nftName || !nftSymbol}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-xl font-bold"
                  >
                    {minting || uploadingMetadata ? "Minting..." : "Mint NFT"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
