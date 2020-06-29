import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  @Input() type: string;
  @Input() parentForm: FormGroup;
  @Input() controlName: string;
  @Input() minLength: number;
  @Input() maxLength: number;

  constructor() { }

  ngOnInit(): void {
    if (this.type === 'number') {
      this.parentForm.get(this.controlName).valueChanges.subscribe((value: any) => this.limitNumLength(value));
    }
  }

  limitNumLength(value: any): void {
    if (value.toString().length > this.maxLength) {
      this.parentForm.get(this.controlName).patchValue(parseInt(value.toString().slice(0, this.maxLength), 10));
    }
  }
}
