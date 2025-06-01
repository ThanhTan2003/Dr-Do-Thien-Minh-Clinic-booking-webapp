import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-modal-error',
  standalone: true,
  imports: [NgIf],
  templateUrl: './admin-modal-error.component.html'
})
export class AdminModalErrorComponent {
  @Input() title = 'Lỗi';
  @Input() content = '';
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
} 