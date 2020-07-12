import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  @Input() type: string;
  @Input() speed: number;

  @Output() exit: EventEmitter<null> = new EventEmitter();
  @Output() confirm: EventEmitter<any> = new EventEmitter();

  popupForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    if (this.type === 'speed') {
      this.popupForm = this.formBuilder.group({
        speed: [
          this.speed,
          [
            Validators.required,
            Validators.min(1),
            Validators.max(300)
          ]
        ]
      });
    }
  }

  popupConfirm(): void {
    if (this.type === 'new') {
      this.confirm.emit('new');
      return;
    }
    if (this.type === 'load') {
      this.confirm.emit('load');
      return;
    }
    if (this.type === 'speed') {
      if (!/^[0-9]*$/.test(this.popupForm.get('speed').value) || this.popupForm.get('speed').invalid) {
        return;
      }
      this.confirm.emit(this.popupForm.get('speed').value);
      return;
    }
  }

}
