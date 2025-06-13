import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceService } from '../../../../../shared/services/medical/service.service';
import { ServiceCategoryService } from '../../../../../shared/services/medical/service-category.service';
import { ServiceRequest } from '../../../../../models/requests/medical/service.request';
import { ServiceCategory } from '../../../../../models/responses/medical/service-category.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleInfo, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-medical-service',
  templateUrl: './create-medical-service.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule
  ],
})
export class CreateMedicalServiceComponent implements OnInit {
  @Output() serviceCreated = new EventEmitter<void>();

  formData: ServiceRequest = {
    serviceName: '',
    description: '',
    price: '',
    serviceCategoryId: '',
    status: true
  };

  categories: ServiceCategory[] = [];
  faCircleInfo = faCircleInfo;
  faPlus = faPlus;
  faXmark = faXmark;

  constructor(
    private serviceService: ServiceService,
    private serviceCategoryService: ServiceCategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.serviceCategoryService.search('', 1, 1000).subscribe({
      next: (res) => {
        this.categories = res.data;
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.toastr.error('Không thể tải danh sách chuyên môn');
      }
    });
  }

  handleSubmit(): void {
    const requiredFields: (keyof ServiceRequest)[] = [
      'serviceName',
      'description',
      'price',
      'serviceCategoryId'
    ];

    for (const field of requiredFields) {
      if (!this.formData[field]) {
        this.toastr.error('Vui lòng nhập đầy đủ thông tin!', 'Thông báo');
        return;
      }
    }

    this.serviceService.create(this.formData).subscribe({
      next: () => {
        this.toastr.success('Thêm dịch vụ thành công!');
        this.serviceCreated.emit();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Đã xảy ra lỗi. Vui lòng thử lại!');
      },
    });
  }

  goBack(): void {
    this.serviceCreated.emit();
  }
} 