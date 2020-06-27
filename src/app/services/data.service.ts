import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as localforage from 'localforage';
import { ConfigModel, GRIDS } from '../models/config.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public localDb: boolean;

  public update: Subject<ConfigModel> = new Subject<ConfigModel>();

  constructor() { }

  public updateConfig(config: ConfigModel): void {
    if (this.localDb) {
      this.setItem('config', config);
    }
    this.update.next(config);
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
      colors: {
        alive: '#8bc34a',
        dead: '#000000',
        grid: '#404040',
        guide: '#575757',
        label: '#808080',
        ruler: '#000000'
      },
      darkMode: false,
      display: {
        grid: true,
        guide: true,
        ruler: true
      },
      grid: GRIDS[2],
      origin: { x: 0, y: 0 },
      speed: 60
    };
  }
}