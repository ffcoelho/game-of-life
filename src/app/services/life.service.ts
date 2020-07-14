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
    for (let y = 0; y < LIFE.y; y++) {
      this.universe[y] = Array.from(this.nextGen[y]);
    }
    this.clearLines();
  }

  clearLines(): void {
    if (this.alt < 5) {
      this.alt++;
      return;
    }
    for (let i = 0; i < LIFE.x; i++) {
      this.universe[1][i] = 0;
      this.universe[2][i] = 0;
      this.universe[3][i] = 0;
      this.universe[4][i] = 0;
      this.universe[LIFE.y - 2][i] = 0;
      this.universe[LIFE.y - 3][i] = 0;
      this.universe[LIFE.y - 4][i] = 0;
      this.universe[LIFE.y - 5][i] = 0;
    }
    for (let i = 0; i < LIFE.y; i++) {
      this.universe[i][1] = 0;
      this.universe[i][2] = 0;
      this.universe[i][3] = 0;
      this.universe[i][4] = 0;
      this.universe[i][LIFE.x - 2] = 0;
      this.universe[i][LIFE.x - 3] = 0;
      this.universe[i][LIFE.x - 4] = 0;
      this.universe[i][LIFE.x - 5] = 0;
    }
    this.alt = 0;
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
