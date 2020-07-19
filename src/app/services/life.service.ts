import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfigModel, LIFE } from '../models/config.model';
import { ThemeService } from './theme.service';

@Injectable({
  providedIn: 'root'
})
export class LifeService {

  public create: Subject<ConfigModel> = new Subject<ConfigModel>();

  // [y][x]
  public universe: number[][];
  public nextGen: number[][];
  public zeroState: number[][];

  private alt = 0;

  constructor(private theme: ThemeService) { }

  calcNextGen(): void {
    this.nextGen.forEach(y => y.fill(0));
    for (let y = 1; y < LIFE.y - 2; y++) {
      for (let x = 1; x < LIFE.x - 2; x++) {
        this.nextGen[y][x] = this.checkCell(y, x, this.universe[y][x]);
      }
    }
    this.checkBoundaries();
    for (let y = 0; y < LIFE.y; y++) {
      this.universe[y] = Array.from(this.nextGen[y]);
    }
  }

  checkCell(yU: number, xU: number, state: number): number {
    const neighbours: number = this.universe[yU - 1][xU - 1] + this.universe[yU - 1][xU] + this.universe[yU - 1][xU + 1]
    + this.universe[yU][xU - 1] + this.universe[yU][xU + 1]
    + this.universe[yU + 1][xU - 1] + this.universe[yU + 1][xU] + this.universe[yU + 1][xU + 1];
    if (state === 0) {
      if (neighbours === 3) {
        return 1;
      }
      return 0;
    } else {
      if (neighbours < 2 || neighbours > 3) {
        return 0;
      }
      return 1;
    }
  }

  checkBoundaries(): void {
    let hits = 0;
    for (let x = 1; x < LIFE.x - 2; x++) {
      if (this.nextGen[1][x] === 1 || this.nextGen[LIFE.y - 2][x] === 1) {
        hits++;
      }
    }
    for (let y = 1; y < LIFE.y - 2; y++) {
      if (this.nextGen[y][1] === 1 || this.nextGen[y][LIFE.x - 2] === 1) {
        hits++;
      }
    }
    if (hits === 0) {
      return;
    }
    this.clearBoundariesCells();
  }

  clearBoundariesCells(): void {
    for (let x = 1; x < LIFE.x - 2; x++) {
      this.nextGen[1][x] = 0;
      this.nextGen[2][x] = 0;
      this.nextGen[3][x] = 0;
      this.nextGen[4][x] = 0;
      this.nextGen[5][x] = 0;
      this.nextGen[6][x] = 0;
      this.nextGen[7][x] = 0;
      this.nextGen[LIFE.y - 2][x] = 0;
      this.nextGen[LIFE.y - 3][x] = 0;
      this.nextGen[LIFE.y - 4][x] = 0;
      this.nextGen[LIFE.y - 5][x] = 0;
      this.nextGen[LIFE.y - 6][x] = 0;
      this.nextGen[LIFE.y - 7][x] = 0;
      this.nextGen[LIFE.y - 8][x] = 0;
    }
    for (let y = 1; y < LIFE.y - 2; y++) {
      this.nextGen[y][1] = 0;
      this.nextGen[y][2] = 0;
      this.nextGen[y][3] = 0;
      this.nextGen[y][4] = 0;
      this.nextGen[y][5] = 0;
      this.nextGen[y][6] = 0;
      this.nextGen[y][7] = 0;
      this.nextGen[y][LIFE.x - 2] = 0;
      this.nextGen[y][LIFE.x - 3] = 0;
      this.nextGen[y][LIFE.x - 4] = 0;
      this.nextGen[y][LIFE.x - 5] = 0;
      this.nextGen[y][LIFE.x - 6] = 0;
      this.nextGen[y][LIFE.x - 7] = 0;
      this.nextGen[y][LIFE.x - 8] = 0;
    }
  }

  startUniverse(config: ConfigModel): void {
    this.universe = this.newGrid();
    this.nextGen = this.newGrid();
    this.zeroState = this.newGrid();
    this.theme.updateStyleVars(config);
    this.create.next(config);
  }

  setZeroState(): void {
    this.zeroState = this.newGrid();
    for (let y = 0; y < LIFE.y; y++) {
      this.zeroState[y] = Array.from(this.universe[y]);
    }
  }

  restartUniverse(clear?: boolean): void {
    if (clear) {
      this.universe = this.newGrid();
    } else {
      for (let y = 0; y < LIFE.y; y++) {
        this.universe[y] = Array.from(this.zeroState[y]);
      }
    }
    this.nextGen = this.newGrid();
  }

  newGrid(): number[][] {
    const grid = Array.from({length: LIFE.y}).map(value => Array.from({length: LIFE.x}).map(v => 0));
    return grid;
  }
}
