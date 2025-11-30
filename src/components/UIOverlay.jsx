import React, { useState } from 'react';
import useStore from '../store/useStore';
import { Leva } from 'leva';
import { Registry, Categories } from './library/Registry';
import {
    Armchair,
    Lamp,
    Flower2,
    Smile,
    Save,
    Upload,
    Trash2,
    Box
} from 'lucide-react';

const CategoryIcons = {
    Furniture: Armchair,
    Decor: Flower2,
    Lighting: Lamp,
    Cute: Smile,
};

const UIOverlay = () => {
    const addObject = useStore((state) => state.addObject);
    const objects = useStore((state) => state.objects);
    const loadScene = useStore((state) => state.loadScene);

    const [activeCategory, setActiveCategory] = useState('Furniture');

    const handleSave = () => {
        const data = JSON.stringify({ objects });
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'room-scene.json';
        a.click();
    };

    const handleLoad = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    loadScene(data);
                } catch (err) {
                    console.error('Failed to load scene', err);
                }
            };
            reader.readAsText(file);
        }
    };

    const filteredItems = Object.entries(Registry).filter(
        ([key, item]) => item.category === activeCategory
    );

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>

            {/* Top Bar */}
            <div style={{
                position: 'absolute',
                top: 20,
                right: 20,
                display: 'flex',
                gap: 10,
                pointerEvents: 'auto'
            }}>
                <button className="btn-secondary" onClick={handleSave}>
                    <Save size={16} /> Save
                </button>
                <label className="btn-secondary">
                    <Upload size={16} /> Load
                    <input type="file" accept=".json" onChange={handleLoad} style={{ display: 'none' }} />
                </label>
            </div>

            {/* Left Sidebar (Library) */}
            <div style={{
                position: 'absolute',
                top: 20,
                left: 20,
                bottom: 20,
                width: 280,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: 16,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                pointerEvents: 'auto',
                overflow: 'hidden'
            }}>
                <div style={{ padding: 20, borderBottom: '1px solid #eee' }}>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Library</h2>
                </div>

                {/* Categories */}
                <div style={{ display: 'flex', gap: 5, padding: '10px 15px', overflowX: 'auto' }}>
                    {Categories.map((cat) => {
                        const Icon = CategoryIcons[cat] || Box;
                        return (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: 20,
                                    border: 'none',
                                    background: activeCategory === cat ? '#222' : '#f0f0f0',
                                    color: activeCategory === cat ? '#fff' : '#444',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    fontSize: 13,
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Icon size={14} />
                                {cat}
                            </button>
                        );
                    })}
                </div>

                {/* Grid */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: 15,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 10,
                    alignContent: 'start'
                }}>
                    {filteredItems.map(([type, item]) => (
                        <div
                            key={type}
                            onClick={() => addObject(type)}
                            style={{
                                aspectRatio: '1',
                                background: '#f8f9fa',
                                borderRadius: 12,
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #eee',
                                transition: 'all 0.2s',
                                padding: 10
                            }}
                            className="library-item"
                        >
                            <div style={{ fontSize: 24, marginBottom: 8 }}>
                                {/* Placeholder for thumbnail, using emoji or icon based on type could be cool, 
                    but for now just a generic shape or the label */}
                                <Box size={32} color="#888" strokeWidth={1} />
                            </div>
                            <span style={{ fontSize: 12, textAlign: 'center', color: '#555' }}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Leva Panel (Properties) */}
            <div style={{ position: 'absolute', top: 80, right: 20, pointerEvents: 'auto' }}>
                <Leva fill flat titleBar={false} theme={{
                    colors: {
                        elevation1: '#ffffff',
                        elevation2: '#f5f5f5',
                        elevation3: '#eeeeee',
                        accent1: '#007bff',
                        accent2: '#0056b3',
                        accent3: '#004494',
                        highlight1: '#555555',
                        highlight2: '#333333',
                        highlight3: '#111111',
                        vivid1: '#ffcc00',
                    },
                    radii: {
                        xs: '4px',
                        sm: '8px',
                        lg: '12px',
                    },
                }} />
            </div>

            <style>{`
        .btn-secondary {
          background: white;
          border: 1px solid #ddd;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          background: #f8f8f8;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .library-item:hover {
          background: white !important;
          border-color: #222 !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #ddd;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #ccc;
        }
      `}</style>
        </div>
    );
};

export default UIOverlay;
