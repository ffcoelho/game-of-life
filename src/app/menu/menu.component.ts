import { Component, OnInit } from '@angular/core';
import { MenuMode, MenuModel, MENU } from '../models/menu.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  menu: MenuModel;

  constructor() {
    this.menu = MENU;
  }

  ngOnInit(): void {
  }

  mode(mode: MenuMode): void {
    if (mode === this.menu.mode) {
      this.menu.mode = MenuMode.NONE;
      return;
    }
    this.menu.mode = mode;
  }

}
