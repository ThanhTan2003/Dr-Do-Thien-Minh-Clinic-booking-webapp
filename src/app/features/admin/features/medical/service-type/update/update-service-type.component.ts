import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceCategoryService } from '../../../../../shared/services/medical/service-category.service';
import { ServiceCategory } from '../../../../../models/responses/medical/service-category.model';
import { ServiceCategoryRequest } from '../../../../../models/requests/medical/service-category.request';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleInfo, faPenToSquare, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { AdminModalConfirmComponent } from '../../../../shared/components/modal-confirm/admin-modal-confirm.component';

@Component({
  selector: 'app-update-service-type',
  templateUrl: './update-service-type.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    AdminModalConfirmComponent
  ],
})
export class UpdateServiceTypeComponent implements OnInit {
  @Input() category!: ServiceCategory;
  @Output() serviceTypeUpdated = new EventEmitter<void>();

  formData: ServiceCategoryRequest = {
    categoryName: '',
    description: ''
  };

  faCircleInfo = faCircleInfo;
  faPenToSquare = faPenToSquare;
  faXmark = faXmark;
  showConfirmModal: boolean = false;

  constructor(
    private serviceCategoryService: ServiceCategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCategoryData();
  }

  loadCategoryData(): void {
    this.formData = {
      categoryName: this.category.categoryName,
      description: this.category.description
    };
  }

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

    this.showConfirmModal = true;
  }

  onConfirmUpdate(): void {
    this.serviceCategoryService.updateById(this.category.id, this.formData).subscribe({
      next: () => {
        this.toastr.success('Cập nhật chuyên môn thành công!');
        this.showConfirmModal = false;
        this.serviceTypeUpdated.emit();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Đã xảy ra lỗi. Vui lòng thử lại!');
      },
    });
  }

  goBack(): void {
    this.serviceTypeUpdated.emit();
  }
} 