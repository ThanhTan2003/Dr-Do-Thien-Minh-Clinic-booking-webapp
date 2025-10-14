import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClinicService } from '../../../../../shared/services/appointment/clinic.service';
import { Clinic } from '../../../../../models/responses/appointment/clinic.model';
import { ClinicRequest } from '../../../../../models/requests/appointment/clinic.request';
import { AdminModalConfirmComponent } from '../../../../shared/components/modal-confirm/admin-modal-confirm.component';

@Component({
  selector: 'app-clinic-detail',
  templateUrl: './clinic-detail.component.html',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule, AdminModalConfirmComponent]
})
export class ClinicDetailComponent implements OnInit {
  faPen = faPen;

  clinic: Clinic | null = null;
  loading = false;
  clinicRequest: ClinicRequest = {
    clinicName: '',
    address: '',
    description: '',
    supportPhone: '',
    allowBookingByDoctor: false,
    allowBookingByService: false,
    sendNotificationToDoctorOnBooking: false,
    sendNotificationToZaloOAAdminOnBooking: false,
    sendNotificationToPatientOnBooking: false,
    sendNotificationOnConfirmed: false,
    sendReminderBefore1Day: false,
    sendThanksAfterVisit: false
  };

  showConfirmUpdate = false;

  constructor(
    private clinicService: ClinicService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadClinic();
  }

  loadClinic(): void {
    this.loading = true;
    this.clinicService.getClinicInfo().subscribe({
      next: (res: Clinic) => {
        this.clinic = res;
        this.clinicRequest = {
          clinicName: res.clinicName,
          address: res.address,
          description: res.description,
          supportPhone: res.supportPhone,
          allowBookingByDoctor: res.allowBookingByDoctor || false,
          allowBookingByService: res.allowBookingByService || false,
          sendNotificationToDoctorOnBooking: res.sendNotificationToDoctorOnBooking || false,
          sendNotificationToZaloOAAdminOnBooking: res.sendNotificationToZaloOAAdminOnBooking || false,
          sendNotificationToPatientOnBooking: res.sendNotificationToPatientOnBooking || false,
          sendNotificationOnConfirmed: res.sendNotificationOnConfirmed || false,
          sendReminderBefore1Day: res.sendReminderBefore1Day || false,
          sendThanksAfterVisit: res.sendThanksAfterVisit || false
        };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Không thể tải thông tin phòng khám', 'Lỗi');
      }
    });
  }

  openConfirmUpdate(): void {
    this.showConfirmUpdate = true;
  }

  onConfirmUpdate(): void {
    this.showConfirmUpdate = false;
    this.clinicService.createOrUpdateClinic(this.clinicRequest).subscribe({
      next: () => {
        this.toastr.success('Cập nhật thông tin phòng khám thành công', 'Thông báo');
        this.loadClinic();
      },
      error: (error) => {
        if (error.status === 500 && error.error?.message) {
          this.toastr.error(error.error.message, 'Lỗi');
        } else {
          this.toastr.error('Không thể cập nhật thông tin phòng khám', 'Lỗi');
        }
      }
    });
  }

  onCancelUpdate(): void {
    this.showConfirmUpdate = false;
  }
} 