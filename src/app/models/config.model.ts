export interface ConfigModel {
  colors: ColorsModel;
  darkMode: boolean;
  display: DisplayModel;
  grid: GridModel;
  origin: PointModel;
  speed: number;
}

export interface PointModel {
  x: number;
  y: number;
}

interface ColorsModel {
  alive: string;
  dead: string;
  grid: string;
  guide: string;
  label: string;
  ruler: string;
}

interface DisplayModel {
  grid: boolean;
  guide: boolean;
  ruler: boolean;
}

interface GridModel {
  scale: number;
  size: number;
  x: number;
  y: number;
}

export const GRIDS: GridModel[] = [
  { size: 0, scale: 2, x: 480, y: 360 },
  { size: 1, scale: 4, x: 240, y: 180 },
  { size: 2, scale: 8, x: 120, y: 90 },
  { size: 3, scale: 16, x: 60, y: 45 },
  { size: 4, scale: 24, x: 40, y: 30 }
];

export const LIFE = {
  r: 40,  // ruler size (px)
  o: 10,  // cells offset
  x: 500,
  y: 380
};
