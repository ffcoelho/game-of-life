import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { MenuMode, MenuModel, MENU } from '../../models/menu.model';
import { ConfigModel } from 'src/app/models/config.model';
import { nextTick } from 'process';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input() set playing(playing: boolean) {
    this.playingState(playing);
  }
  @Input() config: ConfigModel;

  @Output() game: EventEmitter<boolean> = new EventEmitter();
  @Output() display: EventEmitter<string> = new EventEmitter();
  @Output() zoom: EventEmitter<string> = new EventEmitter();
  @Output() tool: EventEmitter<string> = new EventEmitter();
  @Output() playback: EventEmitter<string> = new EventEmitter();

  public menu: MenuModel;
  public blocked: boolean;

  public gameForm: FormGroup;

  public displaySpeedInput: boolean;

  constructor(private fb: FormBuilder,
              private data: DataService) {
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
    this.selectMode(MenuMode.BUILD);
  }

  selectMode(mode: MenuMode): void {
    this.menu.mode = mode;
    if (this.menu.mode === MenuMode.PLAY) {
      this.game.emit(true);
      this.toggleButtonsState();
      return;
    }
    this.game.emit(false);
    this.toggleButtonsState();
  }

  toggleButtonsState(): void {
    if (this.menu.mode === MenuMode.PLAY) {
      this.menu.tools.forEach(tool => tool.disabled = true);
      this.menu.edit.forEach(tool => tool.disabled = true);
      this.menu.file.forEach(tool => tool.disabled = true);
      this.toolAction('pan');
    } else {
      this.menu.tools.forEach(tool => tool.disabled = false);
      this.menu.edit[6].disabled = false;
      this.menu.file.forEach(tool => tool.disabled = false);
      this.toolAction('draw');
    }
  }

  displayAction(id: string): void {
    this.display.emit(id);
  }

  zoomAction(id: string): void {
    this.zoom.emit(id);
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

  gameAction(id: string): void {
    if (id === 'speed') {
      this.showSpeedInput();
      return;
    }
    this.playback.emit(id);
  }

  playingState(state: boolean): void {
    // this.menu.game[0].disabled = state;
    // this.menu.game[1].disabled = state;
    // this.menu.game[2].disabled = state;
    // this.menu.game[3].led = state;
    // this.menu.selector.forEach(sel => sel.disabled = state);
    // this.menu.fixed[0].disabled = state;
    // this.menu.fixed[1].disabled = state;
    // this.menu.fixed[2].disabled = state;
  }

  showSpeedInput(): void {
    this.blocked = true;
    this.displaySpeedInput = true;
  }

  speedInputCancel(): void {
    this.displaySpeedInput = false;
    this.blocked = false;
    this.gameForm.get('speed').patchValue(this.config.speed);
  }

  speedInputUpdate(): void {
    if (!/^[0-9]*$/.test(this.gameForm.get('speed').value)) {
      return;
    }
    this.displaySpeedInput = false;
    this.blocked = false;
    this.config.speed = this.gameForm.get('speed').value * 1;
    this.data.updateConfig(this.config);
  }
}
