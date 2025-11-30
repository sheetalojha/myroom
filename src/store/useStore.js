import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const useStore = create((set, get) => ({
  objects: [],
  selectedId: null,

  addObject: (type) => {
    const id = uuidv4();
    const newObject = {
      id,
      type,
      position: [0, 1, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      data: {},
    };
    set((state) => ({
      objects: [...state.objects, newObject],
      selectedId: id,
    }));
  },

  updateObject: (id, props) => {
    set((state) => ({
      objects: state.objects.map((obj) =>
        obj.id === id ? { ...obj, ...props } : obj
      ),
    }));
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
}));

export default useStore;
