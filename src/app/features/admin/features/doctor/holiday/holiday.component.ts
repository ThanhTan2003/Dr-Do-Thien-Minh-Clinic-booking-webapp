import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Holiday } from '../../../../shared/services/doctor/holiday.service';
import { HolidayResponse } from '../../../../models/responses/doctor/holiday.model';
import { PageResponse } from '../../../../models/responses/page-response.model';
import { PageSizeSelectorComponent } from '../../../shared/components/page-size-selector/page-size-selector.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { AdminModalConfirmDeleteComponent } from '../../../shared/components/modal-confirm-delete/admin-modal-confirm-delete.component';
import { AdminModalConfirmComponent } from '../../../shared/components/modal-confirm/admin-modal-confirm.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faTrash, faRotate, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { CreateHolidayComponent } from './create/create-holiday.component';
import { getVietnameseDayName, formatDateToString } from '../../../../shared/util/date.util';

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PageSizeSelectorComponent,
    PaginationComponent,
    AdminModalConfirmDeleteComponent,
    AdminModalConfirmComponent,
    FontAwesomeModule,
    CreateHolidayComponent
  ]
})
export class HolidayComponent implements OnInit {
  faPlus = faPlus;
  faTrash = faTrash;
  faRotate = faRotate;
  faPenToSquare = faPenToSquare;

  holidays: HolidayResponse[] = [];
  loading: boolean = false;
  keyword: string = '';

  // Pagination
  totalPages: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  totalElements: number = 0;

  // Modal
  showDeleteModal: boolean = false;
  showCreateModal: boolean = false;
  showConfirmCreateModal: boolean = false;
  selectedHoliday: HolidayResponse | null = null;
  createFormData: any = null;

  constructor(
    private holidayService: Holiday,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // Chỉ cập nhật các giá trị nếu chúng thực sự thay đổi
      const newPage = +params['page'] || 1;
      const newSize = +params['size'] || 10;
      const newKeyword = params['keyword'] || '';
      
      // Kiểm tra xem có cần cập nhật không
      if (newPage !== this.currentPage || 
          newSize !== this.pageSize || 
          newKeyword !== this.keyword) {
        
        this.currentPage = newPage;
        this.pageSize = newSize;
        this.keyword = newKeyword;
        
        this.loadHolidays();
      }
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.loadHolidays();
  }

  ngAfterViewInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn mượt về đầu trang
  }

  loadHolidays(): void {
    this.holidays = [];
    this.loading = true;
    this.holidayService.getAllHolidays(
      this.keyword,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (res: PageResponse<HolidayResponse>) => {
        this.holidays = res.data;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error loading holidays:', err);
      }
    });
  }

  updateQueryParams() {
    const queryParams: any = {
      page: this.currentPage,
      size: this.pageSize,
      keyword: this.keyword
    };
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      replaceUrl: true
    });
  }

  handleSearch(): void {
    this.currentPage = 1;
    this.updateQueryParams();
    this.loadHolidays();
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateQueryParams();
    this.loadHolidays();
  }
  
  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.updateQueryParams();
    this.loadHolidays();
  }

  handleRefresh(): void {
    this.keyword = '';
    this.currentPage = 1;
    this.loadHolidays();
  }

  openDeleteModal(holiday: HolidayResponse): void {
    this.selectedHoliday = holiday;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.selectedHoliday) {
      this.holidayService.deleteHoliday(this.selectedHoliday.id).subscribe({
        next: () => {
          this.showDeleteModal = false;
          this.selectedHoliday = null;
          this.loadHolidays();
        },
        error: (err) => {
          console.error('Error deleting holiday:', err);
          this.showDeleteModal = false;
          this.selectedHoliday = null;
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.selectedHoliday = null;
  }

  // Thêm mới
  openCreateModal(): void {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.createFormData = null;
  }

  onCreateHoliday(formData: any): void {
    this.createFormData = formData;
    this.showConfirmCreateModal = true;
  }

  confirmCreate(): void {
    if (this.createFormData) {
      this.holidayService.createHoliday(this.createFormData).subscribe({
        next: () => {
          this.showCreateModal = false;
          this.showConfirmCreateModal = false;
          this.createFormData = null;
          this.loadHolidays();
        },
        error: (err) => {
          console.error('Error creating holiday:', err);
          this.showConfirmCreateModal = false;
        }
      });
    }
  }

  goToProcess(holidayId: string): void {
    this.router.navigate([holidayId], { relativeTo: this.route });
  }

  cancelCreate(): void {
    this.showConfirmCreateModal = false;
    this.createFormData = null;
  }

  isFutureOrToday(startDate: string, endDate: string): boolean {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start >= today || end >= today;
  }

  formatDate(dateString: string): string {
    return formatDateToString(new Date(dateString));
  }

  getVietnameseDayName(date: string): string {
    const dateObj = new Date(date);
    return getVietnameseDayName(dateObj);
  }
} 