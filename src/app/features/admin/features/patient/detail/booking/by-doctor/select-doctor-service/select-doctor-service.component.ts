import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faXmark,
  faMagnifyingGlass,
  faRotate,
  faCircleQuestion,
  faStethoscope
} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

// Models
import { DoctorService as DoctorServiceModel } from '../../../../../../../models/responses/doctor/doctor-service.model';
import { PageResponse } from '../../../../../../../models/responses/page-response.model';

// Services
import { DoctorServiceService } from '../../../../../../../shared/services/doctor/doctor-service.service';

// Components
import { PageSizeSelectorComponent } from '../../../../../../shared/components/page-size-selector/page-size-selector.component';
import { PaginationComponent } from '../../../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-select-doctor-service',
  templateUrl: './select-doctor-service.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    PageSizeSelectorComponent,
    PaginationComponent
  ]
})
export class SelectDoctorServiceComponent implements OnInit, OnDestroy {
  @Input() doctorId: string = '';
  @Output() doctorServiceSelected = new EventEmitter<DoctorServiceModel>();
  @Output() close = new EventEmitter<void>();

  // Data
  doctorServices: DoctorServiceModel[] = [];

  // Filters
  keyword: string = '';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  pageSizeOptions: number[] = [5, 10, 20, 50];

  // Loading
  loading: boolean = false;

  // Icons
  faXmark = faXmark;
  faMagnifyingGlass = faMagnifyingGlass;
  faRotate = faRotate;
  faCircleQuestion = faCircleQuestion;
  faStethoscope = faStethoscope;

  private destroy$ = new Subject<void>();

  constructor(
    private doctorServiceService: DoctorServiceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (!this.doctorId) {
      this.toastr.error('Thiếu thông tin bác sĩ');
      return;
    }
    this.loadDoctorServices();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDoctorServices(): void {
    this.loading = true;
    this.doctorServiceService.searchByDoctorAndCustomer(
      this.keyword,
      this.doctorId,
      true, // status = true
      true, // doctorStatus = true
      this.currentPage,
      this.pageSize
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PageResponse<DoctorServiceModel>) => {
          this.doctorServices = response.data;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading doctor services:', error);
          this.toastr.error('Không thể tải danh sách dịch vụ');
          this.loading = false;
        }
      });
  }

  handleSearch(): void {
    this.currentPage = 1;
    this.loadDoctorServices();
  }

  refreshList(): void {
    this.keyword = '';
    this.currentPage = 1;
    this.loadDoctorServices();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadDoctorServices();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadDoctorServices();
  }

  selectDoctorService(doctorService: DoctorServiceModel): void {
    this.doctorServiceSelected.emit(doctorService);
  }

  onClose(): void {
    this.close.emit();
  }
}
