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
    this.form = this.fb.group({
      num: [this.num, [ Validators.min(this.min), Validators.max(this.max) ]],
      txt: [this.txt, [ Validators.minLength(this.minLength), Validators.maxLength(this.maxLength) ]]
    });
  }

}
