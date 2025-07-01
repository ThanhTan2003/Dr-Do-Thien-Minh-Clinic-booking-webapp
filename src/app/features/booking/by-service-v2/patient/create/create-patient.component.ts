import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router} from '@angular/router';
import { PatientService } from '../../../../shared/services/patient/patient.service';
import { PatientRequest } from '../../../../models/requests/patient/patient.request';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faCircleInfo, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ModalSuccessComponent } from '../../../../shared/components/modal-success.component';
import { validateBirthDate, convertToDateInputFormat } from '../../../../shared/util/date.util';


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
    relationship: ''
  };

  // Biến để hiển thị ngày sinh theo định dạng dd/MM/yyyy
  displayDateOfBirth = '';
  dateError = '';
  
  relationships: string[] = [];
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
    this.loadRelationships();
  }

  loadRelationships(): void {
    this.patientService.getRelationships().subscribe({
      next: (relationships) => {
        this.relationships = relationships;
      },
      error: (err) => {
        console.error('Error loading relationships:', err);
        // Fallback to default relationships if API fails
        this.relationships = ['Bản thân', 'Con', 'Vợ/Chồng', 'Cha/Mẹ', 'Anh/Chị/Em', 'Khác'];
      }
    });
  }

  // Xử lý input ngày sinh
  onDateInput(event: any): void {
    let value = event.target.value;
    this.dateError = '';

    // Loại bỏ tất cả ký tự không phải số
    value = value.replace(/[^\d]/g, '');

    // Giới hạn độ dài tối đa 8 ký tự (ddMMyyyy)
    if (value.length > 8) {
      value = value.substring(0, 8);
    }

    // Thêm dấu / tự động
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    if (value.length >= 5) {
      value = value.substring(0, 5) + '/' + value.substring(5);
    }

    this.displayDateOfBirth = value;

    // Kiểm tra tính hợp lệ khi đủ 10 ký tự (dd/MM/yyyy)
    if (value.length === 10) {
      const validation = validateBirthDate(value);
      if (!validation.isValid) {
        this.dateError = validation.errorMessage;
      } else {
        // Chuyển đổi sang định dạng yyyy-MM-dd cho formData
        this.formData.dateOfBirth = convertToDateInputFormat(value);
      }
    } else {
      this.formData.dateOfBirth = '';
    }
  }

  // Xử lý khi blur khỏi input ngày sinh
  onDateBlur(): void {
    if (this.displayDateOfBirth && this.displayDateOfBirth.length < 10) {
      this.dateError = 'Vui lòng nhập đầy đủ ngày sinh (dd/MM/yyyy)';
    }
  }

  handleSubmit(): void {
    const requiredFields: (keyof PatientRequest)[] = [
      'fullName',
      'gender',
      'phoneNumber',
      'dateOfBirth',
      'identityCard',
      'relationship'
    ];

    for (const field of requiredFields) {
      if (!this.formData[field]) {
        this.toastr.error('Vui lòng nhập đầy đủ thông tin!', 'Thông báo');
        return;
      }
    }

    // Kiểm tra lại ngày sinh
    if (this.displayDateOfBirth) {
      const validation = validateBirthDate(this.displayDateOfBirth);
      if (!validation.isValid) {
        this.toastr.error(validation.errorMessage, 'Lỗi ngày sinh');
        return;
      }
    }

    if (!this.acceptTerms) {
      this.toastr.error('Bạn cần chấp nhận điều khoản trước khi tạo hồ sơ mới.');
      return;
    }

    this.patientService.createByCustomer(this.formData).subscribe({
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