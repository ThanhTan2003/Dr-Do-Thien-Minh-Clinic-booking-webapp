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
  faStethoscope
} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

// Models
import { Service } from '../../../../../../../models/responses/medical/service.model';
import { ServiceCategory } from '../../../../../../../models/responses/medical/service-category.model';
import { PageResponse } from '../../../../../../../models/responses/page-response.model';

// Services
import { ServiceService } from '../../../../../../../shared/services/medical/service.service';
import { ServiceCategoryService } from '../../../../../../../shared/services/medical/service-category.service';

// Components
import { PageSizeSelectorComponent } from '../../../../../../shared/components/page-size-selector/page-size-selector.component';
import { PaginationComponent } from '../../../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-select-service',
  templateUrl: './select-service.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    PageSizeSelectorComponent,
    PaginationComponent
  ]
})
export class SelectServiceComponent implements OnInit, OnDestroy {
  @Output() serviceSelected = new EventEmitter<{ serviceCategory: ServiceCategory, service: Service }>();
  @Output() close = new EventEmitter<void>();

  // Data
  services: Service[] = [];
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
  faStethoscope = faStethoscope;

  private destroy$ = new Subject<void>();

  constructor(
    private serviceService: ServiceService,
    private serviceCategoryService: ServiceCategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadServiceCategories();
    this.loadServices();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadServiceCategories(): void {
    this.loadingCategories = true;
    this.serviceCategoryService.searchByCustomer('', 1, 100)
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

  loadServices(): void {
    this.loading = true;
    this.serviceService.searchByCustomer(this.keyword, this.selectedCategoryId, this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PageResponse<Service>) => {
          this.services = response.data;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading services:', error);
          this.toastr.error('Không thể tải danh sách dịch vụ');
          this.loading = false;
        }
      });
  }

  handleSearch(): void {
    this.currentPage = 1;
    this.loadServices();
  }

  refreshList(): void {
    this.keyword = '';
    this.selectedCategoryId = '';
    this.currentPage = 1;
    this.loadServices();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadServices();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadServices();
  }

  onCategoryChange(): void {
    this.currentPage = 1;
    this.loadServices();
  }

  selectService(service: Service): void {
    // Find the service category for this service
    const serviceCategory = this.serviceCategories.find(cat => cat.id === service.serviceCategoryId);
    if (serviceCategory) {
      this.serviceSelected.emit({ serviceCategory, service });
    } else {
      this.toastr.error('Không thể xác định chuyên môn của dịch vụ');
    }
  }

  onClose(): void {
    this.close.emit();
  }
}

