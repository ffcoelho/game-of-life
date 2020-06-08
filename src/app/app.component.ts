import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  time: number;
  start: number;

  grid: boolean[][];
  gridNext: boolean[][];
  quadrants: boolean[][];

  ticker: any;

  nGrid = Array.from({length: 40}).map(value => Array.from({length: 40}).map(v => 0));
  nGrid2 = Array.from({length: 40}).map(value => Array.from({length: 40}).map(v => 0));

  constructor() { }

  ngOnInit(): void {
    this.start = new Date().getTime();
    this.grid = this.newGrid(40, 40);
    this.gridNext = this.newGrid(40, 40);
    this.gliderTest();
    this.drawGrid();
    this.checkGrid();
    this.drawGridNext();
    // this.quadrants = this.newQuadrants(this.grid);
  }

  gliderTest(): void {
    // const glider = [[false, false, true], [true, false, true], [false, true, true]];
    const glider = [[true, true, true]];
    // const glider = [[false, true, false], [false, true, false], [false, true, false]];
    const posX = 3;
    const posY = 2;
    glider.forEach((xG, xGi) => {
      xG.forEach((yG, yGi) => {
        this.grid[posX + xGi][posY + yGi] = yG;
      });
    });
  }

  // newRandomGrid(x: number, y: number): boolean[][] {
  //   const grid = [];
  //   for (let i = 0; i < x; i++) {
  //     grid[i] = Array.from({length: y}).map(value => Math.round(Math.random()) === 1 ? true : false);
  //   }
  //   return grid;
  // }

  newGrid(x: number, y: number): boolean[][] {
    const grid = [];
    for (let i = 0; i < x; i++) {
      grid[i] = Array.from({length: y}).map(value => false);
    }
    return grid;
  }

  checkGrid(): void {
    this.nGrid.forEach(x => x.forEach(y => y = 0));
    this.grid.forEach((xG, xGi) => {
      xG.forEach((yG, yGi) => {
        this.gridNext[xGi][yGi] = this.checkPoint(xGi, yGi, yG);
      });
    });
    const oldGrid = this.gridNext;
    this.grid = oldGrid;
  }

  checkPoint(xGi: number, yGi: number, state: boolean): boolean {
    if (xGi < 1 || xGi > 38 || yGi < 1 || yGi > 38) {
      return false;
    }
    let neighbours = 0;
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        if (this.grid[x + xGi][y + yGi]) {
          neighbours++;
        }
      }
    }
    if (state) {
      neighbours--;
      this.nGrid[xGi][yGi] = neighbours;
      if (neighbours < 2 || neighbours > 3) {
        return false;
      }
      return true;
    } else {
      this.nGrid[xGi][yGi] = neighbours;
      if (neighbours === 3) {
        return true;
      }
      return false;
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
          ctx.fillRect(xGi * 10, yGi * 10, 10, 10);
        } else {
          ctx.fillStyle = '#CCCCCC';
          ctx.fillRect(xGi * 10 + 1, yGi * 10 + 1, 8, 8);
        }
      });
    });
  }

  drawGridNext(): void {
    const c: any = document.getElementById('myCanvas2');
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 400, 400);
    this.gridNext.forEach((xG, xGi) => {
      xG.forEach((yG, yGi) => {
        if (yG) {
          ctx.fillStyle = '#FF0000';
          ctx.fillRect(xGi * 10, yGi * 10, 10, 10);
        } else {
          ctx.fillStyle = '#CCCCCC';
          ctx.fillRect(xGi * 10 + 1, yGi * 10 + 1, 8, 8);
        }
      });
    });
  }

  startLoop(): void {
    this.drawGrid();
    this.checkGrid();
    this.drawGridNext();
    // this.ticker = setInterval(() => {
    //   this.drawGrid();
    //   this.checkGrid();
    // }, 200);
  }

  stopLoop(): void {
    clearInterval(this.ticker);
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
