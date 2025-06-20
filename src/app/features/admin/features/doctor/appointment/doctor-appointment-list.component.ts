import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../../../shared/services/appointment/appointment.service';
import { Appointment } from '../../../../models/responses/appointment/appointment.model';
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
  faPenToSquare
} from '@fortawesome/free-solid-svg-icons';
import { FormatDatePipe } from '../../../../shared/pipes/format-date.pipe';
import {BirthYearPipe} from '../../../../shared/pipes/birth-year.pipe';

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
    BirthYearPipe]
})
export class DoctorAppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
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
  pageSizeOptions: number[] = [10, 20, 50, 100];
  
  // FontAwesome icons
  faCircleQuestion = faCircleQuestion;
  faMagnifyingGlass = faMagnifyingGlass;
  faRotate = faRotate;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faPenToSquare = faPenToSquare;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadStatuses();
    this.loadAppointments();
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

  // Date navigation methods
  goToPreviousDay(): void {
    const currentDate = new Date(this.selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    this.selectedDate = currentDate.toISOString().split('T')[0];
    this.currentPage = 1;
    this.loadAppointments();
  }

  goToNextDay(): void {
    const currentDate = new Date(this.selectedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    this.selectedDate = currentDate.toISOString().split('T')[0];
    this.currentPage = 1;
    this.loadAppointments();
  }

  goToToday(): void {
    this.selectedDate = new Date().toISOString().split('T')[0];
    this.currentPage = 1;
    this.loadAppointments();
  }

  onDateChange(): void {
    this.currentPage = 1;
    this.loadAppointments();
  }

  // Filter and search methods
  handleSearch(): void {
    this.currentPage = 1;
    this.loadAppointments();
  }

  handleStatusChange(): void {
    this.handleSearch();
  }

  // Pagination methods
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAppointments();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadAppointments();
  }

  // Utility methods
  refreshList(): void {
    this.loadAppointments();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Chờ phê duyệt':
        return 'bg-yellow-100 text-yellow-800';
      case 'Đã phê duyệt':
        return 'bg-blue-100 text-blue-800';
      case 'Chờ khám':
        return 'bg-orange-100 text-orange-800';
      case 'Đã khám':
        return 'bg-green-100 text-green-800';
      case 'Đã huỷ':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
