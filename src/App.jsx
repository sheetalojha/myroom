import React from 'react';
import Scene from './components/Scene';
import UIOverlay from './components/UIOverlay';
import useStore from './store/useStore';

function App() {
  const roomConfig = useStore((state) => state.roomConfig);
  const background = roomConfig?.background?.gradient || 'radial-gradient(circle at center, #E6F2FF 0%, #B3D9FF 50%, #87CEEB 100%)';
  
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative',
      background: background
    }}>
      <Scene />
      <UIOverlay />
    </div>
  );
}

export default App;
