import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faRefresh, faMagnifyingGlass, faX, faFileMedical, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { ServiceCategoryService } from '../../../../../shared/services/medical/service-category.service';
import { ServiceService } from '../../../../../shared/services/medical/service.service';
import { DoctorServiceService } from '../../../../../shared/services/doctor/doctor-service.service';
import { ServiceCategory } from '../../../../../models/responses/medical/service-category.model';
import { Service } from '../../../../../models/responses/medical/service.model';
import { DoctorServiceRequest } from '../../../../../models/requests/doctor/doctor-service.request';
import { PageResponse } from '../../../../../models/responses/page-response.model';
import { PageSizeSelectorComponent } from '../../../../shared/components/page-size-selector/page-size-selector.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { AdminModalConfirmComponent } from '../../../../shared/components/modal-confirm/admin-modal-confirm.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-doctor-service',
  templateUrl: './create-doctor-service.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    PageSizeSelectorComponent,
    PaginationComponent,
    AdminModalConfirmComponent
  ]
})
export class CreateDoctorServiceComponent implements OnInit {
  @Input() doctorId: string = '';
  @Output() close = new EventEmitter<void>();

  // Math for template
  Math = Math;

  // Icons
  faPlus = faPlus;
  faRefresh = faRefresh;
  faMagnifyingGlass = faMagnifyingGlass;
  faX = faX;
  faFileMedical = faFileMedical;
  faCircleInfo = faCircleInfo;
  // Data
  services: Service[] = [];
  serviceCategories: ServiceCategory[] = [];

  // Search and filter
  keyword: string = '';
  selectedCategoryId: string = '';
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  currentPage: number = 1;
  totalItems: number = 0;
  loading: boolean = false;

  // Modal
  showConfirmModal: boolean = false;
  modalTitle: string = '';
  modalContent: string = '';
  selectedService: Service | null = null;

  constructor(
    private serviceCategoryService: ServiceCategoryService,
    private serviceService: ServiceService,
    private doctorServiceService: DoctorServiceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadServiceCategories();
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.serviceService
      .searchServicesNotRegisteredByDoctor(this.keyword, this.doctorId, this.selectedCategoryId, this.currentPage, this.pageSize)
      .subscribe({
        next: (response: PageResponse<Service>) => {
          console.log('API Response:', response);
          this.services = response.data;
          this.totalItems = response.totalElements;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading services:', error);
          this.loading = false;
          this.services = [];
          this.totalItems = 0;
          this.toastr.error('Không thể tải danh sách dịch vụ', 'Lỗi');
        }
      });
  }

  loadServiceCategories(): void {
    this.serviceCategoryService
      .search('', 1, 1000)
      .subscribe({
        next: (response: PageResponse<ServiceCategory>) => {
          this.serviceCategories = response.data;
        },
        error: (error) => {
          console.error('Error loading categories:', error);
          this.serviceCategories = [];
          this.toastr.error('Không thể tải danh mục dịch vụ', 'Lỗi');
        }
      });
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadData();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadData();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadData();
  }

  onRefresh(): void {
    this.keyword = '';
    this.selectedCategoryId = '';
    this.currentPage = 1;
    this.loadData();
  }

  onAdd(service: Service): void {
    this.selectedService = service;
    this.modalTitle = 'Xác nhận thêm dịch vụ';
    this.modalContent = `Bạn có chắc chắn muốn thêm dịch vụ "${service.serviceName}"?`;
    this.showConfirmModal = true;
  }

  onConfirmAdd(): void {
    if (!this.selectedService || !this.doctorId) return;

    const request: DoctorServiceRequest = {
      doctorId: this.doctorId,
      serviceId: this.selectedService.id,
      serviceFee: this.selectedService.price,
      status: true
    };

    this.doctorServiceService.create(request).subscribe({
      next: () => {
        this.showConfirmModal = false;
        this.toastr.success('Thêm dịch vụ thành công', 'Thông báo');
        this.close.emit();
      },
      error: (error) => {
        console.error('Error adding service:', error);
        this.showConfirmModal = false;
        this.toastr.error('Không thể thêm dịch vụ', 'Lỗi');
      }
    });
  }

  onCancelAdd(): void {
    this.showConfirmModal = false;
    this.selectedService = null;
  }
}
