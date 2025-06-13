import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { Service } from '../../../../../../models/responses/medical/service.model';
import { takeUntil } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ServiceService } from '../../../../../../shared/services/medical/service.service';
import { ServiceCategoryService } from '../../../../../../shared/services/medical/service-category.service';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { ServiceCategory } from '../../../../../../models/responses/medical/service-category.model';
import { ServiceRequest } from '../../../../../../models/requests/medical/service.request';
import { ToastrService } from 'ngx-toastr';
import { AdminModalConfirmComponent } from '../../../../../shared/components/modal-confirm/admin-modal-confirm.component';
import { AdminModalConfirmDeleteComponent } from '../../../../../shared/components/modal-confirm-delete/admin-modal-confirm-delete.component';
import { 
  faX, faPen, faStethoscope
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-service-info',
  templateUrl: './edit-service-info.component.html',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    FontAwesomeModule, 
    RouterOutlet,
    AdminModalConfirmComponent,
    AdminModalConfirmDeleteComponent
  ],
})
export class EditServiceInfoComponent implements OnInit, OnDestroy {
  serviceId: string | null = null;
  service: Service | null = null;
  categories: ServiceCategory[] = [];
  showConfirmModal: boolean = false;
  showConfirmModalDelete: boolean = false;
  modalTitle: string = '';
  modalContent: string = '';
  modalTitleDelete: string = '';
  modalContentDelete: string = '';
  private destroy$ = new Subject<void>();

  faX = faX;
  faPen = faPen;
  faStethoscope = faStethoscope;

  constructor(
    private serviceService: ServiceService,
    private serviceCategoryService: ServiceCategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.serviceId = params.get('serviceId');
      if (this.serviceId) {
        this.fetchService();
      }
    });
  }

  loadCategories(): void {
    this.serviceCategoryService.search('', 1, 1000).subscribe({
      next: (res) => {
        this.categories = res.data;
      },
      error: (error: any) => {
        this.toastr.error('Không thể tải danh sách chuyên môn', 'Lỗi');
        console.error('Error loading categories:', error);
      }
    });
  }

  fetchService(): void {
    if (!this.serviceId) return;
    
    this.serviceService.getById(this.serviceId).subscribe({
      next: (service) => {
        this.service = service;
      },
      error: (error) => {
        this.toastr.error('Không thể tải thông tin dịch vụ', 'Lỗi');
        console.error('Error loading service:', error);
      }
    });
  }

  onUpdate(): void {
    this.modalTitle = 'Xác nhận cập nhật';
    this.modalContent = 'Bạn có chắc chắn muốn cập nhật thông tin dịch vụ?';
    this.showConfirmModal = true;
  }

  onConfirmUpdate(): void {
    if (!this.service) return;
    
    const request: ServiceRequest = {
      serviceName: this.service.serviceName,
      description: this.service.description,
      price: this.service.price,
      serviceCategoryId: this.service.serviceCategoryId,
      status: this.service.status
    };

    this.serviceService.updateById(this.service.id, request).subscribe({
      next: () => {
        this.showConfirmModal = false;
        this.toastr.success('Cập nhật thông tin dịch vụ thành công', 'Thông báo');
      },
      error: (error: any) => {
        console.error('Error updating service:', error);
        this.showConfirmModal = false;
        this.toastr.error('Không thể cập nhật thông tin dịch vụ', 'Lỗi');
      }
    });
  }

  onCancelUpdate(): void {
    this.showConfirmModal = false;
  }

  onDelete(): void {
    this.modalTitleDelete = 'Xác nhận xóa';
    this.modalContentDelete = 'Bạn có chắc chắn muốn xóa thông tin dịch vụ này không?';
    this.showConfirmModalDelete = true;
  }

  onConfirmDelete(): void {
    if (!this.service) return;

    this.serviceService.deleteById(this.service.id).subscribe({
      next: () => {
        this.showConfirmModalDelete = false;
        this.toastr.success('Đã xóa thông tin dịch vụ thành công', 'Thông báo');
        this.router.navigate(['/admin/medical-service']);
      },
      error: (error) => {
        this.showConfirmModalDelete = false;
        this.toastr.error('Không thể xóa thông tin dịch vụ', 'Lỗi');
        console.error('Error deleting service:', error);
      }
    });
  }

  onCancelDelete(): void {
    this.showConfirmModalDelete = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
} 