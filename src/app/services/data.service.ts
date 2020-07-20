import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as localforage from 'localforage';
import { ThemeService } from './theme.service';
import { ConfigModel, GRIDS, THEMES } from '../models/config.model';
import { UniverseDataModel } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public localDb: boolean;

  public update: Subject<ConfigModel> = new Subject<ConfigModel>();

  constructor(private theme: ThemeService) { }

  public updateConfig(config: ConfigModel): void {
    if (this.localDb) {
      this.setItem('config', config);
    }
    this.theme.updateStyleVars(config);
    this.update.next(config);
  }

  public saveUniverse(id: string, data: UniverseDataModel): void {
    if (this.localDb) {
      this.setItem(id, data);
    }
  }

  public loadUniverse(id: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getItem(id).then(
        value => resolve(value),
        err => reject()
      );
    });
  }

  public deleteUniverse(id: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.removeItem(id).then(
        () => resolve(),
        err => reject()
      );
    });
  }

  public initialize(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.dbInit().then(
        () => {
          this.getItem('config').then(
            (storedConfig) => {
              if (storedConfig == null) {
                this.setItem('config', this.generateConfig()).then(
                  (newConfig) => {
                    this.localDb = true;
                    this.storeSample(newConfig);
                    resolve(newConfig);
                  },
                  (error) => {
                    this.localDb = false;
                    reject(error);
                  }
                );
              } else {
                this.localDb = true;
                resolve(storedConfig);
              }
            },
            (error) => {
              this.localDb = false;
              reject(error);
            }
          );
        },
        (error) => {
          this.localDb = false;
          reject(error);
        }
      );
    });
  }

  private getItem(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      localforage.getItem(key)
      .then(
        (result) => resolve(result),
        (error) => reject(error)
      );
    });
  }

  private setItem(key: string, value: any): Promise<any> {
    return new Promise((resolve, reject) => {
      localforage.setItem(key, value)
      .then(
        (result) => resolve(result),
        (error) => reject(error)
      );
    });
  }

  private removeItem(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      localforage.removeItem(key)
      .then(
        () => resolve(),
        (error) => reject(error)
      );
    });
  }

  private dbInit(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        localforage.config({
          driver: [
            localforage.INDEXEDDB,
            localforage.LOCALSTORAGE
          ],
          name: 'life-app',
          storeName: 'default'
        });
      } catch (error) {
        reject(error);
      }
      resolve();
    });
  }

  private generateConfig(): ConfigModel {
    return {
      colors: THEMES[0],
      display: {
        lines: true,
        ruler: true
      },
      grid: GRIDS[2],
      origin: { x: 180, y: 135 },
      speed: 60,
      universes: [
      ],
      startScreen: true
    };
  }

  private storeSample(config: ConfigModel): void {
    
  }
}
