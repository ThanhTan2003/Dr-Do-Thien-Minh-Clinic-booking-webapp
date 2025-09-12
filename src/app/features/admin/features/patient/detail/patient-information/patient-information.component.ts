import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../../../shared/services/patient/patient.service';
import { Patient } from '../../../../../models/responses/patient/patient.model';
import { PatientRequest } from '../../../../../models/requests/patient/patient.request';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faIdCard, faPen, faX } from '@fortawesome/free-solid-svg-icons';
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe';
import { FormatPhonePipe } from '../../../../../shared/pipes/format-phone.pipe';
import { ToastrService } from 'ngx-toastr';
import { AdminModalConfirmComponent } from '../../../../shared/components/modal-confirm/admin-modal-confirm.component';
import { AdminModalConfirmDeleteComponent } from '../../../../shared/components/modal-confirm-delete/admin-modal-confirm-delete.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-information',
  templateUrl: './patient-information.component.html',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormatDatePipe, FormatPhonePipe, AdminModalConfirmComponent, AdminModalConfirmDeleteComponent, FormsModule]
})
export class PatientInformationComponent implements OnInit {
  faIdCard = faIdCard;
  faPen= faPen;
  faX = faX;

  patientId: string = '';
  patient: Patient | null = null;
  loading = false;
  relationships: string[] = [];
  patientRequest: PatientRequest = {
    fullName: '',
    gender: '',
    phoneNumber: '',
    dateOfBirth: '',
    identityCard: '',
    address: '',
    insuranceId: '',
    relationship: ''
  };

  showConfirmUpdate = false;
  showConfirmDelete = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('patientId') || '';
    if (this.patientId) {
      this.loadPatient();
      this.loadRelationships();
    }
  }

  loadPatient(): void {
    this.loading = true;
    this.patientService.getById(this.patientId).subscribe({
      next: (res: Patient) => {
        this.patient = res;
        this.patientRequest = {
          fullName: res.fullName,
          gender: res.gender,
          phoneNumber: res.phoneNumber,
          dateOfBirth: res.dateOfBirth,
          identityCard: res.identityCard,
          address: res.address,
          insuranceId: res.insuranceId,
          relationship: res.relationship
        };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadRelationships(): void {
    this.patientService.getRelationships().subscribe({
      next: (res: string[]) => {
        this.relationships = res;
      },
      error: () => {
        this.relationships = [];
      }
    });
  }

  openConfirmUpdate(): void {
    this.showConfirmUpdate = true;
  }

  onConfirmUpdate(): void {
    this.showConfirmUpdate = false;
    if (!this.patientId) return;
    this.patientService.update(this.patientId, this.patientRequest).subscribe({
      next: () => {
        this.toastr.success('Cập nhật hồ sơ thành công', 'Thông báo');
        this.loadPatient();
      },
      error: (error) => {
        if (error.status === 500 && error.error?.message) {
          this.toastr.error(error.error.message, 'Lỗi');
        } else {
          this.toastr.error('Không thể cập nhật hồ sơ', 'Lỗi');
        }
      }
    });
  }

  openConfirmDelete(): void {
    this.showConfirmDelete = true;
  }

  onConfirmDelete(): void {
    this.showConfirmDelete = false;
    if (!this.patientId) return;
    this.patientService.delete(this.patientId).subscribe({
      next: () => {
        this.toastr.success('Xóa hồ sơ thành công', 'Thông báo');
        this.router.navigate(['/admin/benh-nhan/danh-sach']);
      },
      error: (error) => {
        if (error.status === 500 && error.error?.message) {
          this.toastr.error(error.error.message, 'Lỗi');
        } else {
          this.toastr.error('Không thể xóa hồ sơ', 'Lỗi');
        }
      }
    });
  }

  onCancelUpdate(): void {
    this.showConfirmUpdate = false;
  }

  onCancelDelete(): void {
    this.showConfirmDelete = false;
  }
} 