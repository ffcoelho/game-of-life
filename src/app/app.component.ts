import { Component, OnInit } from '@angular/core';
import { LifeService } from './services/life.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private life: LifeService) { }

  ngOnInit(): void {
    this.life.startService();
  }

  startLoop(): void {
    this.life.startLoop();
  }

  stopLoop(): void {
    this.life.stopLoop();
  }
}
