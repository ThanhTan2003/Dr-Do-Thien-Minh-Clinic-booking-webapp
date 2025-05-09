import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-error',
  templateUrl: './modal-error.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class ModalErrorComponent {
  @Input() title: string = 'Lỗi';
  @Input() message: string = '';
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
} 