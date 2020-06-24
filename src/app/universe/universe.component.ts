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

  @ViewChild('ruler', { static: true })
  ruler: ElementRef<HTMLCanvasElement>;
  private rulerCtx: CanvasRenderingContext2D;

  @ViewChild('panel', { static: true })
  panel: ElementRef<HTMLCanvasElement>;
  private panelCtx: CanvasRenderingContext2D;

  @ViewChild('cells', { static: true })
  cells: ElementRef<HTMLCanvasElement>;
  private cellsCtx: CanvasRenderingContext2D;

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
  public panMode = false;
  public panOrigin: [number, number] = [0, 0];

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

  panelClick(ev: PointerEvent): void {
    if (ev.buttons === 1) {
      const uX = Math.round((ev.x - this.margin - this.config.grid.scale * 0.5) / this.config.grid.scale) + this.config.origin[0] + 10;
      const uY = Math.round((ev.y - this.margin - this.config.grid.scale * 0.5) / this.config.grid.scale) + this.config.origin[1] + 10;
      this.life.universe[uY][uX] = this.life.universe[uY][uX] === 1 ? 0 : 1;
      this.drawLife();
    } else if (ev.buttons === 4) {
      this.panOrigin = [ev.x, ev.y];
      this.panMode = true;
    }
  }

  releaseClick(ev: PointerEvent): void {
    this.panMode = false;
  }

  panUniverse(ev: PointerEvent): void {
    const oY = Math.round((this.panOrigin[1] - this.margin - this.config.grid.scale * 0.5) / this.config.grid.scale) + this.config.origin[1];
    const oX = Math.round((this.panOrigin[0] - this.margin - this.config.grid.scale * 0.5) / this.config.grid.scale) + this.config.origin[0];
    const uY = Math.round((ev.y - this.margin - this.config.grid.scale * 0.5) / this.config.grid.scale) + this.config.origin[1];
    const uX = Math.round((ev.x - this.margin - this.config.grid.scale * 0.5) / this.config.grid.scale) + this.config.origin[0];
    if (!this.panMode) {
      return;
    }
    let nX: number;
    let nY: number;
    nY = Math.round((ev.y - this.margin - GRIDS[this.config.size].scale * 0.5) / GRIDS[this.config.size].scale);
    nX = Math.round((ev.x - this.margin - GRIDS[this.config.size].scale * 0.5) / GRIDS[this.config.size].scale);
    if (oX !== uX || oY !== uY) {
      this.config.origin = [oX - nX, oY - nY];
      this.verifyZoomEdges();
      this.panOrigin = [ev.x, ev.y];
      this.data.updateConfig(this.config);
      this.updateUniverse();
    }
  }

  changeScale(ev: WheelEvent): void {
    const uY = Math.round((ev.y - this.margin - this.config.grid.scale * 0.5) / this.config.grid.scale) + this.config.origin[1];
    const uX = Math.round((ev.x - this.margin - this.config.grid.scale * 0.5) / this.config.grid.scale) + this.config.origin[0];
    this.applyZoomPositioning(uX, uY, ev);
    this.verifyZoomEdges();
    this.data.updateConfig(this.config);
    this.updateUniverse();
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
    this.config.origin = [uX - nX, uY - nY];
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
    this.cellsCtx.clearRect(0, 0, (this.life.limitX - 20), (this.life.limitX - 20));
    for (let y = this.config.origin[1]; y < this.config.origin[1] + this.config.grid.y; y++) {
      for (let x = this.config.origin[0]; x < this.config.origin[0] + this.config.grid.x; x++) {
        if (this.life.universe[y + 10][x + 10]) {
          this.cellsCtx.fillRect(x - this.config.origin[0], y - this.config.origin[1], 1, 1);
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
    this.cells.nativeElement.width = (this.life.limitX - 20) * 2;
    this.cells.nativeElement.height = (this.life.limitY - 20) * 2;
    this.cellsCtx = this.cells.nativeElement.getContext('2d');
    this.cellsCtx.fillStyle = this.config.colors.alive;
    const scale = this.config.grid.scale;
    this.cellsCtx.scale(scale, scale);
  }

  startGrid(): void {
    this.ruler.nativeElement.width = (this.life.limitX - 20 + this.margin) * 2;
    this.ruler.nativeElement.height = (this.life.limitY - 20 + this.margin) * 2;
    this.panel.nativeElement.width = (this.life.limitX - 20) * 2;
    this.panel.nativeElement.height = (this.life.limitY - 20) * 2;
    this.rulerCtx = this.ruler.nativeElement.getContext('2d');
    this.rulerCtx.fillStyle = this.config.colors.rulerMark;
    this.panelCtx = this.panel.nativeElement.getContext('2d');
    this.panelCtx.fillStyle = this.config.colors.grid;
  }

  drawGrid(): void {
    const markInterval = this.config.size > 1 ? 5 : 10;
    for (let y = 0; y < this.config.grid.y; y++) {
      if ((y + this.config.origin[1]) % markInterval === 0) {
        this.rulerCtx.fillRect(this.margin - 10, (y * this.config.grid.scale) + this.margin, 10, 1);
        this.rulerCtx.fillRect((this.life.limitX - 20) * 2 + this.margin, (y * this.config.grid.scale) + this.margin, 10, 1);
      } else if (y % this.config.grid.scale === 0) {
        // this.rulerCtx.fillRect(this.margin, (y * this.config.grid.scale) + this.margin, (this.life.limitX - 20) * 2, 1);
      }
    }
    for (let x = 0; x < this.config.grid.x; x++) {
      if ((x + this.config.origin[0]) % markInterval === 0) {
        this.rulerCtx.fillRect((x * this.config.grid.scale) + this.margin, this.margin - 10, 1, 10);
        this.rulerCtx.fillRect((x * this.config.grid.scale) + this.margin, (this.life.limitY - 20) * 2 + this.margin, 1, 10);
      } else if (x % this.config.grid.scale === 0) {
        // this.rulerCtx.fillRect((x * this.config.grid.scale) + this.margin, this.margin, 1, (this.life.limitY - 20) * 2);
      }
    }
    if (this.config.size > 1) {
      for (let y = 0; y <= (this.life.limitY - 20) * 2; y += this.config.grid.scale) {
        this.rulerCtx.fillRect(this.margin, y + this.margin, (this.life.limitX - 20) * 2, 1);
      }
      for (let x = 0; x <= (this.life.limitX - 20) * 2; x += this.config.grid.scale) {
        this.rulerCtx.fillRect(x + this.margin, this.margin, 1, (this.life.limitY - 20) * 2);
      }
    }
  }
}
