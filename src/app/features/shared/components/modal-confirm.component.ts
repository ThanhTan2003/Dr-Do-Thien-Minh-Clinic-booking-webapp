import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-modal-confirm',
  standalone: true,
  imports: [NgIf],
  templateUrl: './modal-confirm.component.html'
})
export class ModalConfirmComponent {
  @Input() title = '';
  @Input() content = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
