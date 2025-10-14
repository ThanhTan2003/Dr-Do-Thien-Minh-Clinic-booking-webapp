import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { Doctor } from '../../../../../models/responses/doctor/doctor.model';
import { takeUntil } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DoctorService } from '../../../../../shared/services/doctor/doctor.service';
import { FileService } from '../../../../../shared/services/file/file.service';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { DoctorStatus } from '../../../../../models/responses/doctor/doctor-status.model';
import { DoctorRequest } from '../../../../../models/requests/doctor/doctor.request';
import { ToastrService } from 'ngx-toastr';
import { AdminModalConfirmComponent } from '../../../../shared/components/modal-confirm/admin-modal-confirm.component';
import { AdminModalConfirmDeleteComponent } from '../../../../shared/components/modal-confirm-delete/admin-modal-confirm-delete.component';
import { AdminModalSuccessComponent } from '../../../../shared/components/modal-success/admin-modal-success.component';
import { EditImageComponent } from './edit-image/edit-image.component';
import { 
  faX, faPen, faUserNurse, faPenToSquare, faCamera, faUpload
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-doctor-info',
  templateUrl: './edit-doctor-info.component.html',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    FontAwesomeModule, 
    RouterOutlet,
    AdminModalConfirmComponent,
    AdminModalConfirmDeleteComponent,
    AdminModalSuccessComponent,
    EditImageComponent
  ],
})
export class EditDoctorInfoComponent implements OnInit, OnDestroy {
  doctorId: string | null = null;
  doctor: Doctor | null = null;
  doctorStatuses: DoctorStatus[] = [];
  genders: string[] = ['Nam', 'Nữ'];
  showConfirmModal: boolean = false;
  showConfirmModalDelete: boolean = false;
  showEditImageModal: boolean = false;
  modalTitle: string = '';
  modalContent: string = '';
  modalTitleDelete: string = '';
  modalContentDelete: string = '';
  private destroy$ = new Subject<void>();
  private croppedImageBlob: Blob | null = null;

  faX = faX;
  faPen = faPen;
  faUserNurse = faUserNurse;
  faPenToSquare = faPenToSquare;
  faCamera = faCamera;
  faUpload = faUpload;
  
  constructor(
    private doctorService: DoctorService,
    private fileService: FileService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadDoctorStatuses();
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.doctorId = params.get('doctorId');
      if (this.doctorId) {
        this.fetchDoctor();
      }
    });
  }

  loadDoctorStatuses(): void {
    this.doctorService.getAllDoctorStatuses().subscribe({
      next: (statuses: DoctorStatus[]) => {
        this.doctorStatuses = statuses;
      },
      error: (error: any) => {
        this.toastr.error('Không thể tải danh sách trạng thái', 'Lỗi');
        console.error('Error loading doctor statuses:', error);
      }
    });
  }

  fetchDoctor(): void {
    if (!this.doctorId) return;
    
    this.doctorService.getById(this.doctorId).subscribe({
      next: (doctor) => {
        this.doctor = doctor;
      },
      error: (error) => {
        this.toastr.error('Không thể tải thông tin bác sĩ', 'Lỗi');
        console.error('Error loading doctor:', error);
      }
    });
  }

  getDoctorImage(doctor: Doctor): string {
    return (
      doctor.image ||
      (doctor.gender === 'Nam'
        ? '/images/default-male-doctor.jpg'
        : '/images/default-female-doctor.jpg')
    );
  }

  onEditImage(): void {
    if (!this.doctor) return;
    this.showEditImageModal = true;
  }

  onImageCropped(blob: Blob): void {
    this.croppedImageBlob = blob;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (this.doctor) {
        this.doctor.image = e.target?.result as string;
      }
    };
    reader.readAsDataURL(blob);
    this.showEditImageModal = false;
    this.toastr.info('Ảnh đã được chọn. Nhấn "Cập nhật thông tin" để lưu.');
  }

  onImageEditClosed(): void {
    this.showEditImageModal = false;
  }

  onUpdate(): void {
    this.modalTitle = 'Xác nhận cập nhật';
    this.modalContent = 'Bạn có chắc chắn muốn cập nhật thông tin bác sĩ?';
    this.showConfirmModal = true;
  }

  onConfirmUpdate(): void {
    // THAY ĐỔI 1: Đóng modal ngay lập tức
    this.showConfirmModal = false;
    
    if (!this.doctor) return;
    
    // THAY ĐỔI 2: Hiển thị thông báo đang xử lý
    // this.toastr.info('Đang cập nhật thông tin...', 'Vui lòng đợi');
    
    const request: DoctorRequest = {
      zaloUid: this.doctor.zaloUid,
      name: this.doctor.name,
      status: this.doctor.status,
      description: this.doctor.description,
      gender: this.doctor.gender,
      phone: this.doctor.phone,
      image: this.doctor.image
    };

    this.doctorService.update(this.doctor.id, request).subscribe({
      next: () => {
        this.toastr.success('Cập nhật thông tin bác sĩ thành công', 'Thông báo');
        if (this.croppedImageBlob) {
          this.uploadImage();
        } else {
          this.completeUpdate();
        }
      },
      error: (error: any) => {
        console.error('Error updating doctor:', error);
        // THAY ĐỔI 3: Không cần đóng modal vì đã đóng từ trước
        this.toastr.error('Không thể cập nhật thông tin bác sĩ', 'Lỗi');
      }
    });
  }

  private uploadImage(): void {
    if (!this.doctor || !this.croppedImageBlob) {
      this.completeUpdate();
      return;
    }

    const file = new File([this.croppedImageBlob], `doctor-${this.doctor.id}.jpg`, { type: 'image/jpeg' });

    this.fileService.uploadDoctorImage(this.doctor.id, file).subscribe({
      next: () => {
        this.toastr.success('Cập nhật ảnh thành công!');
        this.completeUpdate();
      },
      error: (err) => {
        this.toastr.warning('Cập nhật thông tin thành công nhưng ảnh tải lên thất bại!');
        this.completeUpdate();
      },
    });
  }

  private completeUpdate(): void {
    // THAY ĐỔI 4: Không cần đóng modal nữa vì đã đóng từ đầu
    this.croppedImageBlob = null;
    this.fetchDoctor();
  }

  onCancelUpdate(): void {
    this.showConfirmModal = false;
  }

  onDelete(): void {
    this.modalTitleDelete = 'Xác nhận xóa';
    this.modalContentDelete = 'Bạn có chắc chắn muốn xóa thông tin bác sĩ này không?';
    this.showConfirmModalDelete = true;
  }

  onConfirmDelete(): void {
    // THAY ĐỔI 5: Đóng modal xóa ngay lập tức
    this.showConfirmModalDelete = false;
    
    if (!this.doctor) return;

    // THAY ĐỔI 6: Hiển thị thông báo đang xử lý
    // this.toastr.info('Đang xóa thông tin...', 'Vui lòng đợi');

    this.doctorService.delete(this.doctor.id).subscribe({
      next: () => {
        // THAY ĐỔI 7: Không cần đóng modal vì đã đóng từ trước
        this.toastr.success('Đã xóa thông tin bác sĩ thành công', 'Thông báo');
        this.router.navigate(['/admin/doctor']);
      },
      error: (err) => {
        // THAY ĐỔI 8: Không cần đóng modal vì đã đóng từ trước
        this.toastr.error(err.error?.message || 'Đã xảy ra lỗi. Vui lòng thử lại!');
        console.error('Error deleting doctor:', err);
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