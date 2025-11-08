'use client';

import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';

export default function LandingPage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push('/gallery');
    }
  }, [isConnected, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center text-center p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12">
        <h1 className="text-5xl font-bold text-white mb-4">Welcome to ChainCanvas</h1>
        <p className="text-blue-200 mb-8">Your platform to mint and showcase your NFTs on the Base network.</p>
        <appkit-button />
      </div>
    </div>
  );
}
