import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { DataService } from '../services/data.service';
import { LifeService } from '../services/life.service';
import { ConfigModel, PointModel, GRIDS, LIFE } from '../models/config.model';

@Component({
  selector: 'app-universe',
  templateUrl: './universe.component.html',
  styleUrls: ['./universe.component.scss']
})
export class UniverseComponent implements OnInit {

  @ViewChild('panel', { static: true })
  panel: ElementRef<HTMLCanvasElement>;
  private panelCtx: CanvasRenderingContext2D;

  @ViewChild('control', { static: true })
  control: ElementRef<HTMLCanvasElement>;
  private controlCtx: CanvasRenderingContext2D;

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

  public cfg: ConfigModel;

  public panMode = false;
  public pan: PointModel = { x: 0, y: 0 };

  public timer: any;
  public ticks: number;

  constructor(private data: DataService,
              private life: LifeService) { }

  ngOnInit(): void {
    this.initialize();
  }

  initialize(): void {
    this.life.create.subscribe(config => {
      this.cfg = config;
      this.createUniverse();
      this.life.create.unsubscribe();
    });
    this.data.update.subscribe(config => {
      this.cfg = config;
      this.updateUniverse();
    });
  }

  createUniverse(): void {
    this.canvasInit();
    this.drawPanel();
    this.drawCells();
  }

  updateUniverse(): void {
    this.cellsInit();
    this.drawPanel();
    this.drawCells();
  }

  canvasInit(): void {
    this.cellsInit();
    this.panelInit();
    this.controlInit();
  }

  startLoop(): void {
    this.ticks = 0;
    this.timer = setInterval(() => {
      this.ticks++;
      this.life.calcNextGen();
      this.drawCells();
    }, 1000 / this.cfg.speed);
  }

  stopLoop(): void {
    clearInterval(this.timer);
  }

  drawCells(): void {
    this.cellsCtx.clearRect(0, 0, (LIFE.x - 2 * LIFE.o), (LIFE.y - 2 * LIFE.o));
    for (let y = this.cfg.origin.y; y < this.cfg.origin.y + this.cfg.grid.y; y++) {
      for (let x = this.cfg.origin.x; x < this.cfg.origin.x + this.cfg.grid.x; x++) {
        if (this.life.universe[y + LIFE.o][x + LIFE.o]) {
          this.cellsCtx.fillRect(x - this.cfg.origin.x, y - this.cfg.origin.y, 1, 1);
        }
      }
    }
  }

  drawPanel(): void {
    this.panelCtx.clearRect(0, 0, (LIFE.x - 2 * LIFE.o + LIFE.r) * 2, (LIFE.y - 2 * LIFE.o + LIFE.r) * 2);
    this.drawGrid();
    this.drawGuide();
    this.drawRuler();
  }

  drawGrid(): void {
    if (!this.cfg.display.grid || this.cfg.grid.size < 2) {
      return;
    }
    this.panelCtx.fillStyle = this.cfg.colors.grid;
    for (let y = 0; y <= (LIFE.y - 2 * LIFE.o) * 2; y += this.cfg.grid.scale) {
      this.panelCtx.fillRect(LIFE.r, y + LIFE.r, (LIFE.x - 2 * LIFE.o) * 2, 1);
    }
    for (let x = 0; x <= (LIFE.x - 2 * LIFE.o) * 2; x += this.cfg.grid.scale) {
      this.panelCtx.fillRect(x + LIFE.r, LIFE.r, 1, (LIFE.y - 2 * LIFE.o) * 2);
    }
  }

  drawGuide(): void {
    if (!this.cfg.display.guide || this.cfg.grid.size < 2) {
      return;
    }
    this.panelCtx.fillStyle = this.cfg.colors.guide;
    for (let y = 0; y <= this.cfg.grid.y; y++) {
      if ((y + this.cfg.origin.y) % this.cfg.grid.rulerY === 0) {
        this.panelCtx.fillRect(LIFE.r, (y * this.cfg.grid.scale) + LIFE.r, (LIFE.x - 2 * LIFE.o) * 2, 1);
      }
    }
    for (let x = 0; x <= this.cfg.grid.x; x++) {
      if ((x + this.cfg.origin.x) % this.cfg.grid.rulerX === 0) {
        this.panelCtx.fillRect((x * this.cfg.grid.scale) + LIFE.r, LIFE.r, 1, (LIFE.y - 2 * LIFE.o) * 2);
      }
    }
  }

  drawRuler(): void {
    if (!this.cfg.display.ruler) {
      return;
    }
    for (let y = 0; y <= this.cfg.grid.y; y++) {
      if ((y + this.cfg.origin.y) % this.cfg.grid.rulerY === 0) {
        this.panelCtx.fillStyle = this.cfg.colors.label;
        this.panelCtx.fillText(`${y + this.cfg.origin.y}`, LIFE.r - 32, (y * this.cfg.grid.scale) + LIFE.r + 4);
        this.panelCtx.fillText(`${y + this.cfg.origin.y}`, (LIFE.x - 2 * LIFE.o) * 2 + LIFE.r + 12, (y * this.cfg.grid.scale) + LIFE.r + 4);
        this.panelCtx.fillStyle = this.cfg.colors.guide;
        this.panelCtx.fillRect(LIFE.r - 10, (y * this.cfg.grid.scale) + LIFE.r, 10, 1);
        this.panelCtx.fillRect((LIFE.x - 2 * LIFE.o) * 2 + LIFE.r, (y * this.cfg.grid.scale) + LIFE.r, 10, 1);
      }
    }
    for (let x = 0; x <= this.cfg.grid.x; x++) {
      if ((x + this.cfg.origin.x) % this.cfg.grid.rulerX === 0) {
        this.panelCtx.fillStyle = this.cfg.colors.label;
        this.panelCtx.fillText(`${x + this.cfg.origin.x}`, (x * this.cfg.grid.scale) + LIFE.r - 6, LIFE.r - 16);
        this.panelCtx.fillText(`${x + this.cfg.origin.x}`, (x * this.cfg.grid.scale) + LIFE.r - 6, (LIFE.y - 2 * LIFE.o) * 2 + LIFE.r + 24);
        this.panelCtx.fillStyle = this.cfg.colors.guide;
        this.panelCtx.fillRect((x * this.cfg.grid.scale) + LIFE.r, LIFE.r - 10, 1, 10);
        this.panelCtx.fillRect((x * this.cfg.grid.scale) + LIFE.r, (LIFE.y - 2 * LIFE.o) * 2 + LIFE.r, 1, 10);
      }
    }
  }

  cellsInit(): void {
    this.cells.nativeElement.width = (LIFE.x - 2 * LIFE.o) * 2;
    this.cells.nativeElement.height = (LIFE.y - 2 * LIFE.o) * 2;
    this.cellsCtx = this.cells.nativeElement.getContext('2d');
    this.cellsCtx.fillStyle = this.cfg.colors.alive;
    this.cellsCtx.scale(this.cfg.grid.scale, this.cfg.grid.scale);
  }

  panelInit(): void {
    this.panel.nativeElement.width = (LIFE.x - 2 * LIFE.o + LIFE.r) * 2;
    this.panel.nativeElement.height = (LIFE.y - 2 * LIFE.o + LIFE.r) * 2;
    this.panelCtx = this.panel.nativeElement.getContext('2d');
    this.panelCtx.font = '12px monospace';
  }

  controlInit(): void {
    this.control.nativeElement.width = (LIFE.x - 2 * LIFE.o) * 2;
    this.control.nativeElement.height = (LIFE.y - 2 * LIFE.o) * 2;
    this.controlCtx = this.control.nativeElement.getContext('2d');
    this.controlCtx.fillStyle = this.cfg.colors.grid;
  }

  panelClick(ev: PointerEvent): void {
    if (ev.buttons === 1) {
      this.toggleCell(ev);
    } else if (ev.buttons === 4) {
      this.pan = { x: ev.x, y: ev.y };
      this.panMode = true;
      this.control.nativeElement.style.cursor = 'grabbing';
    }
  }

  releaseClick(ev: PointerEvent): void {
    this.panMode = false;
    this.control.nativeElement.style.cursor = 'default';
  }

  toggleCell(ev: PointerEvent): void {
    const uX = Math.round((ev.x - LIFE.r - this.cfg.grid.scale * 0.5) / this.cfg.grid.scale) + this.cfg.origin.x + LIFE.o;
    const uY = Math.round((ev.y - LIFE.r - this.cfg.grid.scale * 0.5) / this.cfg.grid.scale) + this.cfg.origin.y + LIFE.o;
    this.life.universe[uY][uX] = this.life.universe[uY][uX] === 1 ? 0 : 1;
    this.drawCells();
  }

  panUniverse(ev: PointerEvent): void {
    if (!this.panMode) {
      return;
    }
    const cP = LIFE.r - this.cfg.grid.scale * 0.5;
    const panY = Math.round((this.pan.y - cP) / this.cfg.grid.scale) + this.cfg.origin.y;
    const panX = Math.round((this.pan.x - cP) / this.cfg.grid.scale) + this.cfg.origin.x;
    const nextY = Math.round((ev.y - cP) / this.cfg.grid.scale) + this.cfg.origin.y;
    const nextX = Math.round((ev.x - cP) / this.cfg.grid.scale) + this.cfg.origin.x;
    if (panX !== nextX || panY !== nextY) {
      this.cfg.origin = { x: panX - nextX + this.cfg.origin.x, y: panY - nextY + this.cfg.origin.y };
      this.checkLimits();
      this.pan = { x: ev.x, y: ev.y };
      this.data.updateConfig(this.cfg);
    }
  }

  changeScale(ev: WheelEvent): void {
    const uY = Math.round((ev.y - LIFE.r - this.cfg.grid.scale * 0.5) / this.cfg.grid.scale) + this.cfg.origin.y;
    const uX = Math.round((ev.x - LIFE.r - this.cfg.grid.scale * 0.5) / this.cfg.grid.scale) + this.cfg.origin.x;
    this.zoomPositioning(uX, uY, ev);
    this.data.updateConfig(this.cfg);
  }

  zoomPositioning(uX: number, uY: number, ev: WheelEvent): void {
    let idx: number;
    if (ev.deltaY > 0) {
      if (this.cfg.grid.size === 0) {
        return;
      }
      idx = -1;
    } else {
      if (this.cfg.grid.size === 4) {
        return;
      }
      idx = 1;
    }
    let nX: number;
    let nY: number;
    nY = Math.round((ev.y - LIFE.r - GRIDS[this.cfg.grid.size + idx].scale * 0.5) / GRIDS[this.cfg.grid.size + idx].scale);
    nX = Math.round((ev.x - LIFE.r - GRIDS[this.cfg.grid.size + idx].scale * 0.5) / GRIDS[this.cfg.grid.size + idx].scale);
    this.cfg.grid = GRIDS[this.cfg.grid.size + idx];
    this.cfg.origin = { x: uX - nX, y: uY - nY };
    this.checkLimits();
  }

  checkLimits(): void {
    if (this.cfg.origin.x < 0) {
      this.cfg.origin.x = 0;
    }
    if (this.cfg.origin.y < 0) {
      this.cfg.origin.y = 0;
    }
    if (this.cfg.origin.x + this.cfg.grid.x + 2 * LIFE.o > LIFE.x) {
      this.cfg.origin.x = LIFE.x - this.cfg.grid.x - 2 * LIFE.o;
    }
    if (this.cfg.origin.y + this.cfg.grid.y + 2 * LIFE.o > LIFE.y) {
      this.cfg.origin.y = LIFE.y - this.cfg.grid.y - 2 * LIFE.o;
    }
  }

}