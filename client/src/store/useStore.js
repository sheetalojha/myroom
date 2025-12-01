import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_ROOM_CONFIG, COLOR_THEMES, LIGHTING_PRESETS } from '../config/roomThemes';

// Grid configuration - matches Room.jsx
const GRID_SIZE = 20;
const GRID_DIVISIONS = 20;
const CELL_SIZE = GRID_SIZE / GRID_DIVISIONS; // 1x1 grid cells

// Room boundaries - objects must stay within these bounds
const ROOM_BOUNDS = {
  minX: -GRID_SIZE / 2 + 0.5, // Leave small margin from walls
  maxX: GRID_SIZE / 2 - 0.5,
  minZ: -GRID_SIZE / 2 + 0.5,
  maxZ: GRID_SIZE / 2 - 0.5,
  minY: 0, // Floor level
  maxY: 10, // Room height
};

// Helper function to snap position to grid
export const snapToGrid = (position) => {
  const [x, y, z] = position;
  const snappedX = Math.round(x / CELL_SIZE) * CELL_SIZE;
  const snappedZ = Math.round(z / CELL_SIZE) * CELL_SIZE;
  // Y position stays as is (height)
  return [snappedX, y, snappedZ];
};

// Helper function to clamp position within room bounds
export const clampToRoomBounds = (position) => {
  const [x, y, z] = position;
  const clampedX = Math.max(ROOM_BOUNDS.minX, Math.min(ROOM_BOUNDS.maxX, x));
  const clampedY = Math.max(ROOM_BOUNDS.minY, Math.min(ROOM_BOUNDS.maxY, y));
  const clampedZ = Math.max(ROOM_BOUNDS.minZ, Math.min(ROOM_BOUNDS.maxZ, z));
  return [clampedX, clampedY, clampedZ];
};

const useStore = create((set, get) => ({
  objects: [],
  selectedId: null,
  gridEnabled: true, // Enable grid snapping by default
  mode: 'edit', // 'edit' or 'view'
  currentChamberTokenId: null, // Track the current chamber being edited (for versioning)
  // Room configuration - JSON structure
  roomConfig: DEFAULT_ROOM_CONFIG,
  // Performance settings
  performanceMode: 'high', // 'high', 'medium', 'low'
  shadowQuality: 2048, // Shadow map size
  enableShadows: false, // Disable shadows for performance
  ssaoSamples: 16, // SSAO sample count
  ssaoRadius: 6, // SSAO radius
  ssaoIntensity: 30, // SSAO intensity
  bloomIntensity: 0.3, // Bloom intensity
  enablePostProcessing: true, // Enable post-processing effects

  addObject: (type) => {
    const id = uuidv4();
    // Place new object at center of room, visible position, snapped to grid
    // Position: center of room (0, 1, 0) - 1 unit above floor (y=0) for visibility
    // Floor top is at y=0.001, so y=1 ensures object is well above floor
    const initialPosition = snapToGrid([0, 1, 0]);
    const clampedPosition = clampToRoomBounds(initialPosition);
    
    const newObject = {
      id,
      type,
      position: clampedPosition,
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      data: {},
    };
    set((state) => ({
      objects: [...state.objects, newObject],
      selectedId: id, // Auto-select the new object so it's visible
    }));
  },

  updateObject: (id, props) => {
    set((state) => {
      const updatedProps = { ...props };
      
      // If position is being updated
      if (updatedProps.position) {
        // First snap to grid if enabled
        if (state.gridEnabled) {
          updatedProps.position = snapToGrid(updatedProps.position);
        }
        // Then clamp to room bounds to prevent going outside
        updatedProps.position = clampToRoomBounds(updatedProps.position);
      }
      
      return {
        objects: state.objects.map((obj) =>
          obj.id === id ? { ...obj, ...updatedProps } : obj
        ),
      };
    });
  },

  toggleGrid: () => {
    set((state) => ({ gridEnabled: !state.gridEnabled }));
  },

  removeObject: (id) => {
    set((state) => ({
      objects: state.objects.filter((obj) => obj.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    }));
  },

  selectObject: (id) => {
    set({ selectedId: id });
  },

  loadScene: (sceneData) => {
    set({ 
      objects: sceneData.objects || [],
      roomConfig: sceneData.roomConfig || DEFAULT_ROOM_CONFIG
    });
  },

  setCurrentChamberTokenId: (tokenId) => {
    set({ currentChamberTokenId: tokenId });
  },

  clearCurrentChamberTokenId: () => {
    set({ currentChamberTokenId: null });
  },

  // Room configuration methods
  setColorTheme: (themeName) => {
    const theme = COLOR_THEMES[themeName];
    if (theme) {
      set((state) => ({
        roomConfig: {
          ...state.roomConfig,
          colorTheme: themeName,
          background: theme.background,
          leftWall: theme.leftWall,
          rightWall: theme.rightWall,
          backWall: theme.backWall,
          floor: theme.floor
        }
      }));
    }
  },

  setLighting: (lightingName) => {
    const lighting = LIGHTING_PRESETS[lightingName];
    if (lighting) {
      set((state) => ({
        roomConfig: {
          ...state.roomConfig,
          lighting: lightingName
        }
      }));
    }
  },

  updateRoomConfig: (updates) => {
    set((state) => ({
      roomConfig: {
        ...state.roomConfig,
        ...updates
      }
    }));
  },

  setMode: (mode) => {
    set({ mode });
  },

  // Performance state for UI
  performanceNotification: null, // { show: boolean, message: string, isCritical: boolean }

  setPerformanceNotification: (notification) => {
    set({ performanceNotification: notification });
  },

  // Performance adjustment functions
  adjustPerformanceSettings: (level) => {
    if (level === 'low') {
      set({
        performanceMode: 'low',
        shadowQuality: 1024,
        enableShadows: false, // Disable shadows for low performance
        ssaoSamples: 8,
        ssaoRadius: 4,
        ssaoIntensity: 20,
        bloomIntensity: 0.2,
        enablePostProcessing: true, // Keep enabled but reduced
      });
    } else if (level === 'medium') {
      set({
        performanceMode: 'medium',
        shadowQuality: 1536,
        enableShadows: true, // Keep shadows enabled for medium
        ssaoSamples: 12,
        ssaoRadius: 5,
        ssaoIntensity: 25,
        bloomIntensity: 0.25,
        enablePostProcessing: true,
      });
    } else {
      set({
        performanceMode: 'high',
        shadowQuality: 2048,
        enableShadows: true, // Full shadows for high performance
        ssaoSamples: 16,
        ssaoRadius: 6,
        ssaoIntensity: 30,
        bloomIntensity: 0.3,
        enablePostProcessing: true,
      });
    }
  },
}));

export default useStore;
