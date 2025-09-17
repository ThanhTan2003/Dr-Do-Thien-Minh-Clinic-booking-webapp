import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faRotate, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { AppointmentService } from '../../../../../shared/services/appointment/appointment.service';
import { AppointmentResultResponse } from '../../../../../models/responses/appointment/appointment-result.response';
import { PageResponse } from '../../../../../models/responses/page-response.model';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { PageSizeSelectorComponent } from '../../../../shared/components/page-size-selector/page-size-selector.component';

@Component({
  selector: 'app-update-history',
  templateUrl: './update-history.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    PaginationComponent,
    PageSizeSelectorComponent
  ]
})
export class UpdateHistoryComponent implements OnInit {
  @Input() patientId: string = '';
  @Input() serviceId: string = '';
  @Input() appointmentDate: string = new Date().toISOString().split('T')[0]; 
  
  appointmentResults: AppointmentResultResponse[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  totalPages: number = 1;
  totalElements: number = 0;
  loading: boolean = false;

  faPlus = faPlus;
  faRotate = faRotate;
  faMagnifyingGlass = faMagnifyingGlass;

  constructor(
    private appointmentService: AppointmentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.patientId && this.serviceId) {
      this.loadAppointmentHistory();
    }
  }

  loadAppointmentHistory(): void {
    this.loading = true;
    this.appointmentService.getResultByPatientAndService(
      this.patientId, 
      this.serviceId, 
      this.appointmentDate, 
      this.currentPage, 
      this.pageSize
    ).subscribe({
      next: (res: PageResponse<AppointmentResultResponse>) => {
        this.appointmentResults = res.data;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.loading = false;
      },
      error: () => { 
        this.loading = false;
        this.toastr.error('Không thể tải lịch sử khám');
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAppointmentHistory();
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.loadAppointmentHistory();
  }

  refreshData(): void {
    this.loadAppointmentHistory();
  }
}
