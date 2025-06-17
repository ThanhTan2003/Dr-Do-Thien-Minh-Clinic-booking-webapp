import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router} from '@angular/router';
import { PatientService } from '../../../shared/services/patient/patient.service';
import { PatientRequest } from '../../../models/requests/patient/patient.request';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faCircleInfo, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ModalSuccessComponent } from '../../../shared/components/modal-success.component';


@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    ModalSuccessComponent,
  ],
})
export class CreatePatientComponent implements OnInit {
  formData: PatientRequest = {
    fullName: '',
    gender: 'Nam',
    phoneNumber: '',
    dateOfBirth: '',
    identityCard: '',
    insuranceId: '',
    address: '',
    relationship: '' //Bo sung sau
  };

  acceptTerms = false;
  isModalOpen = false;
  modalContent = { title: '', content: '' };

  faArrowLeft = faArrowLeft;
  faCircleInfo = faCircleInfo;
  faPlus = faPlus;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private location: Location,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi component được mount
  }

  handleSubmit(): void {
    const requiredFields: (keyof PatientRequest)[] = [
      'fullName',
      'gender',
      'phoneNumber',
      'dateOfBirth',
      'identityCard',
      'address',
    ];

    for (const field of requiredFields) {
      if (!this.formData[field]) {
        this.toastr.error('Vui lòng nhập đầy đủ thông tin!', 'Thông báo');
        return;
      }
    }

    if (!this.acceptTerms) {
      this.toastr.error('Bạn cần chấp nhận điều khoản trước khi tạo hồ sơ mới.');
      return;
    }

    this.patientService.create(this.formData).subscribe({
      next: () => {
        this.openModal();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Đã xảy ra lỗi. Vui lòng thử lại!');
      },
    });
  }

  openModal(): void {
    this.modalContent = {
      title: 'THÔNG BÁO',
      content: 'Hồ sơ của bạn đã được tạo thành công! Bạn có thể đặt lịch khám ngay với hồ sơ này.',
    };
    this.isModalOpen = true;
  }

  handleModalClose(): void {
    this.isModalOpen = false;
    this.location.back();
  }

  goBack(): void {
    this.location.back();
  }
}