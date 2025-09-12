import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorLeave } from '../../../../../../shared/services/doctor/doctor-leave.service';
import { ToastrService } from 'ngx-toastr';

function autoFormatDateInput(value: string): string {
  value = value.replace(/[^\d]/g, '');
  if (value.length > 8) value = value.substring(0, 8);
  if (value.length >= 2) value = value.substring(0, 2) + '/' + value.substring(2);
  if (value.length >= 5) value = value.substring(0, 5) + '/' + value.substring(5);
  return value;
}

function isValidDateString(date: string): boolean {
  return /^\d{2}\/\d{2}\/\d{4}$/.test(date);
}

function toISODate(date: string): string | null {
  if (!isValidDateString(date)) return null;
  const [day, month, year] = date.split('/').map(Number);
  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) return null;
  // Thêm 12h để tránh lệch múi giờ
  return new Date(year, month - 1, day, 12, 0, 0).toISOString();
}

@Component({
  selector: 'app-create-doctor-leave',
  templateUrl: './create-doctor-leave.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CreateDoctorLeaveComponent {
  @Input() doctorId: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  displayLeaveStartDate = '';
  displayLeaveEndDate = '';
  leaveStartDateISO: string = '';
  leaveEndDateISO: string = '';
  reason: string = '';
  error: string = '';
  isLoading: boolean = false;

  constructor(
    private doctorLeaveService: DoctorLeave,
    private toastr: ToastrService
  ) {}

  onDateInput(type: 'start' | 'end', event: any): void {
    let value = event.target.value;
    value = autoFormatDateInput(value);
    if (type === 'start') {
      this.displayLeaveStartDate = value;
      if (value.length === 10 && isValidDateString(value)) {
        const iso = toISODate(value);
        if (iso) this.leaveStartDateISO = iso;
        else this.leaveStartDateISO = '';
      } else {
        this.leaveStartDateISO = '';
      }
    } else {
      this.displayLeaveEndDate = value;
      if (value.length === 10 && isValidDateString(value)) {
        const iso = toISODate(value);
        if (iso) this.leaveEndDateISO = iso;
        else this.leaveEndDateISO = '';
      } else {
        this.leaveEndDateISO = '';
      }
    }
  }

  onDateBlur(type: 'start' | 'end'): void {
    if (type === 'start' && this.displayLeaveStartDate && this.displayLeaveStartDate.length < 10) {
      this.error = 'Vui lòng nhập đầy đủ ngày bắt đầu (dd/MM/yyyy)';
    } else if (type === 'end' && this.displayLeaveEndDate && this.displayLeaveEndDate.length < 10) {
      this.error = 'Vui lòng nhập đầy đủ ngày kết thúc (dd/MM/yyyy)';
    } else {
      this.error = '';
    }
  }

  onSubmit(): void {
    this.error = '';
    if (!this.displayLeaveStartDate || !this.displayLeaveEndDate || !this.reason) {
      this.error = 'Vui lòng nhập đầy đủ thông tin.';
      return;
    }
    if (!isValidDateString(this.displayLeaveStartDate) || !isValidDateString(this.displayLeaveEndDate)) {
      this.error = 'Ngày phải có định dạng dd/MM/yyyy';
      return;
    }
    const startISO = toISODate(this.displayLeaveStartDate);
    const endISO = toISODate(this.displayLeaveEndDate);
    if (!startISO || !endISO) {
      this.error = 'Ngày không hợp lệ.';
      return;
    }
    if (new Date(startISO) > new Date(endISO)) {
      this.error = 'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc';
      return;
    }
    if (!this.doctorId) {
      this.error = 'Không xác định được bác sĩ.';
      return;
    }
    this.isLoading = true;
    this.doctorLeaveService.createDoctorLeave({
      doctorId: this.doctorId,
      leaveStartDate: startISO,
      leaveEndDate: endISO,
      reason: this.reason.trim()
    }).subscribe({
      next: () => {
        this.toastr.success('Thêm ngày nghỉ thành công!');
        this.isLoading = false;
        this.created.emit();
        this.close.emit();
      },
      error: (err) => {
        this.error = err.error?.message || 'Đã xảy ra lỗi. Vui lòng thử lại!';
        this.toastr.error(this.error);
        this.isLoading = false;
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }
}
