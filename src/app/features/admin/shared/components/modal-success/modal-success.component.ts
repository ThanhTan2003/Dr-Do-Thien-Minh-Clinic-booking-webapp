import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-modal-success',
  standalone: true,
  imports: [NgIf],
  templateUrl: './modal-success.component.html'
})
export class ModalSuccessComponent {
  @Input() title = '';
  @Input() content = '';
  @Output() close = new EventEmitter<void>();
}
