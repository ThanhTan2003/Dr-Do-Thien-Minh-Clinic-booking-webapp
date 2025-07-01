import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mb-4"></div>
        <span class="text-sky-700 font-medium text-lg text-center">{{ content }}</span>
      </div>
    </div>
  `
})
export class ModalLoadingComponent {
  @Input() content: string = 'Đang xử lý...';
} 