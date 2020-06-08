import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  time: number;
  start: number;

  grid: number[][];
  gridNext: number[][];
  quadrants: boolean[][];

  ticker: any;
  ticks = 0;

  nGrid = Array.from({length: 400}).map(value => Array.from({length: 400}).map(v => 0));
  nGrid2 = Array.from({length: 400}).map(value => Array.from({length: 400}).map(v => 0));

  constructor() { }

  ngOnInit(): void {
    this.grid = this.newGrid(400, 400);
    this.gridNext = this.newGrid(400, 400);
    this.chaosTest();
    this.drawGrid();
    // this.gliderTest();
    // this.quadrants = this.newQuadrants(this.grid);
  }

  newGrid(x: number, y: number): number[][] {
    const grid = [];
    for (let i = 0; i < x; i++) {
      grid[i] = Array.from({length: y}).map(value => 0);
    }
    return grid;
  }

  checkGrid(): void {
    this.gridNext.forEach(x => x.forEach(y => y = 0));
    this.nGrid.forEach(x => x.forEach(y => y = 0));
    this.grid.forEach((xG, xGi) => {
      xG.forEach((yG, yGi) => {
        this.gridNext[xGi][yGi] = this.checkPoint(xGi, yGi, yG);
      });
    });
    this.gridNext.forEach((gX, gXi) => {
      this.grid[gXi] = Array.from(gX);
    });
  }

  checkPoint(xGi: number, yGi: number, state: number): number {
    if (xGi < 1 || xGi > 398 || yGi < 1 || yGi > 398) {
      return 0;
    }
    let neighbours = 0;
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        if (this.grid[xGi + x][yGi + y] > 0) {
          neighbours++;
        }
      }
    }
    if (state > 0) {
      neighbours--;
      this.nGrid[xGi][yGi] = neighbours;
      if (neighbours < 2 || neighbours > 3) {
        return 0;
      }
      return 1;
    } else {
      this.nGrid[xGi][yGi] = neighbours;
      if (neighbours === 3) {
        return 1;
      }
      return 0;
    }
  }

  drawGrid(): void {
    const c: any = document.getElementById('myCanvas');
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 400, 400);
    this.grid.forEach((xG, xGi) => {
      xG.forEach((yG, yGi) => {
        if (yG) {
          ctx.fillStyle = '#FF0000';
          ctx.fillRect(xGi, yGi, 1, 1);
        }
      });
    });
  }

  drawGridNext(): void {
    const c: any = document.getElementById('myCanvas2');
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 400, 400);
    this.grid.forEach((xG, xGi) => {
      xG.forEach((yG, yGi) => {
        if (yG) {
          ctx.fillStyle = '#FF0000';
          ctx.fillRect(xGi, yGi, 1, 1);
        } else {
          ctx.fillStyle = '#CCCCCC';
          ctx.fillRect(xGi, yGi, 1, 1);
          // ctx.fillRect(xGi * 5 + 0.5, yGi * 5 + 0.5, 4, 4);
        }
      });
    });
  }

  startLoop(): void {
    // this.start = new Date().getTime();
    this.ticker = setInterval(() => {
      this.ticks++;
      // console.log(new Date().getTime() - this.start);
      // this.start = new Date().getTime();
      this.drawGrid();
      this.checkGrid();
    }, 42);
  }

  stopLoop(): void {
    clearInterval(this.ticker);
  }

  gliderTest(): void {
    const glider = [[0, 0, 1], [1, 0, 1], [0, 1, 1]];
    // const glider = [[1, 1, 1]];
    // const glider = [[false, true, false], [false, true, false], [false, true, false]];
    const posX = 3;
    const posY = 2;
    glider.forEach((xG, xGi) => {
      xG.forEach((yG, yGi) => {
        this.grid[posX + xGi][posY + yGi] = yG;
      });
    });
  }

  chaosTest(): void {
    const chaosA = Array.from({length: 100}).map(value => Array.from({length: 100}).map(v => Math.round(Math.random())));
    const chaosB = Array.from({length: 100}).map(value => Array.from({length: 100}).map(v => Math.round(Math.random())));
    const chaosC = Array.from({length: 100}).map(value => Array.from({length: 100}).map(v => Math.round(Math.random())));
    const chaosD = Array.from({length: 100}).map(value => Array.from({length: 100}).map(v => Math.round(Math.random())));
    const posXa = 80;
    const posYa = 80;
    const posXb = 220;
    const posYb = 80;
    const posXc = 80;
    const posYc = 220;
    const posXd = 220;
    const posYd = 220;
    chaosA.forEach((xG, xGi) => {
      xG.forEach((yG, yGi) => {
        this.grid[posXa + xGi][posYa + yGi] = yG;
      });
    });
    chaosB.forEach((xG, xGi) => {
      xG.forEach((yG, yGi) => {
        this.grid[posXb + xGi][posYb + yGi] = yG;
      });
    });
    chaosC.forEach((xG, xGi) => {
      xG.forEach((yG, yGi) => {
        this.grid[posXc + xGi][posYc + yGi] = yG;
      });
    });
    chaosD.forEach((xG, xGi) => {
      xG.forEach((yG, yGi) => {
        this.grid[posXd + xGi][posYd + yGi] = yG;
      });
    });
  }

  // newQuadrants(grid: number[][]): boolean[][] {
  //   const quadrants = [];
  //   const xQ = grid.length / 8;
  //   const yQ = grid[0].length / 8;
  //   for (let i = 0; i < xQ; i++) {
  //     quadrants[i] = Array.from({length: yQ}).map(value => false);
  //   }
  //   return quadrants;
  // }

  // checkQuadrants(): void {
  //   let xF = 0;
  //   let yF = 0;
  //   this.quadrants.forEach(qX => {
  //     qX.forEach(qY => {
  //       qY = false;
  //       Quadrant: for (let x = 0; x < 10; x++) {
  //         for (let y = 0; y < 10; y++) {
  //           if (this.grid[x + xF][y + yF] === 1) {
  //             qY = true;
  //             break Quadrant;
  //           }
  //         }
  //       }
  //       yF += 10;
  //       if (this.quadrants[0].length * 10 === yF) {
  //         yF = 0;
  //       }
  //     });
  //     xF += 10;
  //     if (this.quadrants.length * 10 === xF) {
  //       xF = 0;
  //     }
  //   });
  // }


}
