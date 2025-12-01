import React, { useEffect } from 'react';
import Scene from '../components/Scene';
import UIOverlay from '../components/UIOverlay';
import useStore from '../store/useStore';

const EditorPage = () => {
  const roomConfig = useStore((state) => state.roomConfig);
  const setMode = useStore((state) => state.setMode);
  const currentChamberTokenId = useStore((state) => state.currentChamberTokenId);
  const clearCurrentChamberTokenId = useStore((state) => state.clearCurrentChamberTokenId);
  const background = roomConfig?.background?.gradient || 'radial-gradient(circle at center, #E6F2FF 0%, #B3D9FF 50%, #87CEEB 100%)';
  
  useEffect(() => {
    // Set to edit mode when editor loads
    setMode('edit');
    // Only clear currentChamberTokenId if we're starting fresh (no objects loaded)
    // This allows versioning to work when editing an existing chamber
    const objects = useStore.getState().objects;
    if (objects.length === 0 && currentChamberTokenId !== null) {
      clearCurrentChamberTokenId();
    }
  }, [setMode]);
  
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
};

export default EditorPage;

