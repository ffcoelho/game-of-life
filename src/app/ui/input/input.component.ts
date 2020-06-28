import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  @Input() type: string;
  @Input() txt: string;
  @Input() num: number;
  @Input() min = 0;
  @Input() max = 1;
  @Input() minLength = 0;
  @Input() maxLength = 1;

  form: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    const n: number = this.num ? this.num : null;
    const t: string = this.txt ? this.txt : null;
    this.form = this.fb.group({
      num: [n, [ Validators.min(this.min), Validators.max(this.max) ]],
      txt: [t, [ Validators.minLength(this.minLength), Validators.maxLength(this.maxLength) ]]
    });
  }

}
