import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleInfo, faUserPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { PatientService } from '../../../../../../../shared/services/patient/patient.service';
import { PatientRequest } from '../../../../../../../models/requests/patient/patient.request';
import { ToastrService } from 'ngx-toastr';
import { AdminModalConfirmComponent } from '../../../../../../shared/components/modal-confirm/admin-modal-confirm.component';

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    AdminModalConfirmComponent
  ]
})
export class CreatePatientComponent implements OnInit {
  @Input() userId: string = '';
  @Output() patientCreated = new EventEmitter<void>();

  formData: PatientRequest = {
    fullName: '',
    gender: 'Nam',
    phoneNumber: '',
    dateOfBirth: '',
    identityCard: '',
    address: '',
    insuranceId: '',
    relationship: ''
  };

  relationships: string[] = [];
  showConfirmModal: boolean = false;

  faCircleInfo = faCircleInfo;
  faUserPlus = faUserPlus;
  faXmark = faXmark;

  constructor(
    private patientService: PatientService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadRelationships();
  }

  loadRelationships(): void {
    this.patientService.getRelationships().subscribe({
      next: (relationships: string[]) => {
        this.relationships = relationships;
      },
      error: (error) => {
        console.error('Error loading relationships:', error);
      }
    });
  }

  handleSubmit(): void {
    const requiredFields: (keyof PatientRequest)[] = [
      'fullName',
      'gender',
      'phoneNumber',
      'dateOfBirth',
      'relationship'
    ];

    for (const field of requiredFields) {
      if (!this.formData[field]) {
        this.toastr.error('Vui lòng nhập đầy đủ thông tin!', 'Thông báo');
        return;
      }
    }

    this.showConfirmModal = true;
  }

  onConfirm(): void {
    this.patientService.createByZaloUid(this.userId, this.formData).subscribe({
      next: () => {
        this.toastr.success('Thêm hồ sơ khám bệnh thành công!');
        this.patientCreated.emit();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Đã xảy ra lỗi. Vui lòng thử lại!');
      }
    });
  }

  onCancel(): void {
    this.showConfirmModal = false;
  }

  goBack(): void {
    this.patientCreated.emit();
  }
} 