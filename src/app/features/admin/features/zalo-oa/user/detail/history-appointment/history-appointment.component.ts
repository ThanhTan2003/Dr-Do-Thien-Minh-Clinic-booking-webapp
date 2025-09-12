import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faXmark, faCircleInfo, faRotate, faCircleQuestion,
  faCalendarCheck, faClock, faStethoscope, faCheckCircle, faTimesCircle
 } from '@fortawesome/free-solid-svg-icons';
import { AppointmentService } from '../../../../../../shared/services/appointment/appointment.service';
import { Appointment } from '../../../../../../models/responses/appointment/appointment.model';
import { PageResponse } from '../../../../../../models/responses/page-response.model';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { PageSizeSelectorComponent } from '../../../../../shared/components/page-size-selector/page-size-selector.component';
import { AppointmentDetailComponent } from './appointment-detail/appointment-detail.component';
import { AppointmentStatisticsService } from '../../../../../../shared/services/appointment/appointment-statistics.service';
import { AppointmentStatusCount } from '../../../../../../models/responses/appointment/appointment-status-count.model';

@Component({
  selector: 'app-history-appointment',
  templateUrl: './history-appointment.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    PaginationComponent,
    PageSizeSelectorComponent,
    AppointmentDetailComponent
  ]
})
export class HistoryAppointmentComponent implements OnInit {
  userId: string = '';

  appointments: Appointment[] = [];
  statistics: AppointmentStatusCount = {
    totalAppointments: 0,
    pendingConfirmationCount: 0,
    waitingForExamCount: 0,
    examinedCount: 0,
    cancelledCount: 0
  };
  statuses: string[] = [];
  selectedStatus: string = '';
  keyword: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  totalPages: number = 1;
  totalElements: number = 0;
  loading: boolean = false;

  // Modal state
  showDetailModal: boolean = false;
  selectedAppointmentId: string = '';

  faMagnifyingGlass = faMagnifyingGlass;
  faXmark = faXmark;
  faCircleInfo = faCircleInfo;
  faRotate = faRotate;
  faCircleQuestion = faCircleQuestion;

  faCalendarCheck = faCalendarCheck;
  faClock = faClock;
  faStethoscope = faStethoscope;
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  
  // Mảng trạng thái và màu sắc tương ứng
  statusColorMap: { [key: string]: string } = {
    "Chờ xác nhận": "bg-orange-50 text-orange-600 border border-orange-600",
    "Chờ khám": "bg-blue-50 text-blue-600 border border-blue-600",
    "Đã huỷ": "bg-red-50 text-red-600 border border-red-600",
    "Đã khám": "bg-green-50 text-green-600 border border-green-600"
  };

  // Hàm trả về màu sắc, nếu không có trong danh sách thì trả về màu xám
  getStatusClass(status: string): string {
    return this.statusColorMap[status] || 'bg-gray-50 text-gray-600';  // Màu xám cho trường hợp không xác định
  }

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private appointmentStatisticsService: AppointmentStatisticsService,
    private router: Router
  ) {}

    ngOnInit(): void {
      this.userId = this.route.parent?.snapshot.paramMap.get('userId') || '';
      
      this.route.queryParams.subscribe(params => {
        // Chỉ cập nhật các giá trị nếu chúng thực sự thay đổi
        const newPage = +params['page'] || 1;
        const newSize = +params['size'] || 10;
        const newKeyword = params['keyword'] || '';
        const newStatus = params['status'] || '';
        
        // Kiểm tra xem có cần cập nhật không
        if (newPage !== this.currentPage || 
            newSize !== this.pageSize || 
            newKeyword !== this.keyword ||
            newStatus !== this.selectedStatus) {
          
          this.currentPage = newPage;
          this.pageSize = newSize;
          this.keyword = newKeyword;
          this.selectedStatus = newStatus;
          
          this.loadStatuses();
          this.loadAppointments();
          this.loadStatistics();
        }
      });
      
      this.loadStatuses();
      this.loadAppointments();
      this.loadStatistics();
    }

  loadStatistics(): void {
    this.appointmentStatisticsService.getStatisticsByZaloUid(this.userId).subscribe({
      next: (statistics: AppointmentStatusCount) => {
        this.statistics = statistics;
      }
    });
  }

  loadStatuses(): void {
    this.appointmentService.getAppointmentStatuses().subscribe({
      next: (statuses: string[]) => {
        this.statuses = statuses;
      },
      error: (error) => {
        console.error('Error loading statuses:', error);
      }
    });
  }

  loadAppointments(page: number = 1): void {
    this.loading = true;
    this.appointmentService.getByZaloUid(
      this.userId,
      this.selectedStatus,
      this.keyword,
      page,
      this.pageSize
    ).subscribe({
      next: (response: PageResponse<Appointment>) => {
        this.appointments = response.data;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.currentPage = page;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.loading = false;
      }
    });
  }

  updateQueryParams() {
    const queryParams: any = {
      page: this.currentPage,
      size: this.pageSize,
      keyword: this.keyword
    };
    
    // Chỉ thêm status nếu có giá trị
    if (this.selectedStatus && this.selectedStatus.trim() !== '') {
      queryParams.status = this.selectedStatus;
    }
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      replaceUrl: true
    });
  }

  handleSearch(): void {
    this.currentPage = 1;
    this.updateQueryParams();
    this.loadAppointments();
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateQueryParams();
    this.loadAppointments(page);
  }
  
  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.updateQueryParams();
    this.loadAppointments();
  }

  refreshList(): void {
    this.keyword = '';
    this.selectedStatus = '';
    this.currentPage = 1;
    this.loadAppointments();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  }

  // Modal functions
  showAppointmentDetail(appointmentId: string): void {
    this.selectedAppointmentId = appointmentId;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedAppointmentId = '';
  }
} 