import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-modal-detail',
  standalone: true,
  imports: [NgIf],
  templateUrl: './admin-modal-detail.component.html'
})
export class AdminModalDetailComponent {
  @Input() title = '';
  @Input() content = '';
  @Output() close = new EventEmitter<void>();
}
