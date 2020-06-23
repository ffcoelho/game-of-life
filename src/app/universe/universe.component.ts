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

  @ViewChild('gridScale', { static: true })
  gridScale: ElementRef<HTMLCanvasElement>;
  private gridScaleCtx: CanvasRenderingContext2D;

  @ViewChild('grid', { static: true })
  grid: ElementRef<HTMLCanvasElement>;
  private gridCtx: CanvasRenderingContext2D;

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  private canvasCtx: CanvasRenderingContext2D;

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

  private margin = 40;
  public config: ConfigModel;

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
    const uX = Math.round((ev.x - this.margin - this.config.grid.scale * 0.5) / this.config.grid.scale) + this.config.origin[0] + 10;
    const uY = Math.round((ev.y - this.margin - this.config.grid.scale * 0.5) / this.config.grid.scale) + this.config.origin[1] + 10;
    this.life.universe[uY][uX] = this.life.universe[uY][uX] === 1 ? 0 : 1;
    this.drawLife();
    // console.log(`toggle: ${uX - 10}, ${uY - 10}`);
  }

  changeScale(ev: WheelEvent): void {
    const uY = Math.round((ev.y - this.margin - this.config.grid.scale * 0.5) / this.config.grid.scale) + this.config.origin[1];
    const uX = Math.round((ev.x - this.margin - this.config.grid.scale * 0.5) / this.config.grid.scale) + this.config.origin[0];
    this.applyZoomPositioning(uX, uY, ev);
    this.verifyZoomEdges();
    this.data.updateConfig(this.config);
    this.updateUniverse();
    // console.log(`scale: ${uX}, ${uY}`);
  }

  applyZoomPositioning(uX: number, uY: number, ev: WheelEvent): void {
    let nX: number;
    let nY: number;
    if (ev.deltaY > 0) {
      if (this.config.size === 0) {
        return;
      }
      nY = Math.round((ev.y - this.margin - GRIDS[this.config.size - 1].scale * 0.5) / GRIDS[this.config.size - 1].scale);
      nX = Math.round((ev.x - this.margin - GRIDS[this.config.size - 1].scale * 0.5) / GRIDS[this.config.size - 1].scale);
      this.config.size--;
      this.config.grid = GRIDS[this.config.size];
    } else {
      if (this.config.size === 4) {
        return;
      }
      nY = Math.round((ev.y - this.margin - GRIDS[this.config.size + 1].scale * 0.5) / GRIDS[this.config.size + 1].scale);
      nX = Math.round((ev.x - this.margin - GRIDS[this.config.size + 1].scale * 0.5) / GRIDS[this.config.size + 1].scale);
      this.config.size++;
      this.config.grid = GRIDS[this.config.size];
    }
    this.config.origin[0] = uX - nX;
    this.config.origin[1] = uY - nY;
  }

  verifyZoomEdges(): void {
    if (this.config.origin[0] < 0) {
      this.config.origin[0] = 0;
    }
    if (this.config.origin[1] < 0) {
      this.config.origin[1] = 0;
    }
    if (this.config.origin[0] + this.config.grid.x + 20 > this.life.limitX) {
      this.config.origin[0] = this.life.limitX - this.config.grid.x - 20;
    }
    if (this.config.origin[1] + this.config.grid.y + 20 > this.life.limitY) {
      this.config.origin[1] = this.life.limitY - this.config.grid.y - 20;
    }
  }

  drawLife(): void {
    this.canvasCtx.clearRect(0, 0, (this.life.limitX - 20), (this.life.limitX - 20));
    for (let y = this.config.origin[1]; y < this.config.origin[1] + this.config.grid.y; y++) {
      for (let x = this.config.origin[0]; x < this.config.origin[0] + this.config.grid.x; x++) {
        if (this.life.universe[y + 10][x + 10]) {
          this.canvasCtx.fillRect(x - this.config.origin[0], y - this.config.origin[1], 1, 1);
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
    const scale = this.config.grid.scale;
    this.canvasCtx.scale(scale, scale);
  }

  startGrid(): void {
    this.gridScale.nativeElement.width = (this.life.limitX - 20 + this.margin) * 2;
    this.gridScale.nativeElement.height = (this.life.limitY - 20 + this.margin) * 2;
    this.grid.nativeElement.width = (this.life.limitX - 20) * 2;
    this.grid.nativeElement.height = (this.life.limitY - 20) * 2;
    this.gridScaleCtx = this.gridScale.nativeElement.getContext('2d');
    this.gridScaleCtx.fillStyle = this.config.colors.grid;
    this.gridCtx = this.grid.nativeElement.getContext('2d');
    this.gridCtx.fillStyle = this.config.colors.grid;
  }

  drawGrid(): void {
    for (let y = this.margin; y <= (this.life.limitY - 20) * 2 + this.margin; y += this.config.grid.scale * 10) {
      this.gridScaleCtx.fillRect(this.margin - 10, y, 10, 1);
      this.gridScaleCtx.fillRect((this.life.limitX - 20) * 2 + this.margin, y, 10, 1);
    }
    for (let x = this.margin; x <= (this.life.limitX - 20) * 2 + this.margin; x += this.config.grid.scale * 10) {
      this.gridScaleCtx.fillRect(x, this.margin - 10, 1, 10);
      this.gridScaleCtx.fillRect(x, (this.life.limitY - 20) * 2 + this.margin, 1, 10);
    }
    this.gridScaleCtx.fillRect((this.life.limitX - 20) * 2 + this.margin, this.margin, 1, (this.life.limitY - 20) * 2 + 1);
    this.gridScaleCtx.fillRect(this.margin, (this.life.limitY - 20) * 2 + this.margin, (this.life.limitX - 20) * 2, 1);
    if (this.config.displayGrid && this.config.size > 1) {
      for (let y = 0; y < (this.life.limitY - 20) * 2; y += this.config.grid.scale) {
        this.gridCtx.fillRect(0, y, (this.life.limitX - 20) * 2, 1);
      }
      for (let x = 0; x < (this.life.limitX - 20) * 2; x += this.config.grid.scale) {
        this.gridCtx.fillRect(x, 0, 1, (this.life.limitY - 20) * 2);
      }
    }
  }
}
