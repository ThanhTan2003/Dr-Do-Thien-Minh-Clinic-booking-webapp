import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-detail',
  standalone: true,
  imports: [],
  templateUrl: './modal-detail.component.html'
})
export class ModalDetailComponent {
  @Input() title = '';
  @Input() content = '';
  @Output() close = new EventEmitter<void>();
}
