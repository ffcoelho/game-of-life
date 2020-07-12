import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MenuMode, MenuModel, MENU } from '../../models/menu.model';
import { ConfigModel } from 'src/app/models/config.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  private playOn: boolean;
  @Input()
  set playing(playing: boolean) {
    this.playOn = playing;
    this.playingState(playing);
  }
  get playing(): boolean {
    return this.playOn;
  }

  @Input() config: ConfigModel;
  @Input() disableQuickSave: boolean;

  @Output() gameMode: EventEmitter<boolean> = new EventEmitter();
  @Output() display: EventEmitter<string> = new EventEmitter();
  @Output() zoom: EventEmitter<string> = new EventEmitter();
  @Output() edit: EventEmitter<string> = new EventEmitter();
  @Output() tool: EventEmitter<string> = new EventEmitter();
  @Output() playback: EventEmitter<string> = new EventEmitter();

  public menu: MenuModel;

  public gameForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.menu = MENU;
  }

  ngOnInit(): void {
    this.gameForm = this.fb.group({
      speed: [
        this.config.speed,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(200)
        ]
      ]
    });
    this.modeAction(MenuMode.BUILD);
  }

  displayAction(id: string): void {
    this.display.emit(id);
  }

  zoomAction(id: string): void {
    this.zoom.emit(id);
  }

  editAction(id: string): void {
    this.edit.emit(id);
  }

  toolAction(id: string) {
    this.menu.tools.forEach(tool => {
      tool.led = false;
      if (id === tool.actionId) {
        tool.led = true;
      }
    });
    this.tool.emit(id);
  }

  modeAction(mode: MenuMode): void {
    this.menu.mode = mode;
    if (this.menu.mode === MenuMode.PLAY) {
      this.gameMode.emit(true);
      this.toggleButtonsState();
      return;
    }
    this.gameMode.emit(false);
    this.toggleButtonsState();
  }

  gameAction(id: string): void {
    this.playback.emit(id);
  }

  playingState(state: boolean): void {
    this.menu.game.forEach(sel => sel.disabled = state);
    this.menu.play[1].led = state;
    this.menu.selector.forEach(sel => sel.disabled = state);
  }

  toggleButtonsState(): void {
    if (this.menu.mode === MenuMode.PLAY) {
      this.menu.tools.forEach(tool => tool.disabled = true);
      this.menu.edit.forEach(tool => tool.disabled = true);
      this.menu.game.forEach(tool => tool.disabled = false);
      this.menu.play[0].disabled = false;
      this.toolAction('pan');
    } else {
      this.menu.tools.forEach(tool => tool.disabled = false);
      this.menu.edit.forEach(tool => tool.disabled = false);
      this.menu.game.forEach(tool => tool.disabled = true);
      this.menu.play[0].disabled = true;
      this.toolAction('draw');
    }
  }
}
