// Room color themes with auto-selected configurations
export const COLOR_THEMES = {
  light: {
    name: 'Light',
    background: {
      type: 'gradient',
      colors: ['#F5F5F0', '#E8E8E5', '#D8D8D5'],
      gradient: 'radial-gradient(circle at center, #F5F5F0 0%, #E8E8E5 50%, #D8D8D5 100%)'
    },
    leftWall: {
      color: '#D8D8D5',
      topColor: '#E5E5E2',
      visible: true,
      style: 'tint' // 'tint', 'wallpaper', 'hide'
    },
    rightWall: {
      color: '#E8E8E5',
      topColor: '#F0F0ED',
      visible: true,
      style: 'tint'
    },
    backWall: {
      color: '#E8E8E5',
      topColor: '#F0F0ED',
      visible: true,
      style: 'tint'
    },
    floor: {
      color: '#8B5A3C', // Medium chestnut
      color2: '#A06647', // Lighter chestnut
      style: 'wood'
    }
  },
  dark: {
    name: 'Dark',
    background: {
      type: 'gradient',
      colors: ['#1A1A1A', '#2D2D2D', '#3A3A3A'],
      gradient: 'radial-gradient(circle at center, #1A1A1A 0%, #2D2D2D 50%, #3A3A3A 100%)'
    },
    leftWall: {
      color: '#2D2D2D',
      topColor: '#3A3A3A',
      visible: true,
      style: 'tint'
    },
    rightWall: {
      color: '#252525',
      topColor: '#303030',
      visible: true,
      style: 'tint'
    },
    backWall: {
      color: '#2A2A2A',
      topColor: '#353535',
      visible: true,
      style: 'tint'
    },
    floor: {
      color: '#1A0F0A', // Dark wood
      color2: '#2C1810',
      style: 'wood'
    }
  },
  starryNight: {
    name: 'Starry Night',
    background: {
      type: 'gradient',
      colors: ['#0A0E27', '#1A1F3A', '#2A2F4A'],
      gradient: 'radial-gradient(circle at center, #0A0E27 0%, #1A1F3A 50%, #2A2F4A 100%)'
    },
    leftWall: {
      color: '#1A1F3A',
      topColor: '#252A45',
      visible: true,
      style: 'tint'
    },
    rightWall: {
      color: '#1F2440',
      topColor: '#2A2F50',
      visible: true,
      style: 'tint'
    },
    backWall: {
      color: '#1A1F3A',
      topColor: '#252A45',
      visible: true,
      style: 'tint'
    },
    floor: {
      color: '#0F1419', // Dark blue-black
      color2: '#1A1F2A',
      style: 'wood'
    }
  },
  babyPowder: {
    name: 'Baby Powder',
    background: {
      type: 'gradient',
      colors: ['#FEFEFE', '#F8F8F8', '#F0F0F0'],
      gradient: 'radial-gradient(circle at center, #FEFEFE 0%, #F8F8F8 50%, #F0F0F0 100%)'
    },
    leftWall: {
      color: '#F5F5F0',
      topColor: '#FAFAF5',
      visible: true,
      style: 'tint'
    },
    rightWall: {
      color: '#F8F8F3',
      topColor: '#FDFDF8',
      visible: true,
      style: 'tint'
    },
    backWall: {
      color: '#F5F5F0',
      topColor: '#FAFAF5',
      visible: true,
      style: 'tint'
    },
    floor: {
      color: '#E8D5C4', // Light beige
      color2: '#F0E0D0',
      style: 'wood'
    }
  },
  sunset: {
    name: 'Sunset',
    background: {
      type: 'gradient',
      colors: ['#FFE5CC', '#FFD4A3', '#FFB366'],
      gradient: 'radial-gradient(circle at center, #FFE5CC 0%, #FFD4A3 50%, #FFB366 100%)'
    },
    leftWall: {
      color: '#FFD4A3',
      topColor: '#FFE5CC',
      visible: true,
      style: 'tint'
    },
    rightWall: {
      color: '#FFC98A',
      topColor: '#FFD9B3',
      visible: true,
      style: 'tint'
    },
    backWall: {
      color: '#FFD4A3',
      topColor: '#FFE5CC',
      visible: true,
      style: 'tint'
    },
    floor: {
      color: '#D4A373', // Warm tan
      color2: '#E6B894',
      style: 'wood'
    }
  },
  ocean: {
    name: 'Ocean',
    background: {
      type: 'gradient',
      colors: ['#E6F2FF', '#B3D9FF', '#87CEEB'],
      gradient: 'radial-gradient(circle at center, #E6F2FF 0%, #B3D9FF 50%, #87CEEB 100%)'
    },
    leftWall: {
      color: '#B3D9FF',
      topColor: '#C6E5FF',
      visible: true,
      style: 'tint'
    },
    rightWall: {
      color: '#A8D4FF',
      topColor: '#BDE0FF',
      visible: true,
      style: 'tint'
    },
    backWall: {
      color: '#B3D9FF',
      topColor: '#C6E5FF',
      visible: true,
      style: 'tint'
    },
    floor: {
      color: '#5A8FA3', // Ocean blue-grey
      color2: '#6BA0B5',
      style: 'wood'
    }
  },
  forest: {
    name: 'Forest',
    background: {
      type: 'gradient',
      colors: ['#E8F5E9', '#C8E6C9', '#A5D6A7'],
      gradient: 'radial-gradient(circle at center, #E8F5E9 0%, #C8E6C9 50%, #A5D6A7 100%)'
    },
    leftWall: {
      color: '#C8E6C9',
      topColor: '#D8F0D9',
      visible: true,
      style: 'tint'
    },
    rightWall: {
      color: '#B8DEB9',
      topColor: '#CEEBCF',
      visible: true,
      style: 'tint'
    },
    backWall: {
      color: '#C8E6C9',
      topColor: '#D8F0D9',
      visible: true,
      style: 'tint'
    },
    floor: {
      color: '#6B8E5A', // Forest green-brown
      color2: '#7A9E69',
      style: 'wood'
    }
  }
};

// Lighting presets
export const LIGHTING_PRESETS = {
  bright: {
    name: 'Bright',
    ambientIntensity: 0.5,
    directionalIntensity: 2.0,
    fillIntensity: 0.4,
    color: '#FFFFFF'
  },
  medium: {
    name: 'Medium',
    ambientIntensity: 0.3,
    directionalIntensity: 1.5,
    fillIntensity: 0.2,
    color: '#FFFFFF'
  },
  dark: {
    name: 'Dark',
    ambientIntensity: 0.2,
    directionalIntensity: 1.0,
    fillIntensity: 0.1,
    color: '#FFFFFF'
  },
  warm: {
    name: 'Warm',
    ambientIntensity: 0.35,
    directionalIntensity: 1.6,
    fillIntensity: 0.25,
    color: '#FFF8E1' // Warm white
  },
  cool: {
    name: 'Cool',
    ambientIntensity: 0.3,
    directionalIntensity: 1.5,
    fillIntensity: 0.2,
    color: '#E3F2FD' // Cool blue-white
  }
};

// Wall color presets
export const WALL_COLOR_PRESETS = [
  { name: 'Off White', color: '#E8E8E5', topColor: '#F0F0ED' },
  { name: 'Cool Grey', color: '#D8D8D5', topColor: '#E5E5E2' },
  { name: 'Warm Beige', color: '#E5DDD0', topColor: '#F0E8DB' },
  { name: 'Light Blue', color: '#D8E8F0', topColor: '#E5F0F8' },
  { name: 'Soft Pink', color: '#F0E0E0', topColor: '#F8E8E8' },
  { name: 'Mint Green', color: '#D8F0E0', topColor: '#E5F8E8' },
  { name: 'Lavender', color: '#E8D8F0', topColor: '#F0E5F8' },
  { name: 'Peach', color: '#F0D8C8', topColor: '#F8E5D8' }
];

// Floor color presets
export const FLOOR_COLOR_PRESETS = [
  { name: 'Medium Chestnut', color: '#8B5A3C', color2: '#A06647' },
  { name: 'Dark Oak', color: '#5D4037', color2: '#6D4C41' },
  { name: 'Light Oak', color: '#D4A373', color2: '#E6B894' },
  { name: 'Walnut', color: '#6B4423', color2: '#7B5433' },
  { name: 'Cherry', color: '#A0522D', color2: '#B0623D' },
  { name: 'Ash', color: '#B8B8A8', color2: '#C8C8B8' },
  { name: 'Dark Grey', color: '#3A3A3A', color2: '#4A4A4A' },
  { name: 'Light Beige', color: '#E8D5C4', color2: '#F0E0D0' }
];

// Default room configuration
export const DEFAULT_ROOM_CONFIG = {
  colorTheme: 'ocean', // Default to ocean (current bluish bg)
  lighting: 'medium',
  background: COLOR_THEMES.ocean.background,
  leftWall: COLOR_THEMES.ocean.leftWall,
  rightWall: COLOR_THEMES.ocean.rightWall,
  backWall: COLOR_THEMES.ocean.backWall,
  floor: COLOR_THEMES.ocean.floor
};

