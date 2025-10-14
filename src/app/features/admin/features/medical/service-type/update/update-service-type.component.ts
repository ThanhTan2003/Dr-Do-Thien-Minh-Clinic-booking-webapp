import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceCategoryService } from '../../../../../shared/services/medical/service-category.service';
import { FileService } from '../../../../../shared/services/file/file.service';
import { ServiceCategory } from '../../../../../models/responses/medical/service-category.model';
import { ServiceCategoryRequest } from '../../../../../models/requests/medical/service-category.request';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleInfo, faPenToSquare, faXmark, faCamera, faTrash } from '@fortawesome/free-solid-svg-icons';
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
  @Output() close = new EventEmitter<boolean>();

  formData: ServiceCategoryRequest = {
    categoryName: '',
    description: ''
  };

  faCircleInfo = faCircleInfo;
  faPenToSquare = faPenToSquare;
  faXmark = faXmark;
  faCamera = faCamera;
  faTrash = faTrash;
  
  showConfirmModal: boolean = false;
  selectedFile: File | null = null;
  previewImage: string | null = null;
  isUploadingImage: boolean = false;
  
  private readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  private readonly DEFAULT_IMAGE = '/images/DefaultMedical.png';

  constructor(
    private serviceCategoryService: ServiceCategoryService,
    private fileService: FileService,
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
    this.previewImage = this.getServiceCategoryImage(this.category);
  }

  getServiceCategoryImage(serviceCategory: ServiceCategory): string {
    return serviceCategory.image || this.DEFAULT_IMAGE;
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];

    if (!this.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      this.toastr.error('Chỉ hỗ trợ các định dạng: JPEG, JPG, PNG, GIF, WebP', 'Lỗi định dạng');
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewImage = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.selectedFile = null;
    this.previewImage = this.getServiceCategoryImage(this.category);
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    fileInput?.click();
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
    this.isUploadingImage = true;

    this.serviceCategoryService.updateById(this.category.id, this.formData).subscribe({
      next: () => {
        if (this.selectedFile) {
          this.uploadImage();
        } else {
          this.completeUpdate();
        }
        this.close.emit(true);
        this.toastr.success('Cập nhật thông tin thành công!');
      },
      error: (err) => {
        this.isUploadingImage = false;
        this.close.emit(false);
        this.toastr.error(err.error?.message || 'Đã xảy ra lỗi. Vui lòng thử lại!');
      },
    });
  }

  private uploadImage(): void {
    if (!this.selectedFile) {
      this.completeUpdate();
      return;
    }

    this.fileService.uploadServiceCategoryImage(this.category.id, this.selectedFile).subscribe({
      next: () => {
        this.completeUpdate();
      },
      error: (err) => {
        // this.toastr.warning('Cập nhật thông tin thành công nhưng hình ảnh tải lên thất bại!');
        this.completeUpdate();
      },
    });
  }

  private completeUpdate(): void {
    this.isUploadingImage = false;
    this.showConfirmModal = false;
    this.selectedFile = null;
    this.close.emit(true);
  }

  closeModal(): void {
    // this.serviceTypeUpdated.emit();
    this.close.emit(false);
  }
}