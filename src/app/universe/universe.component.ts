import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { DataService } from '../services/data.service';
import { LifeService } from '../services/life.service';
import { ConfigModel, GRIDS } from '../models/config.model';

@Component({
  selector: 'app-universe',
  templateUrl: './universe.component.html',
  styleUrls: ['./universe.component.scss']
})
export class UniverseComponent implements OnInit {

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  private canvasCtx: CanvasRenderingContext2D;

  @ViewChild('grid', { static: true })
  grid: ElementRef<HTMLCanvasElement>;
  private gridCtx: CanvasRenderingContext2D;

  config: ConfigModel;

  private playing: boolean;
  @Input() set play(start: boolean) {
    if (start) {
      this.startLoop();
    } else {
      this.stopLoop();
    }
    this.playing = start;
  }
  get play(): boolean {
    return this.playing;
  }

  private iX = 0;
  private iY = 0;

  public timer: any;
  public ticks: number;

  time: number;

  constructor(private data: DataService,
              private life: LifeService) { }

  ngOnInit(): void {
    this.initialize();
  }

  initialize(): void {
    this.life.create.subscribe(conf => {
      this.config = conf;
      this.createUniverse();
      // this.chaosTest();
      this.life.create.unsubscribe();
    });
    this.data.update.subscribe(conf => {
      if (conf.size !== this.config.size) {
        this.createUniverse();
      }
      this.config = conf;
      this.updateUniverse();
    });
  }

  // todo check changes (create if size/colors), (update if position, grid)
  createUniverse(): void {
    this.startCanvas();
    this.startGrid();
    this.drawGrid();
    this.drawLife();
  }

  updateUniverse(): void {
    this.startCanvas();
    this.startGrid();
    this.drawGrid();
    this.drawLife();
  }

  toggleCell(ev: PointerEvent): void {
    if (ev.buttons !== 1) {
      return;
    }
    const uY = Math.round((ev.y - GRIDS[this.config.size].scale * 0.5) / GRIDS[this.config.size].scale) + this.iY + 10;
    const uX = Math.round((ev.x - GRIDS[this.config.size].scale * 0.5) / GRIDS[this.config.size].scale) + this.iX + 10;
    this.life.universe[uY][uX] = this.life.universe[uY][uX] === 1 ? 0 : 1;
    this.drawLife();
    console.log(`toggle: ${uX - 10}, ${uY - 10}`);
  }

  changeScale(ev: WheelEvent): void {
    const uY = Math.round((ev.y - GRIDS[this.config.size].scale * 0.5) / GRIDS[this.config.size].scale) + this.iY;
    const uX = Math.round((ev.x - GRIDS[this.config.size].scale * 0.5) / GRIDS[this.config.size].scale) + this.iX;
    console.log(`scale: ${uX}, ${uY}`);
    let nX: number;
    let nY: number;
    if (ev.deltaY > 0) {
      if (this.config.size === 0) {
        return;
      }
      nY = Math.round((ev.y - GRIDS[this.config.size - 1].scale * 0.5) / GRIDS[this.config.size - 1].scale);
      nX = Math.round((ev.x - GRIDS[this.config.size - 1].scale * 0.5) / GRIDS[this.config.size - 1].scale);
      this.config.size--;
    } else {
      if (this.config.size === 4) {
        return;
      }
      nY = Math.round((ev.y - GRIDS[this.config.size + 1].scale * 0.5) / GRIDS[this.config.size + 1].scale);
      nX = Math.round((ev.x - GRIDS[this.config.size + 1].scale * 0.5) / GRIDS[this.config.size + 1].scale);
      this.config.size++;
    }
    this.iX = uX - nX;
    this.iY = uY - nY;
    if (this.iX < 0) {
      this.iX = 0;
    }
    if (this.iY < 0) {
      this.iY = 0;
    }
    if (this.iX + GRIDS[this.config.size].x + 20 > this.life.limitX) {
      this.iX = this.life.limitX - GRIDS[this.config.size].x - 20;
    }
    if (this.iY + GRIDS[this.config.size].y + 20 > this.life.limitY) {
      this.iY = this.life.limitY - GRIDS[this.config.size].y - 20;
    }
    this.updateUniverse();
  }

  drawLife(): void {
    this.canvasCtx.clearRect(0, 0, (this.life.limitX - 20), (this.life.limitX - 20));
    for (let y = this.iY; y < this.iY + GRIDS[this.config.size].y; y++) {
      for (let x = this.iX; x < this.iX + GRIDS[this.config.size].x; x++) {
        if (this.life.universe[y + 10][x + 10]) {
          this.canvasCtx.fillRect(x - this.iX, y - this.iY, 1, 1);
        }
      }
    }
  }

  startLoop(): void {
    this.ticks = 0;
    this.timer = setInterval(() => {
      // this.time = new Date().getTime();
      this.ticks++;
      // console.log(`1: ${new Date().getTime() - this.time}`);
      this.life.calcNextGen();
      this.drawLife();
      // console.log(`2: ${new Date().getTime() - this.time}`);
    }, 1000 / this.config.speed);
  }

  stopLoop(): void {
    clearInterval(this.timer);
  }

  startCanvas(): void {
    this.canvas.nativeElement.width = (this.life.limitX - 20) * 2;
    this.canvas.nativeElement.height = (this.life.limitY - 20) * 2;
    this.canvasCtx = this.canvas.nativeElement.getContext('2d');
    this.canvasCtx.fillStyle = this.config.colors.alive;
    const scale = GRIDS[this.config.size].scale;
    this.canvasCtx.scale(scale, scale);
  }

  startGrid(): void {
    this.grid.nativeElement.width = (this.life.limitX - 20) * 2;
    this.grid.nativeElement.height = (this.life.limitY - 20) * 2;
    this.gridCtx = this.grid.nativeElement.getContext('2d');
    this.gridCtx.fillStyle = this.config.colors.grid;
  }

  drawGrid(): void {
    if (this.config.grid && this.config.size > 1) {
      for (let y = 0; y < (this.life.limitY - 20) * 2; y += GRIDS[this.config.size].scale) {
        this.gridCtx.fillRect(0, y, (this.life.limitX - 20) * 2, 1);
      }
      for (let x = 0; x < (this.life.limitX - 20) * 2; x += GRIDS[this.config.size].scale) {
        this.gridCtx.fillRect(x, 0, 1, (this.life.limitY - 20) * 2);
      }
    } else {
      for (let y = 0; y < (this.life.limitY - 20) * 2; y += GRIDS[this.config.size].scale * 10) {
        this.gridCtx.fillRect(0, y, (this.life.limitX - 20) * 2, 1);
      }
      for (let x = 0; x < (this.life.limitX - 20) * 2; x += GRIDS[this.config.size].scale * 10) {
        this.gridCtx.fillRect(x, 0, 1, (this.life.limitY - 20) * 2);
      }
    }
  }

  chaosTest(): void {
    // const chaosA = Array.from({length: this.life.limitY - 20}).map(value => Array.from({length: this.life.limitX - 20}).map(v => Math.round(Math.random() * 100) > 91 ? 1 : 0));
    const posYa = 10;
    const posXa = 10;
    // const chaosA = [[0, 1, 1], [1, 1, 0], [0, 1, 0]];
    // const posYa = 250;
    // const posXa = 190;
    const chaosA = Array.from({length: this.life.limitY - 20}).map(value => Array.from({length: this.life.limitX - 20}).map(v => 0));
    for (let i = 0; i < this.life.limitY - 20; i += 4) {
      for (let j = 0; j < this.life.limitX - 20; j += 4) {
      chaosA[i][j] = 1;
      chaosA[i][j + 1] = 1;
      chaosA[i + 1][j] = 1;
      chaosA[i + 1][j + 1] = 1;
      }
    }
    chaosA.forEach((y, yi) => {
      y.forEach((x, xi) => {
        this.life.universe[posYa + yi][posXa + xi] = x;
      });
    });
  }

}
