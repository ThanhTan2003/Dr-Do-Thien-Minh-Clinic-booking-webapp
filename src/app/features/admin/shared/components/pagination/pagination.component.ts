import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html'
})
export class PaginationComponent {
  @Input() totalElements: number = 0;
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  isNumber(value: any): boolean {
    return typeof value === 'number';
  }

  handlePageClick(page: number | string): void {
    if (this.isNumber(page)) {
      this.onPageClick(page as number);
    }
  }

  getPageNumbers(): (number | string)[] {
    const pageNumbers: (number | string)[] = [];
    const maxDisplayPages = 7;  // Tổng số trang hiển thị (3 đầu + 3 sau + 1 trang hiện tại)

    // Hiển thị 3 trang đầu tiên
    for (let i = 1; i <= Math.min(3, this.totalPages); i++) {
      pageNumbers.push(i);
    }

    // Nếu trang hiện tại cách trang đầu tiên > 3, hiển thị dấu ba chấm
    if (this.currentPage > 4) {
      pageNumbers.push('...');
    }

    // Hiển thị 3 trang trước và sau trang hiện tại
    for (let i = Math.max(this.currentPage - 3, 4); i <= Math.min(this.currentPage + 3, this.totalPages - 1); i++) {
      pageNumbers.push(i);
    }

    // Nếu trang hiện tại cách trang cuối cùng > 3, hiển thị dấu ba chấm
    if (this.currentPage < this.totalPages - 3) {
      pageNumbers.push('...');
    }

    // Hiển thị 3 trang cuối cùng
    if (this.totalPages > 3) {
      pageNumbers.push(this.totalPages);
    }

    return pageNumbers;
  }

  onPageClick(page: number): void {
    this.pageChange.emit(page);
  }
}