import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-success',
  standalone: true,
  imports: [],
  templateUrl: './modal-success.component.html'
})
export class ModalSuccessComponent {
  @Input() title = '';
  @Input() content = '';
  @Output() close = new EventEmitter<void>();
}
