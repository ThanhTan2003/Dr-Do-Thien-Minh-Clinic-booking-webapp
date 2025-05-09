import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-modal-detail',
  standalone: true,
  imports: [NgIf],
  templateUrl: './modal-detail.component.html'
})
export class ModalDetailComponent {
  @Input() title = '';
  @Input() content = '';
  @Output() close = new EventEmitter<void>();
}
