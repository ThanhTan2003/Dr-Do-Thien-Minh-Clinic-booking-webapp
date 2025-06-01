import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-modal-confirm-delete',
  standalone: true,
  imports: [NgIf],
  templateUrl: './admin-modal-confirm-delete.component.html'
})
export class AdminModalConfirmDeleteComponent {
  @Input() title = 'Xác nhận';
  @Input() content = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
