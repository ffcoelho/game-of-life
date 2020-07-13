export interface ConfigModel {
  colors: ColorsModel;
  display: DisplayModel;
  grid: GridModel;
  origin: PointModel;
  speed: number;
  universes: UniverseModel[];
}

export interface PointModel {
  x: number;
  y: number;
}

export interface UniverseModel {
  id: string;
  name: string;
  pop: number;
  size: [number, number];
  lastUpdate: number;
  oX: number;
  oY: number;
  oGrid: number;
}

export interface ColorsModel {
  alive: string;
  dead: string;
  grid: string;
  lines: string;
}

interface DisplayModel {
  lines: boolean;
  ruler: boolean;
}

interface GridModel {
  scale: number;
  size: number;
  rulerX: number;
  rulerY: number;
  x: number;
  y: number;
}

export const GRIDS: GridModel[] = [
  { size: 0, scale: 2, rulerX: 40, rulerY: 30, x: 480, y: 360 },
  { size: 1, scale: 4, rulerX: 10, rulerY: 10, x: 240, y: 180 },
  { size: 2, scale: 8, rulerX: 5, rulerY: 5, x: 120, y: 90 },
  { size: 3, scale: 16, rulerX: 5, rulerY: 5, x: 60, y: 45 },
  { size: 4, scale: 24, rulerX: 5, rulerY: 5, x: 40, y: 30 }
];

export const LIFE = {
  r: 40,  // ruler size (px)
  o: 10,  // cells offset
  x: 500,
  y: 380
};

export const THEMES = [
  {
    alive: '#a98f26',
    dead: '#202020',
    grid: '#424242',
    lines: '#666666'
  },
  {
    alive: '#000000',
    dead: '#ffffff',
    grid: '#cccccc',
    lines: '#919191'
  },
  {
    alive: '#2ddf3d',
    dead: '#000000',
    grid: '#2b2b2b',
    lines: '#3d3d3d'
  }
];
