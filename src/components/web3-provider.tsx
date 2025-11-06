'use client';

import { WagmiProvider, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

// You can get a WalletConnect Project ID from https://cloud.walletconnect.com
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!walletConnectProjectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set');
}

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
