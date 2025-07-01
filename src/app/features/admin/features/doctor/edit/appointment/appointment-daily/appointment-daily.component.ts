import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faMagnifyingGlass, 
  faRotate, 
  faChevronLeft, 
  faChevronRight,
  faCalendarDay,
  faCircleQuestion,
  faPenToSquare
} from '@fortawesome/free-solid-svg-icons';
import { AppointmentService } from '../../../../../../shared/services/appointment/appointment.service';
import { Appointment } from '../../../../../../models/responses/appointment/appointment.model';
import { PageResponse } from '../../../../../../models/responses/page-response.model';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { PageSizeSelectorComponent } from '../../../../../shared/components/page-size-selector/page-size-selector.component';
import { DoctorAppointmentUpdateComponent } from '../../../appointment/update/doctor-appointment-update.component';

@Component({
  selector: 'app-appointment-daily',
  templateUrl: './appointment-daily.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    PaginationComponent,
    PageSizeSelectorComponent,
    DoctorAppointmentUpdateComponent
  ]
})
export class AppointmentDailyComponent implements OnInit {
  doctorId: string = '';
  selectedDate: string = '';
  appointments: Appointment[] = [];
  statuses: string[] = [];
  selectedStatus: string = '';
  keyword: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  totalPages: number = 1;
  totalElements: number = 0;
  loading: boolean = false;
  showUpdateModal: boolean = false;
  selectedAppointmentId: string | null = null;

  faMagnifyingGlass = faMagnifyingGlass;
  faRotate = faRotate;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faCalendarDay = faCalendarDay;
  faCircleQuestion = faCircleQuestion;
  faPenToSquare = faPenToSquare;

  statusColorMap: { [key: string]: string } = {
    "Chờ xác nhận": "bg-orange-50 text-orange-600 border border-orange-600",
    "Chờ khám": "bg-blue-50 text-blue-600 border border-blue-600",
    "Đã huỷ": "bg-red-50 text-red-600 border border-red-600",
    "Đã khám": "bg-green-50 text-green-600 border border-green-600"
  };

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.doctorId = this.route.parent?.snapshot.paramMap?.get('doctorId') || '';
    this.route.queryParams.subscribe(params => {
      this.selectedDate = params['date'] || this.formatDateForInput(new Date());
      this.currentPage = +params['page'] || 1;
      this.pageSize = +params['size'] || 10;
      this.selectedStatus = params['status'] || '';
      this.keyword = params['keyword'] || '';
      this.loadStatuses();
      this.loadAppointments();
    });
  }

  loadStatuses(): void {
    this.appointmentService.getExamStatusList().subscribe({
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
    this.appointmentService.getDoctorAppointmentsForExamByDate(
      this.doctorId,
      this.selectedDate,
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

  handleSearch(): void {
    this.currentPage = 1;
    this.updateQueryParams();
    this.loadAppointments();
  }

  handleStatusChange(): void {
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

  updateQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        date: this.selectedDate,
        page: this.currentPage,
        size: this.pageSize,
        status: this.selectedStatus,
        keyword: this.keyword
      },
      queryParamsHandling: 'merge'
    });
  }

  // Date navigation functions
  goToPreviousDay(): void {
    const currentDate = new Date(this.selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    this.selectedDate = this.formatDateForInput(currentDate);
    this.currentPage = 1;
    this.loadAppointments();
  }

  goToNextDay(): void {
    const currentDate = new Date(this.selectedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    this.selectedDate = this.formatDateForInput(currentDate);
    this.currentPage = 1;
    this.loadAppointments();
  }

  goToToday(): void {
    this.selectedDate = this.formatDateForInput(new Date());
    this.currentPage = 1;
    this.loadAppointments();
  }

  onDateChange(): void {
    this.currentPage = 1;
    this.updateQueryParams();
    this.loadAppointments();
  }

  // Utility functions
  formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Hàm trả về màu sắc, nếu không có trong danh sách thì trả về màu xám
  getStatusClass(status: string): string {
    return this.statusColorMap[status] || 'bg-gray-50 text-gray-600';  // Màu xám cho trường hợp không xác định
  }

  openUpdateModal(appointmentId: string) {
    this.selectedAppointmentId = appointmentId;
    this.showUpdateModal = true;
  }

  closeUpdateModal(updated: boolean) {
    this.showUpdateModal = false;
    this.selectedAppointmentId = null;
    if (updated === true) {
      this.loadAppointments();
    }
  }
}
