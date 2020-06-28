import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuMode, MenuModel, MENU } from '../models/menu.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input() set playing(playing: boolean) {
    this.playingState(playing);
  }

  @Output() game: EventEmitter<boolean> = new EventEmitter();
  @Output() playback: EventEmitter<string> = new EventEmitter();

  menu: MenuModel;

  displayColorsModal: boolean;

  constructor() {
    this.menu = MENU;
  }

  ngOnInit(): void {
  }

  mode(mode: MenuMode): void {
    if (mode === this.menu.mode) {
      this.menu.mode = MenuMode.NONE;
      this.game.emit(false);
      return;
    }
    this.menu.mode = mode;
    if (this.menu.mode === MenuMode.PLAY) {
      this.game.emit(true);
    }
  }

  gameAction(id: string): void {
    if (id === 'speed') {
      this.openColorsModal();
      return;
    }
    this.playback.emit(id);
  }

  openColorsModal(): void {
    this.displayColorsModal = true;
  }

  playingState(state: boolean): void {
    this.menu.selector.forEach(sel => sel.disabled = state);
    this.menu.game[0].disabled = state;
    this.menu.game[1].disabled = state;
    this.menu.game[2].disabled = state;
    this.menu.game[3].led = state;
  }

}