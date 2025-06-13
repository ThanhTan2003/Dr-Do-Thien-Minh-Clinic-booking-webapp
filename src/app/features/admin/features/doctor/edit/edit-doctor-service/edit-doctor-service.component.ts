import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DoctorServiceService } from '../../../../../shared/services/doctor/doctor-service.service';
import { ServiceCategoryService } from '../../../../../shared/services/medical/service-category.service';
import { DoctorService } from '../../../../../models/responses/doctor/doctor-service.model';
import { ServiceCategory } from '../../../../../models/responses/medical/service-category.model';
import { DoctorServiceStatus } from '../../../../../models/responses/doctor/doctor-service-status.model';
import { DoctorServiceRequest } from '../../../../../models/requests/doctor/doctor-service.request';
import { PageResponse } from '../../../../../models/responses/page-response.model';
import { faPlus, faRefresh, faPen, faMagnifyingGlass, faX, faFileMedical, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { PageSizeSelectorComponent } from '../../../../shared/components/page-size-selector/page-size-selector.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { AdminModalConfirmComponent } from '../../../../shared/components/modal-confirm/admin-modal-confirm.component';
import { AdminModalConfirmDeleteComponent } from '../../../../shared/components/modal-confirm-delete/admin-modal-confirm-delete.component';
import { CreateDoctorServiceComponent } from '../create-doctor-service/create-doctor-service.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-doctor-service',
  templateUrl: './edit-doctor-service.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    PageSizeSelectorComponent,
    PaginationComponent,
    AdminModalConfirmComponent,
    AdminModalConfirmDeleteComponent,
    CreateDoctorServiceComponent
  ]
})
export class EditDoctorServiceComponent implements OnInit {
  // Math for template
  Math = Math;

  // Icons
  faPlus = faPlus;
  faRefresh = faRefresh;
  faPen = faPen;
  faMagnifyingGlass = faMagnifyingGlass;
  faX = faX;
  faFileMedical = faFileMedical;
  faClockRotateLeft = faClockRotateLeft;

  // Doctor ID from route
  doctorId: string | null = null;
  private destroy$ = new Subject<void>();

  // Data
  doctorServices: DoctorService[] = [];
  serviceCategories: ServiceCategory[] = [];
  serviceStatuses: DoctorServiceStatus[] = [];

  // Search and filter
  keyword: string = '';
  selectedCategoryId: string = '';
  selectedStatus: string = '';
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  currentPage: number = 1;
  totalItems: number = 0;
  loading: boolean = false;

  // Modal
  showConfirmModal: boolean = false;
  showConfirmModalDelete: boolean = false;
  modalTitle: string = '';
  modalContent: string = '';
  modalTitleDelete: string = '';
  modalContentDelete: string = '';
  selectedService: DoctorService | null = null;
  showCreateModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private doctorServiceService: DoctorServiceService,
    private serviceCategoryService: ServiceCategoryService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    // Initialize arrays
    this.doctorServices = [];
    this.serviceCategories = [];
    this.serviceStatuses = [];
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const current = this.route.snapshot.paramMap;                 // DoctorServiceComponent
        const level1 = this.route.parent?.snapshot.paramMap;          // DanhSachBacSiComponent chứa :doctorId
        const level2 = this.route.parent?.parent?.snapshot.paramMap;  // Nếu có, ví dụ cấp trên nữa

        this.doctorId = current?.get('doctorId') || '';
        console.log('doctorId', this.doctorId);


        if (this.doctorId) {
          this.loadServiceStatuses();
          this.loadServiceCategories();
          this.loadData();
        }
      });
  }

  loadData(): void {
    if (!this.doctorId) return;

    let status: boolean | undefined = undefined;
    if (this.selectedStatus !== '') {
      status = this.selectedStatus === 'true';
    }

    console.log('Loading data with params:', {
      keyword: this.keyword,
      doctorId: this.doctorId,
      status: status,
      categoryId: this.selectedCategoryId,
      page: this.currentPage,
      size: this.pageSize
    });

    this.loading = true;
    this.doctorServiceService
      .searchByDoctorAndServiceCategory(
        this.keyword,
        this.doctorId,
        status,
        this.selectedCategoryId,
        this.currentPage,
        this.pageSize
      )
      .subscribe({
        next: (response: PageResponse<DoctorService>) => {
          console.log('API Response:', response);
          this.doctorServices = response.data;
          this.totalItems = response.totalElements;
          this.loading = false;
          console.log('Updated doctorServices:', this.doctorServices);
        },
        error: (error) => {
          console.error('Error loading services:', error);
          this.loading = false;
          this.doctorServices = [];
          this.totalItems = 0;
          this.toastr.error('Không thể tải danh sách dịch vụ', 'Lỗi');
        }
      });
  }

  loadServiceCategories(): void {
    if (!this.doctorId) return;

    console.log('Loading service categories for doctor:', this.doctorId);
    this.serviceCategoryService
      .getByDoctorId(this.doctorId, 1, 1000)
      .subscribe({
        next: (response: PageResponse<ServiceCategory>) => {
          console.log('Categories API Response:', response);
          this.serviceCategories = response.data;
          console.log('Updated serviceCategories:', this.serviceCategories);
        },
        error: (error) => {
          console.error('Error loading categories:', error);
          this.serviceCategories = [];
          this.toastr.error('Không thể tải danh mục dịch vụ', 'Lỗi');
        }
      });
  }

  loadServiceStatuses(): void {
    console.log('Loading service statuses');
    this.doctorServiceService
      .getAllDoctorServiceStatuses()
      .subscribe({
        next: (statuses: DoctorServiceStatus[]) => {
          console.log('Statuses API Response:', statuses);
          this.serviceStatuses = statuses;
          console.log('Updated serviceStatuses:', this.serviceStatuses);
        },
        error: (error) => {
          console.error('Error loading statuses:', error);
          this.serviceStatuses = [];
          this.toastr.error('Không thể tải trạng thái dịch vụ', 'Lỗi');
        }
      });
  }

  onPageSizeChange(size: number): void {
    console.log('Page size changed to:', size);
    this.pageSize = size;
    this.currentPage = 1;
    this.loadData();
  }

  onPageChange(page: number): void {
    console.log('Page changed to:', page);
    this.currentPage = page;
    this.loadData();
  }

  onSearch(): void {
    console.log('Searching with keyword:', this.keyword);
    this.currentPage = 1;
    this.loadData();
  }

  onRefresh(): void {
    console.log('Refreshing data');
    this.keyword = '';
    this.selectedCategoryId = '';
    this.selectedStatus = '';
    this.currentPage = 1;
    this.loadData();
  }

  onUpdate(service: DoctorService): void {
    console.log('Updating service:', service);
    this.selectedService = service;
    this.modalTitle = 'Xác nhận cập nhật';
    this.modalContent = `Bạn có chắc chắn muốn cập nhật dịch vụ "${service.serviceResponse.serviceName}"?`;
    this.showConfirmModal = true;
  }

  onDelete(service: DoctorService): void {
    console.log('Deleting service:', service);
    this.selectedService = service;
    this.modalTitleDelete = 'Xác nhận xóa';
    this.modalContentDelete = `Bạn có chắc chắn muốn xóa dịch vụ "${service.serviceResponse.serviceName}"?`;
    this.showConfirmModalDelete = true;
  }

  onConfirmUpdate(): void {
    if (!this.selectedService) return;

    console.log('Confirming update for service:', this.selectedService);
    const request: DoctorServiceRequest = {
      doctorId: this.selectedService.doctorId,
      serviceId: this.selectedService.serviceId,
      serviceFee: this.selectedService.serviceFee,
      status: this.selectedService.status
    };

    this.doctorServiceService
      .updateById(this.selectedService.id, request)
      .subscribe({
        next: () => {
          console.log('Service updated successfully');
          this.showConfirmModal = false;
          this.toastr.success('Cập nhật dịch vụ thành công', 'Thông báo');
          this.loadData();
        },
        error: (error) => {
          console.error('Error updating service:', error);
          this.showConfirmModal = false;
          this.toastr.error('Không thể cập nhật dịch vụ', 'Lỗi');
        }
      });
  }

  onConfirmDelete(): void {
    if (!this.selectedService) {
      console.warn('Không có dịch vụ được chọn để xoá.');
      return;
    }
  
    console.log('Bắt đầu xoá dịch vụ với ID:', this.selectedService.id);
  
    this.doctorServiceService.deleteById(this.selectedService.id).subscribe({
      next: (res) => {
        console.log('Xóa thành công. Response:', res);
        this.toastr.success('Xóa dịch vụ thành công', 'Thông báo');
        this.showConfirmModalDelete = false;
        this.loadData();
        console.log('Gọi detectChanges() sau thành công xoá');
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.showConfirmModalDelete = false;
        console.error('Lỗi khi xoá dịch vụ:', error);
  
        if (error.status === 500 && error.error?.message) {
          this.toastr.error(error.error.message, 'Lỗi');
          // this.toastr.error('Không thể xóa dịch vụ', 'Lỗi');
          console.log('Lỗi 500 với message:', error.error.message);
        } else {
          this.toastr.error('Không thể xóa dịch vụ', 'Lỗi');
          console.log('Lỗi khác:', error.status);
        }
  
        console.log('Gọi detectChanges() sau khi lỗi xảy ra');
        this.cdr.detectChanges();
      }
    });
  }
  

  onCancelUpdate(): void {
    console.log('Cancelling action');
    this.showConfirmModal = false;
    this.selectedService = null;
  }

  onCancelDelete(): void {
    console.log('Cancelling delete action');
    this.showConfirmModalDelete = false;
    this.selectedService = null;
  }

  onAddNewService(): void {
    this.showCreateModal = true;
  }

  onCloseCreateModal(): void {
    this.showCreateModal = false;
    this.loadData();
    this.loadServiceCategories();
    this.loadServiceStatuses();
  }

} 