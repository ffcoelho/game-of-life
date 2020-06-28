import { Injectable } from '@angular/core';
import { ConfigModel, LIFE } from '../models/config.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  updateStyleVars(config: ConfigModel): void {
    document.documentElement.style.setProperty('--panel-color', `${config.colors.panel}`);
    document.documentElement.style.setProperty('--led-color', `${config.colors.led}50`);
    document.documentElement.style.setProperty('--led-disable-color', `${config.colors.led}25`);
    document.documentElement.style.setProperty('--led-dim-color', `${config.colors.led}a4`);
    document.documentElement.style.setProperty('--led-on-color', `${config.colors.led}`);
    document.documentElement.style.setProperty('--ruler-color', `${config.colors.ruler}`);
    document.documentElement.style.setProperty('--ruler-label', `${config.colors.label}`);
    document.documentElement.style.setProperty('--grid-background', `${config.colors.dead}`);
  }
}
