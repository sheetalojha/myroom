import { Bed, Sofa, Table, Chair, Bookshelf } from './Furniture';
import { Rug, WallArt, Mirror, Plant } from './Decor';
import { Lamp, FairyLights } from './Lighting';
import { Plushie, Mug } from './Cute';

export const Registry = {
    bed: { component: Bed, category: 'Furniture', label: 'Cozy Bed' },
    sofa: { component: Sofa, category: 'Furniture', label: 'Sofa' },
    table: { component: Table, category: 'Furniture', label: 'Table' },
    chair: { component: Chair, category: 'Furniture', label: 'Chair' },
    bookshelf: { component: Bookshelf, category: 'Furniture', label: 'Bookshelf' },

    rug: { component: Rug, category: 'Decor', label: 'Rug' },
    wall_art: { component: WallArt, category: 'Decor', label: 'Painting' },
    mirror: { component: Mirror, category: 'Decor', label: 'Mirror' },
    plant: { component: Plant, category: 'Decor', label: 'Potted Plant' },

    lamp: { component: Lamp, category: 'Lighting', label: 'Desk Lamp' },
    fairy_lights: { component: FairyLights, category: 'Lighting', label: 'Fairy Lights' },

    plushie: { component: Plushie, category: 'Cute', label: 'Plushie' },
    mug: { component: Mug, category: 'Cute', label: 'Coffee Mug' },
};

export const Categories = ['Furniture', 'Decor', 'Lighting', 'Cute'];
