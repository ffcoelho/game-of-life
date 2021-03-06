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

  private menuMode: string;
  private playingOn: string;
  @Input()
  set mode(value: string) {
    this.menuMode = value ? value : 'playOff';
    if (value === 'rle') {
      this.rleState();
      return;
    }
    if (value === 'playOn') {
      this.playingState(true);
      this.playingOn = value;
    } else {
      this.playingState(false);
      this.playingOn = value;
    }
  }
  get mode(): string {
    return this.menuMode;
  }

  @Input() config: ConfigModel;
  @Input() disableQuickSave: boolean;
  @Input() loadedName: string;

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

  rleState(): void {
    this.toolAction('draw');
    this.menu.display.forEach(sel => sel.disabled = true);
    this.menu.edit.forEach(sel => sel.disabled = true);
    this.menu.edit[0].led = true;
    this.menu.edit[0].disabled = false;
    this.menu.edit[0].tooltip = 'Finish Draw';
    this.menu.game.forEach(sel => sel.disabled = true);
    this.menu.play.forEach(sel => sel.disabled = true);
    this.menu.save.disabled = true;
    this.menu.selector.forEach(sel => sel.disabled = true);
    this.menu.tools.forEach(sel => sel.disabled = true);
    this.menu.zoom.forEach(sel => sel.disabled = true);
  }

  playingState(state: boolean): void {
    this.menu.display[0].disabled = state;
    this.menu.game.forEach(sel => sel.disabled = state);
    this.menu.play[1].disabled = false;
    this.menu.play[1].led = state;
    this.menu.selector[0].disabled = state;
    this.menu.edit[0].tooltip = 'Import/Export';
    this.menu.edit[0].led = false;
    if (this.menu.mode === MenuMode.BUILD) {
      this.toggleButtonsState();
    }
  }

  toggleButtonsState(): void {
    if (this.menu.mode === MenuMode.PLAY) {
      this.menu.tools.forEach(tool => tool.disabled = true);
      this.menu.edit.forEach(tool => tool.disabled = true);
      this.menu.save.disabled = true;
      this.menu.game.forEach(tool => tool.disabled = false);
      this.menu.play[0].disabled = false;
      this.menu.selector[0].disabled = false;
      this.menu.selector[1].disabled = true;
      this.toolAction('pan');
    } else {
      this.menu.display.forEach(sel => sel.disabled = false);
      this.menu.zoom.forEach(sel => sel.disabled = false);
      this.menu.tools.forEach(tool => tool.disabled = false);
      this.menu.edit.forEach(tool => tool.disabled = false);
      this.menu.save.disabled = false;
      this.menu.game.forEach(tool => tool.disabled = true);
      this.menu.play[0].disabled = true;
      this.menu.selector[0].disabled = true;
      this.menu.selector[1].disabled = false;
      this.toolAction('draw');
    }
  }
}
