import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-size-selector',
  templateUrl: './page-size-selector.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class PageSizeSelectorComponent {
  @Input() pageSize: number = 10;
  @Input() options: number[] = [5, 10, 20, 50, 100];
  @Output() pageSizeChange = new EventEmitter<number>();

  onChange(newSize: number) {
    this.pageSizeChange.emit(Number(newSize));
  }
}