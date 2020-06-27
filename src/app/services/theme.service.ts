import { Injectable } from '@angular/core';
import { ConfigModel, LIFE } from '../models/config.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  updateStyleVars(config: ConfigModel): void {
    document.documentElement.style.setProperty('--ruler-color', `${config.colors.ruler}`);
    document.documentElement.style.setProperty('--ruler-label', `${config.colors.label}`);
    document.documentElement.style.setProperty('--grid-background', `${config.colors.dead}`);
  }
}
