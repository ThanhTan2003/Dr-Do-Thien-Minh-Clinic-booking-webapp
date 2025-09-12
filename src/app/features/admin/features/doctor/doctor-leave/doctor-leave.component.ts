import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { DoctorLeave } from '../../../../shared/services/doctor/doctor-leave.service';
import { DoctorLeaveResponse } from '../../../../models/responses/doctor/doctor-leave.model';
import { PageResponse } from '../../../../models/responses/page-response.model';
import { PageSizeSelectorComponent } from '../../../shared/components/page-size-selector/page-size-selector.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { AdminModalConfirmDeleteComponent } from '../../../shared/components/modal-confirm-delete/admin-modal-confirm-delete.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faMagnifyingGlass, 
  faRotate, 
  faPenToSquare, 
  faCircleQuestion,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { getVietnameseDayName, formatDateToString } from '../../../../shared/util/date.util';

@Component({
  selector: 'app-doctor-leave',
  templateUrl: './doctor-leave.component.html',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    PageSizeSelectorComponent, 
    PaginationComponent, 
    AdminModalConfirmDeleteComponent,
    FontAwesomeModule
  ]
})
export class DoctorLeaveComponent implements OnInit {
  // FontAwesome icons
  faMagnifyingGlass = faMagnifyingGlass;
  faRotate = faRotate;
  faPenToSquare = faPenToSquare;
  faCircleQuestion = faCircleQuestion;
  faTrash = faTrash;

  doctorLeaves: DoctorLeaveResponse[] = [];
  keyword: string = '';
  loading: boolean = false;

  // Pagination
  totalPages: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  totalElements: number = 0;

  // Modal
  showDeleteModal: boolean = false;
  selectedDoctorLeave: DoctorLeaveResponse | null = null;

  constructor(
    private doctorLeaveService: DoctorLeave,
    private router: Router,
    private route: ActivatedRoute
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
        
        this.loadDoctorLeaves();
      }
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.loadDoctorLeaves();
  }

  ngAfterViewInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn mượt về đầu trang
  }

  loadDoctorLeaves(): void {
    this.loading = true;
    this.doctorLeaveService.searchDoctorLeaves(
      this.keyword,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (res: PageResponse<DoctorLeaveResponse>) => {
        this.doctorLeaves = res.data;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error loading doctor leaves:', err);
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
    this.loadDoctorLeaves();
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateQueryParams();
    this.loadDoctorLeaves();
  }
  
  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.updateQueryParams();
    this.loadDoctorLeaves();
  }

  handleRefresh(): void {
    this.keyword = '';
    this.currentPage = 1;
    this.loadDoctorLeaves();
  }

  openDeleteModal(doctorLeave: DoctorLeaveResponse): void {
    this.selectedDoctorLeave = doctorLeave;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.selectedDoctorLeave) {
      this.doctorLeaveService.deleteDoctorLeave(this.selectedDoctorLeave.id).subscribe({
        next: () => {
          this.showDeleteModal = false;
          this.selectedDoctorLeave = null;
          this.loadDoctorLeaves();
        },
        error: (err) => {
          console.error('Error deleting doctor leave:', err);
          this.showDeleteModal = false;
          this.selectedDoctorLeave = null;
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.selectedDoctorLeave = null;
  }

  goToProcess(doctorLeaveId: string): void {
    this.router.navigate([doctorLeaveId], { relativeTo: this.route });
  }

  isFutureOrToday(leaveStartDate: string, leaveEndDate: string): boolean {
    const today = new Date();
    const start = new Date(leaveStartDate);
    const end = new Date(leaveEndDate);
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