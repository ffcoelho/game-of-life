import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() disabled: boolean;
  @Input() icon: string;
  @Input() label: string;
  @Input() led: boolean;
  @Input() tooltip: string;

  @Output() action: EventEmitter<null> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  btnClick(): void {
    if (this.disabled) {
      return;
    }
    this.action.emit();
  }

}
