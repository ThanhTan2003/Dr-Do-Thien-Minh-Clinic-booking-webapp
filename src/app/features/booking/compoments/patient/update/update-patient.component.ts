import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientService } from '../../../../shared/services/patient/patient.service';
import { PatientUpdateByCustomerRequest } from '../../../../models/requests/patient/patient-update-by-customer.request';
import { Patient } from '../../../../models/responses/patient/patient.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faCircleInfo, faSave, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ModalSuccessComponent } from '../../../../shared/components/modal-success.component';


@Component({
  selector: 'app-update-patient',
  templateUrl: './update-patient.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    ModalSuccessComponent,
  ],
})
export class UpdatePatientComponent implements OnInit {
  patientId: string = '';
  patient: Patient | null = null;
  
  formData: PatientUpdateByCustomerRequest = {
    phoneNumber: '',
    identityCard: '',
    insuranceId: '',
    relationship: '',
    address: ''
  };

  // Biến để kiểm tra xem có thể edit identityCard và insuranceId không
  canEditIdentityCard = false;
  canEditInsuranceId = false;
  
  relationships: string[] = [];
  loading = false;
  isModalOpen = false;
  modalContent = { title: '', content: '' };

  faArrowLeft = faArrowLeft;
  faCircleInfo = faCircleInfo;
  faSave = faSave;
  faCheck = faCheck;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.patientId = this.route.snapshot.params['patientId'];
    this.loadPatientData();
    this.loadRelationships();
  }

  loadPatientData(): void {
    if (!this.patientId) {
      this.toastr.error('Không tìm thấy thông tin bệnh nhân');
      this.goBack();
      return;
    }

    this.loading = true;
    this.patientService.getByIdByCustomer(this.patientId).subscribe({
      next: (patient) => {
        this.patient = patient;
        
        // Kiểm tra xem có thể edit identityCard và insuranceId không
        this.canEditIdentityCard = !patient.identityCard || patient.identityCard.trim() === '';
        this.canEditInsuranceId = !patient.insuranceId || patient.insuranceId.trim() === '';
        
        // Populate form data
        this.formData = {
          phoneNumber: patient.phoneNumber || '',
          identityCard: patient.identityCard || '',
          insuranceId: patient.insuranceId || '',
          relationship: patient.relationship || '',
          address: patient.address || ''
        };
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading patient:', err);
        this.toastr.error('Không thể tải thông tin bệnh nhân');
        this.loading = false;
        this.goBack();
      }
    });
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

  handleSubmit(): void {
    const requiredFields: (keyof PatientUpdateByCustomerRequest)[] = [
      'phoneNumber',
      'relationship'
    ];

    for (const field of requiredFields) {
      if (!this.formData[field]) {
        this.toastr.error('Vui lòng nhập đầy đủ thông tin bắt buộc!', 'Thông báo');
        return;
      }
    }

    this.loading = true;
    this.patientService.updateByIdByCustomer(this.patientId, this.formData).subscribe({
      next: () => {
        this.openModal();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Đã xảy ra lỗi. Vui lòng thử lại!');
        this.loading = false;
      },
    });
  }

  openModal(): void {
    this.modalContent = {
      title: 'THÔNG BÁO',
      content: 'Thông tin hồ sơ đã được cập nhật thành công!',
    };
    this.isModalOpen = true;
  }

  handleModalClose(): void {
    this.isModalOpen = false;
    this.goBack();
  }

  goBack(): void {
    this.location.back();
  }
} 