import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../../../shared/services/appointment/appointment.service';
import { Appointment } from '../../../../models/responses/appointment/appointment.model';
import { AppointmentStatisticsService } from '../../../../shared/services/appointment/appointment-statistics.service';
import { AppointmentStatusCount } from '../../../../models/responses/appointment/appointment-status-count.model';
import { PageResponse } from '../../../../models/responses/page-response.model';
import { PageSizeSelectorComponent } from '../../../shared/components/page-size-selector/page-size-selector.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faCircleQuestion,
  faMagnifyingGlass,
  faRotate,
  faChevronLeft,
  faChevronRight,
  faPenToSquare,
  faCalendarCheck, faClock, faStethoscope, faCheckCircle, faTimesCircle, faUserMd, faChalkboardTeacher
} from '@fortawesome/free-solid-svg-icons';
import { FormatDatePipe } from '../../../../shared/pipes/format-date.pipe';
import {BirthYearPipe} from '../../../../shared/pipes/birth-year.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorAppointmentUpdateComponent } from './update/doctor-appointment-update.component';

// Import utility functions
import { getStatusClassForList } from '../../../../shared/util/status.util';

@Component({
  selector: 'app-doctor-appointment-list',
  templateUrl: './doctor-appointment-list.component.html',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    PageSizeSelectorComponent, 
    PaginationComponent, 
    FontAwesomeModule, 
    FormatDatePipe,
    BirthYearPipe,
    DoctorAppointmentUpdateComponent
  ]
})
export class DoctorAppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  statistics: AppointmentStatusCount = {
    totalAppointments: 0,
    pendingConfirmationCount: 0,
    waitingForExamCount: 0,
    examinedCount: 0,
    cancelledCount: 0
  };

  currentPage: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  loading: boolean = false;
  
  // Date navigation
  selectedDate: string = new Date().toISOString().split('T')[0];
  
  // Filters
  selectedStatus: string = '';
  keyword: string = '';
  statuses: string[] = [];
  
  // Page size options
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  
  // FontAwesome icons
  faCircleQuestion = faCircleQuestion;
  faMagnifyingGlass = faMagnifyingGlass;
  faRotate = faRotate;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faPenToSquare = faPenToSquare;

  faCalendarCheck = faCalendarCheck;
  faClock = faClock;
  faStethoscope = faStethoscope;
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  faUserMd = faUserMd;
  faChalkboardTeacher = faChalkboardTeacher;

  showUpdateModal: boolean = false;
  selectedAppointmentId: string | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private appointmentStatisticsService: AppointmentStatisticsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedDate = params['date'] || new Date().toISOString().split('T')[0];
      this.currentPage = +params['page'] || 1;
      this.pageSize = +params['size'] || 10;
      this.selectedStatus = params['status'] || '';
      this.keyword = params['keyword'] || '';
      this.loadStatuses();
      this.loadAppointments();
      this.loadStatistics();
    });
  }

  loadStatuses(): void {
    this.appointmentService.getAppointmentStatuses().subscribe({
      next: (statuses) => {
        this.statuses = statuses;
      },
      error: (error) => {
        console.error('Error loading appointment statuses:', error);
      }
    });
  }

  loadAppointments(): void {
    this.loading = true;
    this.appointmentService.getAllDoctorsAppointmentsByDate(
      this.selectedDate,
      this.selectedStatus,
      this.keyword,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (response: PageResponse<Appointment>) => {
        this.appointments = response.data;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.loading = false;
      }
    });
  }

  loadStatistics(): void {
    this.appointmentStatisticsService.getStatisticsByDate(this.selectedDate).subscribe({
      next: (statistics: AppointmentStatusCount) => {
        this.statistics = statistics;
      }
    });
  }

  // Date navigation methods
  goToPreviousDay(): void {
    const currentDate = new Date(this.selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    this.selectedDate = currentDate.toISOString().split('T')[0];
    this.currentPage = 1;
    this.loadAppointments();
    this.loadStatistics();
  }

  goToNextDay(): void {
    const currentDate = new Date(this.selectedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    this.selectedDate = currentDate.toISOString().split('T')[0];
    this.currentPage = 1;
    this.loadAppointments();
    this.loadStatistics();
  }

  goToToday(): void {
    this.selectedDate = new Date().toISOString().split('T')[0];
    this.currentPage = 1;
    this.loadAppointments();
    this.loadStatistics();
  }

  onDateChange(): void {
    this.currentPage = 1;
    this.updateQueryParams();
    this.loadAppointments();
    this.loadStatistics();
  }

  // Filter and search methods
  handleSearch(): void {
    this.currentPage = 1;
    this.updateQueryParams();
    this.loadAppointments();
    this.loadStatistics();
  }

  handleStatusChange(): void {
    this.currentPage = 1;
    this.updateQueryParams();
    this.loadAppointments();
  }

  // Pagination methods
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateQueryParams();
    this.loadAppointments();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.updateQueryParams();
    this.loadAppointments();
  }

  // Utility methods
  refreshList(): void {
    this.loadAppointments();
    this.loadStatistics();
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

  // Sử dụng utility function thay vì local mapping
  getStatusClass(status: string): string {
    return getStatusClassForList(status);
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
      this.loadStatistics();
    }
  }
}
