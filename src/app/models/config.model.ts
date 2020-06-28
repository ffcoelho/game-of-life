export interface ConfigModel {
  colors: ColorsModel;
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
  led: string;
  panel: string;
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
