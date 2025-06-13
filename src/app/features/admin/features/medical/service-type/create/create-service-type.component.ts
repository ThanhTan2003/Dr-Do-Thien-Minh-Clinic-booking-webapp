import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceCategoryService } from '../../../../../shared/services/medical/service-category.service';
import { ServiceCategoryRequest } from '../../../../../models/requests/medical/service-category.request';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleInfo, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-service-type',
  templateUrl: './create-service-type.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule
  ],
})
export class CreateServiceTypeComponent implements OnInit {
  @Output() serviceTypeCreated = new EventEmitter<void>();

  formData: ServiceCategoryRequest = {
    categoryName: '',
    description: ''
  };

  faCircleInfo = faCircleInfo;
  faPlus = faPlus;
  faXmark = faXmark;

  constructor(
    private serviceCategoryService: ServiceCategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  handleSubmit(): void {
    const requiredFields: (keyof ServiceCategoryRequest)[] = [
      'categoryName',
      'description'
    ];

    for (const field of requiredFields) {
      if (!this.formData[field]) {
        this.toastr.error('Vui lòng nhập đầy đủ thông tin!', 'Thông báo');
        return;
      }
    }

    this.serviceCategoryService.create(this.formData).subscribe({
      next: () => {
        this.toastr.success('Thêm chuyên môn thành công!');
        this.serviceTypeCreated.emit();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Đã xảy ra lỗi. Vui lòng thử lại!');
      },
    });
  }

  goBack(): void {
    this.serviceTypeCreated.emit();
  }
} 