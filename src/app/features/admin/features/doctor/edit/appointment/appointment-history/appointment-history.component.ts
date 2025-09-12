import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../../../../../shared/services/appointment/appointment.service';
import { Appointment } from '../../../../../../models/responses/appointment/appointment.model';
import { PageResponse } from '../../../../../../models/responses/page-response.model';
import { PageSizeSelectorComponent } from '../../../../../shared/components/page-size-selector/page-size-selector.component';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { DoctorAppointmentUpdateComponent } from '../../../appointment/update/doctor-appointment-update.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCircleQuestion,
  faMagnifyingGlass,
  faRotate,
  faPenToSquare
} from '@fortawesome/free-solid-svg-icons';
import { getStatusClassForList } from '../../../../../../shared/util/status.util';

@Component({
  selector: 'app-doctor-appointment-history',
  templateUrl: './appointment-history.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageSizeSelectorComponent,
    PaginationComponent,
    FontAwesomeModule,
    DoctorAppointmentUpdateComponent
  ]
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
  faPenToSquare = faPenToSquare;

  // Modal
  showDetailModal: boolean = false;
  selectedAppointmentId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.doctorId = this.route.parent?.snapshot.paramMap?.get('doctorId') || '';

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

        this.loadAppointments();
      }
    });

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
    this.loadAppointments();
  }

  refreshList(): void {
    this.keyword = '';
    this.currentPage = 1;
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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  }

  openDetailModal(appointmentId: string) {
    this.selectedAppointmentId = appointmentId;
    this.showDetailModal = true;
  }

  closeDetailModal() {
    this.showDetailModal = false;
    this.selectedAppointmentId = null;
  }

  getStatusClass(status: string): string {
    return getStatusClassForList(status);
  }
} 