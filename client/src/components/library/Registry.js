import { Bed, Sofa, Table, Chair, Bookshelf } from './Furniture';
import { Rug, WallArt, Mirror, Plant } from './Decor';
import { Lamp, FairyLights } from './Lighting';
import { Plushie, Mug } from './Cute';
import { VoxelTV, VoxelComputer, VoxelClock, VoxelCactus, VoxelLamp, VoxelVase, VoxelBooks, VoxelPillow } from './MoreObjects';
import { Human } from './Human';

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
    cactus: { component: VoxelCactus, category: 'Decor', label: 'Cactus' },
    vase: { component: VoxelVase, category: 'Decor', label: 'Vase' },
    books: { component: VoxelBooks, category: 'Decor', label: 'Books' },

    lamp: { component: Lamp, category: 'Lighting', label: 'Desk Lamp' },
    fairy_lights: { component: FairyLights, category: 'Lighting', label: 'Fairy Lights' },
    voxel_lamp: { component: VoxelLamp, category: 'Lighting', label: 'Voxel Lamp' },

    plushie: { component: Plushie, category: 'Cute', label: 'Plushie' },
    mug: { component: Mug, category: 'Cute', label: 'Coffee Mug' },
    pillow: { component: VoxelPillow, category: 'Cute', label: 'Pillow' },

    tv: { component: VoxelTV, category: 'Electronics', label: 'TV' },
    computer: { component: VoxelComputer, category: 'Electronics', label: 'Computer' },
    clock: { component: VoxelClock, category: 'Electronics', label: 'Clock' },

    human: { component: Human, category: 'Characters', label: 'Human', isPhysics: true },
};

export const Categories = ['Furniture', 'Decor', 'Lighting', 'Cute', 'Electronics', 'Characters'];
