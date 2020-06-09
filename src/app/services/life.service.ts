import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LifeService {

  public universe: number[][];
  public nextGen: number[][];
  public limitY: number;
  public limitX: number;

  public timer: any;
  public ticks: number;

  constructor() { }

  startService(): void {
    const y = 500;
    const x = 400;
    this.universe = this.newUniverse(y, x);
    this.nextGen = this.newUniverse(y, x);
    this.limitY = y - 2;
    this.limitX = x - 2;
    this.chaosTest();
    this.drawGrid();
  }

  newUniverse(y: number, x: number): number[][] {
    const grid = Array.from({length: y}).map(value => Array.from({length: x}).map(v => 0));
    return grid;
  }

  calcNextGen(): void {
    this.nextGen.forEach(y => y.fill(0));
    for (let y = 1; y < this.limitY; y++) {
      for (let x = 1; x < this.limitX; x++) {
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

  drawGrid(): void {
    const c: any = document.getElementById('myCanvas');
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, this.limitX + 2, this.limitY + 2);
    this.universe.forEach((yG, yGi) => {
      yG.forEach((xG, xGi) => {
        if (xG) {
          ctx.fillStyle = '#FF0000';
          ctx.fillRect(xGi, yGi, 1, 1);
        }
      });
    });
  }

  startLoop(): void {
    this.timer = setInterval(() => {
      this.ticks++;
      this.drawGrid();
      this.calcNextGen();
      if (this.ticks === 1103) {
        this.stopLoop();
      }
    }, 33);
  }

  stopLoop(): void {
    clearInterval(this.timer);
  }

  chaosTest(): void {
    const chaosA = Array.from({length: 498}).map(value => Array.from({length: 398}).map(v => Math.round(Math.random() * 100) > 33 ? 1 : 0));
    const posXa = 1;
    const posYa = 1;
    chaosA.forEach((y, yi) => {
      y.forEach((x, xi) => {
        this.universe[posYa + yi][posXa + xi] = x;
      });
    });
  }
}
