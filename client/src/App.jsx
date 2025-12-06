import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { sdk } from "@farcaster/miniapp-sdk";
import { wagmiConfig } from './config/web3Config';
import LandingPage from './pages/LandingPage';
import EditorPage from './pages/EditorPage';
import ExplorePage from './pages/ExplorePage';
import LittleWorldViewerPage from './pages/LittleWorldViewerPage';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/littleworld/:tokenId" element={<LittleWorldViewerPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
