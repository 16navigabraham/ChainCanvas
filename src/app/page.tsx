'use client';
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from 'next/navigation';
import { switchToBase } from "../lib/contract";

export default function LandingPage() {
  const [account, setAccount] = useState<string>("");
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (account) {
      router.push('/gallery');
    }
  }, [account, router]);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      await switchToBase();
      
      const ethersSigner = await ethersProvider.getSigner();
      
      setProvider(ethersProvider);
      setAccount(accounts[0]);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center text-center p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12">
        <h1 className="text-5xl font-bold text-white mb-4">Welcome to ChainCanvas</h1>
        <p className="text-blue-200 mb-8">Your platform to mint and showcase your NFTs on the Base network.</p>
        <button
          onClick={connectWallet}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
}
