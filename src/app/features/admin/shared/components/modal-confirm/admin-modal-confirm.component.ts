import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-modal-confirm',
  standalone: true,
  imports: [NgIf],
  templateUrl: './admin-modal-confirm.component.html'
})
export class AdminModalConfirmComponent {
  @Input() title = '';
  @Input() content = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
