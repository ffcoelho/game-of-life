import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfigModel, LIFE } from '../models/config.model';
import { ThemeService } from './theme.service';

@Injectable({
  providedIn: 'root'
})
export class LifeService {

  public create: Subject<ConfigModel> = new Subject<ConfigModel>();

  public universe: number[][];
  public nextGen: number[][];

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
    this.theme.updateStyleVars(config);
    this.create.next(config);
  }

  newGrid(): number[][] {
    const grid = Array.from({length: LIFE.y}).map(value => Array.from({length: LIFE.x}).map(v => 0));
    return grid;
  }
}
