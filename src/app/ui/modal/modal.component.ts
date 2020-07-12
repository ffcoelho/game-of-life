import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigModel } from 'src/app/models/config.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() type: string;
  @Input() config: ConfigModel;

  @Output() exit: EventEmitter<null> = new EventEmitter();
  @Output() lifeLoad: EventEmitter<string> = new EventEmitter();
  @Output() lifeSave: EventEmitter<string> = new EventEmitter();

  modalForm: FormGroup;
  selected: number;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initModal();
  }

  initModal(): void {
    if (this.type === 'colors') {
      this.modalForm = this.formBuilder.group({
        alive: [ this.config ],
        dead: [ this.config ],
        grid: [ this.config ],
        lines: [ this.config ]
      });
      return;
    }
    this.modalForm = this.formBuilder.group({
      id: [ null ],
      name: [ 'New Life', Validators.required ],
      pop: [ null ],
      area: [ null ],
      lastUpdate: [ null ],
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

  updateColors(): void {}

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
    this.lifeSave.emit(this.modalForm.value);
  }
}
