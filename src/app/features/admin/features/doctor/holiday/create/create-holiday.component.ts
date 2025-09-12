import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Holiday } from '../../../../../shared/services/doctor/holiday.service';
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
  selector: 'app-create-holiday',
  templateUrl: './create-holiday.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CreateHolidayComponent {
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<any>();

  displayStartDate = '';
  displayEndDate = '';
  startDateISO: string = '';
  endDateISO: string = '';
  holidayName: string = '';
  error: string = '';
  isLoading: boolean = false;

  constructor(
    private holidayService: Holiday,
    private toastr: ToastrService
  ) {}

  onDateInput(type: 'start' | 'end', event: any): void {
    let value = event.target.value;
    value = autoFormatDateInput(value);
    if (type === 'start') {
      this.displayStartDate = value;
      if (value.length === 10 && isValidDateString(value)) {
        const iso = toISODate(value);
        if (iso) this.startDateISO = iso;
        else this.startDateISO = '';
      } else {
        this.startDateISO = '';
      }
    } else {
      this.displayEndDate = value;
      if (value.length === 10 && isValidDateString(value)) {
        const iso = toISODate(value);
        if (iso) this.endDateISO = iso;
        else this.endDateISO = '';
      } else {
        this.endDateISO = '';
      }
    }
  }

  onDateBlur(type: 'start' | 'end'): void {
    if (type === 'start' && this.displayStartDate && this.displayStartDate.length < 10) {
      this.error = 'Vui lòng nhập đầy đủ ngày bắt đầu (dd/MM/yyyy)';
    } else if (type === 'end' && this.displayEndDate && this.displayEndDate.length < 10) {
      this.error = 'Vui lòng nhập đầy đủ ngày kết thúc (dd/MM/yyyy)';
    } else {
      this.error = '';
    }
  }

  onSubmit(): void {
    this.error = '';
    if (!this.displayStartDate || !this.displayEndDate || !this.holidayName) {
      this.error = 'Vui lòng nhập đầy đủ thông tin.';
      return;
    }
    if (!isValidDateString(this.displayStartDate) || !isValidDateString(this.displayEndDate)) {
      this.error = 'Ngày phải có định dạng dd/MM/yyyy';
      return;
    }
    const startISO = toISODate(this.displayStartDate);
    const endISO = toISODate(this.displayEndDate);
    if (!startISO || !endISO) {
      this.error = 'Ngày không hợp lệ.';
      return;
    }
    if (new Date(startISO) > new Date(endISO)) {
      this.error = 'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc';
      return;
    }

    const formData = {
      holidayName: this.holidayName.trim(),
      startDate: startISO,
      endDate: endISO
    };

    this.created.emit(formData);
  }

  onClose(): void {
    this.close.emit();
  }
}

