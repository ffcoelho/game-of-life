import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LifeService } from './services/life.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  public timer: any;
  public ticks: number;

  time: number;
  scale: number;

  constructor(private life: LifeService) { }

  ngOnInit(): void {
    const y = 500;
    const x = 380;
    this.scale = 1;
    // const y = 220;
    // const x = 200;
    // this.scale = 2;
    // const y = 120;
    // const x = 110;
    // this.scale = 4;
    this.life.startUniverse(y, x);
    this.chaosTest();
    this.startCanvas();
    this.drawGrid();
    this.life.calcNextGen();
  }

  drawGrid(): void {
    this.ctx.clearRect(0, 0, this.life.limitX - 20, this.life.limitY - 20);
    for (let y = 10; y < this.life.limitY - 10; y++) {
      for (let x = 10; x < this.life.limitX - 10; x++) {
        if (this.life.universe[y][x]) {
          this.ctx.fillStyle = '#FF0000';
          this.ctx.fillRect(x - 10, y - 10, 1, 1);
        }
      }
    }
  }

  startLoop(): void {
    this.ticks = 0;
    this.time = new Date().getTime();
    this.timer = setInterval(() => {
      if (this.ticks === 1103) {
        clearInterval(this.timer);
        return;
      }
      if (new Date().getTime() - this.time > 999) {
        console.log(this.ticks / 60);
        this.time = new Date().getTime();
      }
      this.ticks++;
      this.drawGrid();
      this.life.calcNextGen();
    }, 17);
  }

  stopLoop(): void {
    clearInterval(this.timer);
  }

  startCanvas(): void {
    this.canvas.nativeElement.width = (this.life.limitX - 20) * this.scale;
    this.canvas.nativeElement.height = (this.life.limitY - 20) * this.scale;
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.scale(this.scale, this.scale);
  }

  chaosTest(): void {
    // const chaosA = Array.from({length: this.life.limitY - 20}).map(value => Array.from({length: this.life.limitX - 20}).map(v => Math.round(Math.random() * 100) > 67 ? 1 : 0));
    // const posYa = 10;
    // const posXa = 10;
    const chaosA = [[0, 1, 1], [1, 1, 0], [0, 1, 0]];
    const posYa = this.life.limitY / 2 - 5;
    const posXa = this.life.limitX / 2 - 10;
    chaosA.forEach((y, yi) => {
      y.forEach((x, xi) => {
        this.life.universe[posYa + yi][posXa + xi] = x;
      });
    });
  }
}
