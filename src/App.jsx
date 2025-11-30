import React from 'react';
import Scene from './components/Scene';
import UIOverlay from './components/UIOverlay';

function App() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative',
      background: 'radial-gradient(circle at center, #E6F2FF 0%, #B3D9FF 50%, #87CEEB 100%)'
    }}>
      <Scene />
      <UIOverlay />
    </div>
  );
}

export default App;
