'use client';

import { WagmiProvider, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

// --- IMPORTANT ---
// You can get a WalletConnect Project ID from https://cloud.walletconnect.com
const walletConnectProjectId = 'c4f7964143431d10450599c9d9a04b12';

const config = createConfig({
  chains: [base],
  connectors: [
    injected({
        shimDisconnect: true,
    }),
    walletConnect({
        projectId: walletConnectProjectId,
    }),
    coinbaseWallet({
        appName: 'ChainCanvas',
    }),
  ],
  transports: {
    [base.id]: (
      typeof window !== 'undefined' && window.ethereum
        ? {type: 'custom', getRpcClient: async () => window.ethereum}
        : {type: 'fallback', rank: true, transports: []}
    ),
  },
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
