export interface ConfigModel {
  mode: ModeType;
  size: number;
  speed: number;
  grid: boolean;
  colors: ColorModel;
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
  { x: 480, y: 360, scale: 1 },
  { x: 480, y: 360, scale: 2 },
  { x: 480, y: 360, scale: 4 },
  { x: 480, y: 360, scale: 8 },
  { x: 480, y: 360, scale: 24 }
  // { x: 480, y: 360, scale: 1 },
  // { x: 240, y: 180, scale: 2 },
  // { x: 120, y: 90, scale: 4 },
  // { x: 60, y: 45, scale: 8 },
  // { x: 20, y: 15, scale: 24 }
];

export enum ModeType {
  'MOBILE' = 1,
  'DESKTOP' = 2
}
