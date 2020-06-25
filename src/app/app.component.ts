import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from './services/data.service';
import { LifeService } from './services/life.service';
import { ConfigModel } from './models/config.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public config: ConfigModel;
  public universeOn = false;

  public pattern: FormControl = new FormControl('');

  constructor(private data: DataService,
              private life: LifeService) { }

  ngOnInit(): void {
    this.data.initialize().then(
      (storedConfig: ConfigModel) => {
        this.config = storedConfig;
        this.life.startUniverse(storedConfig);
      }
    );
  }

  toggleUniverse(): void {
    this.universeOn = !this.universeOn;
  }
}
