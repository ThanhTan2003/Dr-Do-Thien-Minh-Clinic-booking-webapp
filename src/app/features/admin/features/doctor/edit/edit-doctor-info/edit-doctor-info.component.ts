import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { Doctor } from '../../../../../models/responses/doctor/doctor.model';
import { takeUntil } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DoctorService } from '../../../../../shared/services/doctor/doctor.service';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { DoctorStatus } from '../../../../../models/responses/doctor/doctor-status.model';
import { DoctorRequest } from '../../../../../models/requests/doctor/doctor.request';
import { ToastrService } from 'ngx-toastr';
import { AdminModalConfirmComponent } from '../../../../shared/components/modal-confirm/admin-modal-confirm.component';
import { AdminModalSuccessComponent } from '../../../../shared/components/modal-success/admin-modal-success.component';
import { 
  faX, faPen, faUserNurse
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
    AdminModalSuccessComponent
  ],
})
export class EditDoctorInfoComponent implements OnInit, OnDestroy {
  doctorId: string | null = null;
  doctor: Doctor | null = null;
  doctorStatuses: DoctorStatus[] = [];
  genders: string[] = ['Nam', 'Nữ'];
  showConfirmModal = false;
  showSuccessModal = false;
  successMessage = '';
  modalTitle = '';
  modalContent = '';
  private destroy$ = new Subject<void>();

  faX = faX;
  faPen = faPen;
  faUserNurse = faUserNurse;

  constructor(
    private doctorService: DoctorService,
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

  onUpdate(): void {
    if (!this.doctor) return;

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
        this.modalTitle = 'Thông báo';
        this.successMessage = 'Cập nhật thông tin bác sĩ thành công';
        this.showSuccessModal = true;
      },
      error: (error) => {
        this.toastr.error('Không thể cập nhật thông tin bác sĩ', 'Lỗi');
        console.error('Error updating doctor:', error);
      }
    });
  }

  onDelete(): void {
    this.modalTitle = 'Xác nhận xóa';
    this.modalContent = 'Bạn có chắc chắn muốn xóa thông tin bác sĩ này không?';
    this.showConfirmModal = true;
  }

  onConfirmDelete(): void {
    if (!this.doctor) return;

    this.doctorService.delete(this.doctor.id).subscribe({
      next: () => {
        this.modalTitle = 'Thông báo';
        this.successMessage = 'Đã xóa thông tin bác sĩ thành công';
        this.showSuccessModal = true;
      },
      error: (error) => {
        this.toastr.error('Không thể xóa thông tin bác sĩ', 'Lỗi');
        console.error('Error deleting doctor:', error);
      }
    });
    this.showConfirmModal = false;
  }

  onCancelDelete(): void {
    this.showConfirmModal = false;
  }

  onSuccessModalClose(): void {
    this.showSuccessModal = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}