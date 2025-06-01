import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-modal-success',
  standalone: true,
  imports: [NgIf],
  templateUrl: './admin-modal-success.component.html'
})
export class AdminModalSuccessComponent {
  @Input() title = 'Thông Báo';
  @Input() content = '';
  @Output() close = new EventEmitter<void>();
}
