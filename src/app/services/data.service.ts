import { Injectable } from '@angular/core';
import * as localforage from 'localforage';
import { ConfigModel } from '../models/config.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public localDb: boolean;

  constructor() { }

  public updateConfig(config: ConfigModel): void {
    this.setItem('config', config);
  }

  public initialize(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.dbInit().then(
        () => {
          this.getItem('config').then(
            (storedConfig) => {
              if (storedConfig == null) {
                this.setItem('config', this.initConfig()).then(
                  (initConfig) => {
                    this.localDb = true;
                    resolve(initConfig);
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

  private initConfig(): ConfigModel {
    return {
      size: 3,
      speed: 1,
      step: 1,
      colors: {
        alive: '#000000',
        dead: '#CCCCCC',
        grid: '#777777'
      }
    };
  }

}
