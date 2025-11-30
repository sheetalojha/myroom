import React from 'react';
import Scene from './components/Scene';
import UIOverlay from './components/UIOverlay';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Scene />
      <UIOverlay />
    </div>
  );
}

export default App;
