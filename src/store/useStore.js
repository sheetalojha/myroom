import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

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
    set({ objects: sceneData.objects || [] });
  },

  setMode: (mode) => {
    set({ mode });
  },
}));

export default useStore;
