import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faInfoCircle, faIdCard, faCalendarCheck, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Appointment } from '../../../../../models/responses/appointment/appointment.model';
import { AppointmentService } from '../../../../../shared/services/appointment/appointment.service';
import { ExamResultRequest } from '../../../../../models/requests/appointment/exam-result.request';
import { AdminModalConfirmComponent } from '../../../../shared/components/modal-confirm/admin-modal-confirm.component';
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe';
import { FormatDateTimePipe } from '../../../../../shared/pipes/format-datetime.pipe';
import { FormatPhonePipe } from '../../../../../shared/pipes/format-phone.pipe';

// Import utility functions
import { getStatusClassForForm, getUpdatableStatuses } from '../../../../../shared/util/status.util';

@Component({
  selector: 'app-doctor-appointment-update',
  templateUrl: './doctor-appointment-update.component.html',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    FontAwesomeModule, 
    AdminModalConfirmComponent, 
    FormatDatePipe, 
    FormatDateTimePipe, 
    FormatPhonePipe
  ]
})
export class DoctorAppointmentUpdateComponent implements OnInit {
  @Input() appointmentId: string = '';
  @Input() role: string = '';
  @Output() close = new EventEmitter<boolean>(); // true nếu cập nhật thành công

  faXmark = faXmark;
  faInfoCircle = faInfoCircle;
  faIdCard = faIdCard;
  faCalendarCheck = faCalendarCheck;
  faPenToSquare = faPenToSquare;

  appointment: Appointment | null = null;
  loading: boolean = false;
  showConfirm: boolean = false;
  confirmLoading: boolean = false;
  error: string = '';

  // Form fields
  result: ExamResultRequest = {
    status: '',
    doctorMessage: '',
    note: '',
    reExaminationDate: ''
  };

  // Sử dụng utility function để lấy danh sách trạng thái có thể cập nhật
  statuses: string[] = getUpdatableStatuses();

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    if (this.appointmentId) {
      this.loadAppointment();
    }
  }

  loadAppointment(): void {
    this.loading = true;
    this.appointmentService.getById(this.appointmentId).subscribe({
      next: (response: Appointment) => {
        this.appointment = response;
        // Gán giá trị mặc định cho form nếu có
        this.result.status = response.status ? `${response.status}` : '';
        this.result.doctorMessage = response.doctorMessage ? `${response.doctorMessage}` : '';
        this.result.note = response.note ? `${response.note}` : '';
        this.result.reExaminationDate = response.reExaminationDate ? `${response.reExaminationDate}` : '';
        console.log(this.result);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Không thể tải thông tin lịch hẹn.';
        this.loading = false;
      }
    });
  }

  closeModal(): void {
    this.close.emit(false);
  }

  openConfirm(): void {
    this.showConfirm = true;
  }

  onConfirmUpdate(confirmed: boolean): void {
    this.showConfirm = false;
    if (confirmed) {
      this.updateExamResult();
    }
  }

  updateExamResult(): void {
    if (!this.appointmentId) return;
    this.confirmLoading = true;
    this.appointmentService.updateExamResult(this.appointmentId, this.result).subscribe({
      next: () => {
        this.confirmLoading = false;
        this.close.emit(true); // Đóng modal và báo thành công
      },
      error: (error) => {
        this.error = 'Cập nhật kết quả khám thất bại!';
        this.confirmLoading = false;
      }
    });
  }

  // Sử dụng utility function thay vì local mapping
  getStatusClass(status: string): string {
    return getStatusClassForForm(status);
  }
}
