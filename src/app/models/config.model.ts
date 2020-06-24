export interface ConfigModel {
  colors: ColorsModel;
  displayGrid: boolean;
  grid: GridModel;
  origin: [number, number];
  size: number;
  speed: number;
}

export interface NewConfigModel {
  colors: ColorsModel;
  grid: GridModel;
}

interface ColorsModel {
  alive: string;
  dead: string;
  grid: string;
  ruler: string;
  rulerMark: string;
}

export interface ColorModel {
  alive: string;
  dead: string;
  grid: string;
}

export interface GridModel {
  x: number;
  y: number;
  scale: number;
}

export const GRIDS: GridModel[] = [
  { x: 480, y: 360, scale: 2 },
  { x: 240, y: 180, scale: 4 },
  { x: 120, y: 90, scale: 8 },
  { x: 60, y: 45, scale: 16 },
  { x: 40, y: 30, scale: 24 }
];
