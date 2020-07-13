import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigModel, ColorsModel, THEMES } from 'src/app/models/config.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @ViewChild('previewer', { static: true })
  previewer: ElementRef<HTMLCanvasElement>;
  private previewerCtx: CanvasRenderingContext2D;

  @Input() type: string;
  @Input() config: ConfigModel;

  @Output() exit: EventEmitter<null> = new EventEmitter();
  @Output() colorsUpdate: EventEmitter<ColorsModel> = new EventEmitter();
  @Output() lifeLoad: EventEmitter<string> = new EventEmitter();
  @Output() lifeSave: EventEmitter<string> = new EventEmitter();
  @Output() lifeDelete: EventEmitter<number> = new EventEmitter();

  modalForm: FormGroup;
  selected: number;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initModal();
  }

  initModal(): void {
    if (this.type === 'colors') {
      this.modalForm = this.formBuilder.group({
        alive: [ this.config.colors.alive ],
        dead: [ this.config.colors.dead ],
        grid: [ this.config.colors.grid ],
        lines: [ this.config.colors.lines ]
      });
      this.initPreviewer();
      return;
    }
    this.modalForm = this.formBuilder.group({
      id: [ null ],
      name: [ 'New Life', Validators.required ],
      pop: [ null ],
      size: [ null ],
      lastUpdate: [ null ],
      oX: [ null ],
      oY: [ null ],
      oGrid: [ null ],
    });
  }

  selectFile(idx?: number): void {
    if (idx == null) {
      this.selected = -1;
      return;
    }
    this.selected = idx;
    this.modalForm.get('name').patchValue('New Life');
  }

  initPreviewer(): void {
    this.previewer.nativeElement.width = 201;
    this.previewer.nativeElement.height = 201;
    this.previewerCtx = this.previewer.nativeElement.getContext('2d');
    this.updatePreviewer();
  }

  updatePreviewer(): void {
    this.previewerCtx.fillStyle = this.modalForm.get('dead').value;
    this.previewerCtx.fillRect(0, 0, 201, 201);
    this.previewerCtx.fillStyle = this.modalForm.get('alive').value;
    this.previewerCtx.fillRect(91, 91, 10, 10);
    this.previewerCtx.fillRect(101, 101, 10, 10);
    this.previewerCtx.fillRect(101, 111, 10, 10);
    this.previewerCtx.fillRect(91, 111, 10, 10);
    this.previewerCtx.fillRect(81, 111, 10, 10);
    this.previewerCtx.fillStyle = this.modalForm.get('grid').value;
    this.previewerCtx.fillRect(0, 0, 1, 200);
    this.previewerCtx.fillRect(0, 0, 200, 1);
    for (let i = 10; i <= 200; i += 10) {
      this.previewerCtx.fillRect(i, 0, 1, 200);
      this.previewerCtx.fillRect(0, i, 201, 1);
    }
    this.previewerCtx.fillStyle = this.modalForm.get('lines').value;
    this.previewerCtx.fillRect(20, 0, 1, 200);
    this.previewerCtx.fillRect(70, 0, 1, 200);
    this.previewerCtx.fillRect(120, 0, 1, 200);
    this.previewerCtx.fillRect(170, 0, 1, 200);
    this.previewerCtx.fillRect(0, 30, 201, 1);
    this.previewerCtx.fillRect(0, 80, 201, 1);
    this.previewerCtx.fillRect(0, 130, 201, 1);
    this.previewerCtx.fillRect(0, 180, 201, 1);
  }

  resetColors(theme: number): void {
    this.modalForm.patchValue(THEMES[theme]);
    this.updatePreviewer();
  }

  updateColors(): void {
    this.colorsUpdate.emit(this.modalForm.value);
  }

  loadFile(): void {
    if (this.selected == null) {
      return;
    }
    this.lifeLoad.emit(this.config.universes[this.selected].id);
  }

  saveFile(): void {
    if (this.selected == null) {
      return;
    }
    if (this.selected !== -1) {
      this.modalForm.patchValue(this.config.universes[this.selected]);
    }
    if (this.modalForm.invalid) {
      return;
    }
    this.lifeSave.emit(this.modalForm.value);
  }

  deleteFile(idx: number): void {
    this.lifeDelete.emit(idx);
  }
}
