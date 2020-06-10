import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LifeService {

  public universe: number[][];
  public nextGen: number[][];
  public limitY: number;
  public limitX: number;

  constructor() { }

  startUniverse(y: number, x: number): void {
    this.universe = this.newGrid(y, x);
    this.nextGen = this.newGrid(y, x);
    this.limitY = y;
    this.limitX = x;
  }

  newGrid(y: number, x: number): number[][] {
    const grid = Array.from({length: y}).map(value => Array.from({length: x}).map(v => 0));
    return grid;
  }

  calcNextGen(): void {
    this.nextGen.forEach(y => y.fill(0));
    for (let y = 1; y < this.limitY - 2; y++) {
      for (let x = 1; x < this.limitX - 2; x++) {
        this.nextGen[y][x] = this.checkPoint(y, x, this.universe[y][x]);
      }
    }
    this.nextGen.forEach((y, yi) => {
      this.universe[yi] = Array.from(y);
    });
  }

  checkPoint(yU: number, xU: number, state: number): number {
    let neighbours = 0;
    for (let y = -1; y < 2; y++) {
      for (let x = -1; x < 2; x++) {
        if (this.universe[yU + y][xU + x] > 0) {
          neighbours++;
        }
      }
    }
    if (state) {
      neighbours--;
      if (neighbours < 2 || neighbours > 3) {
        return 0;
      }
      return 1;
    } else {
      if (neighbours === 3) {
        return 1;
      }
      return 0;
    }
  }
}
