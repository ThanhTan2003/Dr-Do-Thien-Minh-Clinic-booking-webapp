import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faXmark,
  faMagnifyingGlass,
  faRotate,
  faCircleQuestion,
  faUserMd
} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

// Models
import { Doctor } from '../../../../../../../models/responses/doctor/doctor.model';
import { ServiceCategory } from '../../../../../../../models/responses/medical/service-category.model';
import { PageResponse } from '../../../../../../../models/responses/page-response.model';

// Services
import { DoctorService } from '../../../../../../../shared/services/doctor/doctor.service';
import { ServiceCategoryService } from '../../../../../../../shared/services/medical/service-category.service';

// Components
import { PageSizeSelectorComponent } from '../../../../../../shared/components/page-size-selector/page-size-selector.component';
import { PaginationComponent } from '../../../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-select-doctor',
  templateUrl: './select-doctor.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    PageSizeSelectorComponent,
    PaginationComponent
  ]
})
export class SelectDoctorComponent implements OnInit, OnDestroy {
  @Output() doctorSelected = new EventEmitter<Doctor>();
  @Output() close = new EventEmitter<void>();

  // Data
  doctors: Doctor[] = [];
  serviceCategories: ServiceCategory[] = [];

  // Filters
  keyword: string = '';
  selectedCategoryId: string = '';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  pageSizeOptions: number[] = [5, 10, 20, 50];

  // Loading
  loading: boolean = false;
  loadingCategories: boolean = false;

  // Icons
  faXmark = faXmark;
  faMagnifyingGlass = faMagnifyingGlass;
  faRotate = faRotate;
  faCircleQuestion = faCircleQuestion;
  faUserMd = faUserMd;

  private destroy$ = new Subject<void>();

  constructor(
    private doctorService: DoctorService,
    private serviceCategoryService: ServiceCategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadServiceCategories();
    this.loadDoctors();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadServiceCategories(): void {
    this.loadingCategories = true;
    this.serviceCategoryService.search('', 1, 100)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PageResponse<ServiceCategory>) => {
          this.serviceCategories = response.data;
          this.loadingCategories = false;
        },
        error: (error: any) => {
          console.error('Error loading service categories:', error);
          this.toastr.error('Không thể tải danh sách chuyên môn');
          this.loadingCategories = false;
        }
      });
  }

  loadDoctors(): void {
    this.loading = true;
    this.doctorService.searchDoctorsByCategory(this.keyword, this.selectedCategoryId, this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PageResponse<Doctor>) => {
          this.doctors = response.data;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading doctors:', error);
          this.toastr.error('Không thể tải danh sách bác sĩ');
          this.loading = false;
        }
      });
  }

  handleSearch(): void {
    this.currentPage = 1;
    this.loadDoctors();
  }

  refreshList(): void {
    this.keyword = '';
    this.selectedCategoryId = '';
    this.currentPage = 1;
    this.loadDoctors();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadDoctors();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadDoctors();
  }

  onCategoryChange(): void {
    this.currentPage = 1;
    this.loadDoctors();
  }

  selectDoctor(doctor: Doctor): void {
    this.doctorSelected.emit(doctor);
  }

  onClose(): void {
    this.close.emit();
  }
}
