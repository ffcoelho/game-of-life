import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../services/data.service';
import { LifeService } from '../services/life.service';
import { ConfigModel, PointModel, GRIDS, LIFE, UniverseModel, ColorsModel } from '../models/config.model';
import { UniverseDataModel } from '../models/data.model';

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

  public cfg: ConfigModel;
  public playing: boolean;
  public hasChanges: boolean;
  public loadedId: string;

  public showLifeModal: boolean;
  public showLifePopup: boolean;
  public modalType: string;
  public popupType: string;

  public clickPanMode = false;
  public pan: PointModel = { x: 0, y: 0 };
  public tool: string;

  public infoLeds: boolean;
  public timer: any;
  public ticks = 0;
  public tickRef = 0;
  public population = 0;
  public fps: number;
  public time: number;

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
    this.time = new Date().getTime();
    this.timer = setInterval(() => {
      if (this.ticks === 999999) {
        clearInterval(this.timer);
      }
      this.ticks++;
      this.fps = Math.floor((this.ticks - this.tickRef) / ((new Date().getTime() - this.time) / 1000));
      this.life.calcNextGen();
      this.drawCells();
    }, 1000 / this.cfg.speed);
  }

  pauseLoop(): void {
    clearInterval(this.timer);
    this.tickRef = this.ticks;
  }

  stopLoop(): void {
    clearInterval(this.timer);
    this.tickRef = this.ticks;
  }

  drawCells(): void {
    let population = 0;
    this.cellsCtx.fillStyle = this.cfg.colors.alive;
    this.cellsCtx.clearRect(0, 0, (LIFE.x - 2 * LIFE.o), (LIFE.y - 2 * LIFE.o));
    for (let y = this.cfg.origin.y; y < this.cfg.origin.y + this.cfg.grid.y; y++) {
      for (let x = this.cfg.origin.x; x < this.cfg.origin.x + this.cfg.grid.x; x++) {
        if (this.life.universe[y + LIFE.o][x + LIFE.o]) {
          population++;
          this.cellsCtx.fillRect(x - this.cfg.origin.x, y - this.cfg.origin.y, 1, 1);
        }
      }
    }
    this.population = population;
  }

  drawPanel(): void {
    this.panelCtx.clearRect(0, 0, (LIFE.x - 2 * LIFE.o + LIFE.r) * 2, (LIFE.y - 2 * LIFE.o + LIFE.r) * 2);
    this.drawGrid();
    this.drawRulerLines();
    this.drawRuler();
  }

  drawGrid(): void {
    if (this.cfg.grid.size < 2) {
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

  drawRulerLines(): void {
    if (!this.cfg.display.lines || this.cfg.grid.size < 2) {
      return;
    }
    this.panelCtx.fillStyle = this.cfg.colors.lines;
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
        this.panelCtx.fillStyle = '#808080';
        this.panelCtx.fillText(`${y + this.cfg.origin.y}`, LIFE.r - 32, (y * this.cfg.grid.scale) + LIFE.r + 4);
        this.panelCtx.fillText(`${y + this.cfg.origin.y}`, (LIFE.x - 2 * LIFE.o) * 2 + LIFE.r + 12, (y * this.cfg.grid.scale) + LIFE.r + 4);
        this.panelCtx.fillStyle = this.cfg.colors.lines;
        this.panelCtx.fillRect(LIFE.r - 10, (y * this.cfg.grid.scale) + LIFE.r, 10, 1);
        this.panelCtx.fillRect((LIFE.x - 2 * LIFE.o) * 2 + LIFE.r, (y * this.cfg.grid.scale) + LIFE.r, 10, 1);
      }
    }
    for (let x = 0; x <= this.cfg.grid.x; x++) {
      if ((x + this.cfg.origin.x) % this.cfg.grid.rulerX === 0) {
        this.panelCtx.fillStyle = '#808080';
        this.panelCtx.fillText(`${x + this.cfg.origin.x}`, (x * this.cfg.grid.scale) + LIFE.r - 6, LIFE.r - 16);
        this.panelCtx.fillText(`${x + this.cfg.origin.x}`, (x * this.cfg.grid.scale) + LIFE.r - 6, (LIFE.y - 2 * LIFE.o) * 2 + LIFE.r + 24);
        this.panelCtx.fillStyle = this.cfg.colors.lines;
        this.panelCtx.fillRect((x * this.cfg.grid.scale) + LIFE.r, LIFE.r - 10, 1, 10);
        this.panelCtx.fillRect((x * this.cfg.grid.scale) + LIFE.r, (LIFE.y - 2 * LIFE.o) * 2 + LIFE.r, 1, 10);
      }
    }
  }

  cellsInit(): void {
    this.cells.nativeElement.width = (LIFE.x - 2 * LIFE.o) * 2;
    this.cells.nativeElement.height = (LIFE.y - 2 * LIFE.o) * 2;
    this.cellsCtx = this.cells.nativeElement.getContext('2d');
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
    ev.preventDefault();
    if (ev.buttons === 1) {
      if (this.tool === 'draw') {
        this.toggleCell(ev);
        return;
      }
      if (this.tool === 'pan') {
        this.clickPan(ev);
        return;
      }
    } else if (ev.buttons === 4) {
      this.clickPan(ev);
    }
  }

  clickPan(ev: PointerEvent): void {
    this.pan = { x: ev.clientX, y: ev.clientY };
    this.clickPanMode = true;
    this.control.nativeElement.style.cursor = 'grabbing';
  }

  releaseClick(ev: PointerEvent): void {
    this.clickPanMode = false;
    if (this.tool === 'pan') {
      this.control.nativeElement.style.cursor = 'grab';
      return;
    }
    this.control.nativeElement.style.cursor = 'default';
  }

  toggleCell(ev: PointerEvent): void {
    const uX = Math.round((ev.clientX - LIFE.r - this.cfg.grid.scale * 0.5) / this.cfg.grid.scale) + this.cfg.origin.x + LIFE.o;
    const uY = Math.round((ev.clientY - LIFE.r - this.cfg.grid.scale * 0.5) / this.cfg.grid.scale) + this.cfg.origin.y + LIFE.o;
    this.life.universe[uY][uX] = this.life.universe[uY][uX] === 1 ? 0 : 1;
    this.drawCells();
    this.hasChanges = true;
  }

  panUniverse(ev: PointerEvent): void {
    if (!this.clickPanMode) {
      return;
    }
    const cP = LIFE.r - this.cfg.grid.scale * 0.5;
    const panY = Math.round((this.pan.y - cP) / this.cfg.grid.scale) + this.cfg.origin.y;
    const panX = Math.round((this.pan.x - cP) / this.cfg.grid.scale) + this.cfg.origin.x;
    const nextY = Math.round((ev.clientY - cP) / this.cfg.grid.scale) + this.cfg.origin.y;
    const nextX = Math.round((ev.clientX - cP) / this.cfg.grid.scale) + this.cfg.origin.x;
    if (panX !== nextX || panY !== nextY) {
      this.cfg.origin = { x: panX - nextX + this.cfg.origin.x, y: panY - nextY + this.cfg.origin.y };
      this.checkLimits();
      this.pan = { x: ev.clientX, y: ev.clientY };
      this.data.updateConfig(this.cfg);
    }
  }

  changeScale(ev: WheelEvent): void {
    const uY = Math.round((ev.clientY - LIFE.r - this.cfg.grid.scale * 0.5) / this.cfg.grid.scale) + this.cfg.origin.y;
    const uX = Math.round((ev.clientX - LIFE.r - this.cfg.grid.scale * 0.5) / this.cfg.grid.scale) + this.cfg.origin.x;
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
    nY = Math.round((ev.clientY - LIFE.r - GRIDS[this.cfg.grid.size + idx].scale * 0.5) / GRIDS[this.cfg.grid.size + idx].scale);
    nX = Math.round((ev.clientX - LIFE.r - GRIDS[this.cfg.grid.size + idx].scale * 0.5) / GRIDS[this.cfg.grid.size + idx].scale);
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

  toggleDisplay(id: string): void {
    if (id === 'colors') {
      this.modalType = id;
      this.showLifeModal = true;
      return;
    }
    this.cfg.display[id] = !this.cfg.display[id];
    this.data.updateConfig(this.cfg);
  }

  toggleZoom(id: string): void {
    let idx: number;
    if (id === 'zoomOut') {
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
    const mY = (LIFE.y / 2 - LIFE.o) * 2 + LIFE.r;
    const mX = (LIFE.x / 2 - LIFE.o) * 2 + LIFE.r;
    const uY = Math.round((mY - LIFE.r - this.cfg.grid.scale * 0.5) / this.cfg.grid.scale) + this.cfg.origin.y;
    const uX = Math.round((mX - LIFE.r - this.cfg.grid.scale * 0.5) / this.cfg.grid.scale) + this.cfg.origin.x;
    const nY = Math.round((mY - LIFE.r - GRIDS[this.cfg.grid.size + idx].scale * 0.5) / GRIDS[this.cfg.grid.size + idx].scale);
    const nX = Math.round((mX - LIFE.r - GRIDS[this.cfg.grid.size + idx].scale * 0.5) / GRIDS[this.cfg.grid.size + idx].scale);
    this.cfg.grid = GRIDS[this.cfg.grid.size + idx];
    this.cfg.origin = { x: uX - nX, y: uY - nY };
    this.checkLimits();
    this.data.updateConfig(this.cfg);
  }

  selectEdit(id: string): void {
    if (id === 'new') {
      if (!this.hasChanges) {
        this.newUniverse();
        return;
      }
      this.popupType = 'new';
      this.showLifePopup = true;
      return;
    }
    if (id === 'load') {
      if (this.hasChanges) {
        this.popupType = 'load';
        this.showLifePopup = true;
        return;
      }
    }
    if (id === 'quickSave') {
      this.saveLife(this.cfg.universes.find(uni => uni.id === this.loadedId));
      this.hasChanges = false;
      return;
    }
    this.modalType = id;
    this.showLifeModal = true;
  }

  newUniverse(): void {
    this.life.restartUniverse(true);
    this.drawCells();
    this.hasChanges = false;
    this.loadedId = null;
    this.showLifePopup = false;
  }

  selectTool(id: string): void {
    this.tool = id;
    if (id === 'draw') {
      this.control.nativeElement.style.cursor = 'default';
      return;
    }
    if (id === 'pan') {
      this.control.nativeElement.style.cursor = 'grab';
    }
  }

  gameMode(play: boolean): void {
    this.infoLeds = play;
    if (!play) {
      this.getBuildState();
      return;
    }
    this.life.setZeroState();
  }

  playback(id: string): void {
    switch (id) {
      case 'speed': {
        this.displaySpeedPopup();
        break;
      }
      case 'restart': {
        this.getBuildState();
        break;
      }
      case 'skip': {
        if (this.ticks === 999999) {
          return;
        }
        this.ticks++;
        this.tickRef = this.ticks;
        this.life.calcNextGen();
        this.drawCells();
        break;
      }
      case 'play': {
        if (this.playing) {
          this.stopLoop();
          this.fps = null;
          this.playing = false;
        } else {
          this.startLoop();
          this.playing = true;
        }
        break;
      }
    }
  }

  displaySpeedPopup(): void {
    this.popupType = 'speed';
    this.showLifePopup = true;
  }

  getBuildState(): void {
    this.ticks = 0;
    this.tickRef = 0;
    this.population = 0;
    this.fps = null;
    this.life.restartUniverse();
    this.drawCells();
  }

  popupConfirm(event: any): void {
    if (event === 'new') {
      this.newUniverse();
      return;
    }
    if (event === 'load') {
      this.modalType = event;
      this.showLifePopup = false;
      this.showLifeModal = true;
      return;
    }
    this.showLifePopup = false;
    this.cfg.speed = event * 1;
    this.data.updateConfig(this.cfg);
  }

  updateColors(colors: ColorsModel): void {
    this.cfg.colors = colors;
    this.data.updateConfig(this.cfg);
    this.showLifeModal = false;
  }

  loadLife(id: string): void {
    this.data.loadUniverse(id).then(
      (data: UniverseDataModel) => {
        this.life.restartUniverse(true);
        data.grid.forEach((y, yi) => y.forEach((x, xi) => {
          if (x === 1) {
            this.life.universe[yi + data.y + LIFE.o][xi + data.x + LIFE.o] = 1;
          }
        }));
        this.drawCells();
        this.hasChanges = false;
        this.loadedId = id;
        this.showLifeModal = false;
      },
      () => this.showLifeModal = false
    );
  }

  saveLife(data: UniverseModel): void {
    const time = new Date().getTime();
    if (!data.id) {
      data.id = `life-${time}`;
    }
    const info = this.saveUniverseDataAndGetInfo(data.id);
    data.pop = info[0];
    data.size = info[1];
    data.lastUpdate = time;
    this.saveUniverse(data);
    this.hasChanges = false;
    this.showLifeModal = false;
  }

  saveUniverse(data: UniverseModel): void {
    for (let i = 0; i < this.cfg.universes.length; i++) {
      if (data.id === this.cfg.universes[i].id) {
        this.cfg.universes[i] = data;
        return;
      }
    }
    this.cfg.universes.push(data);
    this.data.updateConfig(this.cfg);
  }

  saveUniverseDataAndGetInfo(id: string): any[] {
    const b = this.getUniverseBorders();
    const croppedGrid = Array.from({length: b[1] - b[0] + 1}).map(value => Array.from({length: b[3] - b[2] + 1}).map(v => 0));
    let pop = 0;
    for (let y = b[0]; y <= b[1] ; y++) {
      for (let x = b[2]; x <= b[3]; x++) {
        if (this.life.universe[y][x] === 1) {
          croppedGrid[y - b[0]][x - b[2]] = 1;
          pop++;
        }
      }
    }
    const data: UniverseDataModel = {
      x: b[2] - LIFE.o,
      y: b[0] - LIFE.o,
      grid: croppedGrid
    };
    this.data.saveUniverse(id, data);
    return [ pop, [ b[3] - b[2] + 1, b[1] - b[0] + 1 ] ];
  }

  getUniverseBorders(): number[] {
    const borders = [ 0, 0, 0, 0 ];
    top: for (let y = LIFE.o; y < LIFE.y - LIFE.o; y++) {
      for (let x = LIFE.o; x < LIFE.x - LIFE.o; x++) {
        if (this.life.universe[y][x] === 1) {
          borders[0] = y;
          break top;
        }
      }
    }
    down: for (let y = LIFE.y - LIFE.o; y >= LIFE.o; y--) {
      for (let x = LIFE.o; x < LIFE.x - LIFE.o; x++) {
        if (this.life.universe[y][x] === 1) {
          borders[1] = y;
          break down;
        }
      }
    }
    right: for (let x = LIFE.o; x < LIFE.x - LIFE.o; x++) {
      for (let y = LIFE.o; y < LIFE.y - LIFE.o; y++) {
        if (this.life.universe[y][x] === 1) {
          borders[2] = x;
          break right;
        }
      }
    }
    left: for (let x = LIFE.x - LIFE.o; x >= LIFE.o; x--) {
      for (let y = LIFE.o; y < LIFE.y - LIFE.o; y++) {
        if (this.life.universe[y][x] === 1) {
          borders[3] = x;
          break left;
        }
      }
    }
    return borders;
  }
}
