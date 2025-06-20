import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../../../../../shared/services/appointment/appointment.service';
import { Appointment } from '../../../../../../models/responses/appointment/appointment.model';
import { PageResponse } from '../../../../../../models/responses/page-response.model';
import { PageSizeSelectorComponent } from '../../../../../shared/components/page-size-selector/page-size-selector.component';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faCircleQuestion,
  faMagnifyingGlass,
  faRotate
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-doctor-appointment-history',
  templateUrl: './appointment-history.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, PageSizeSelectorComponent, PaginationComponent, FontAwesomeModule]
})
export class DoctorAppointmentHistoryComponent implements OnInit {
  doctorId: string = '';
  appointments: Appointment[] = [];
  keyword: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  totalPages: number = 1;
  totalElements: number = 0;
  loading: boolean = false;
  faCircleQuestion = faCircleQuestion;
  faMagnifyingGlass = faMagnifyingGlass;
  faRotate = faRotate;
  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.doctorId = this.route.parent?.snapshot.paramMap?.get('doctorId') || '';
    this.loadAppointments();
  }

  loadAppointments(page: number = 1): void {
    this.loading = true;
    this.appointmentService.getDoctorAppointmentHistory(
      this.doctorId,
      '', // status
      this.keyword,
      page,
      this.pageSize
    ).subscribe({
      next: (res: PageResponse<Appointment>) => {
        this.appointments = res.data;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.currentPage = page;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  handleSearch(): void {
    this.currentPage = 1;
    this.loadAppointments();
  }

  refreshList(): void {
    this.keyword = '';
    this.currentPage = 1;
    this.loadAppointments();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAppointments(page);
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.loadAppointments();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  }
} 