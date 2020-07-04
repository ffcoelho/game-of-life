import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() type: string;

  @Output() exit: EventEmitter<null> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
