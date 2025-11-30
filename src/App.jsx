import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from './config/web3Config';
import Scene from './components/Scene';
import UIOverlay from './components/UIOverlay';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
          <Scene />
          <UIOverlay />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
