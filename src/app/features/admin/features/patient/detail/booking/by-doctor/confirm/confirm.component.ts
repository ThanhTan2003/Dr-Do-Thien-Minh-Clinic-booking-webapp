import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faXmark, 
  faCheckCircle, 
  faInfoCircle,
  faUserMd,
  faStethoscope,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';

// Models
import { Patient } from '../../../../../../../models/responses/patient/patient.model';
import { Doctor } from '../../../../../../../models/responses/doctor/doctor.model';
import { DoctorService as DoctorServiceModel } from '../../../../../../../models/responses/doctor/doctor-service.model';
import { DoctorSchedule } from '../../../../../../../models/responses/doctor/doctor-schedule.model';

// Utils
import { formatDate, formatPhone, formatInsuranceId, formatNationalId } from '../../../../../../../shared/util/format.util';
import { getVietnameseDayName } from '../../../../../../../shared/util/date.util';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ]
})
export class ConfirmComponent {
  @Input() patient: Patient | null = null;
  @Input() selectedDoctor: Doctor | null = null;
  @Input() selectedDoctorService: DoctorServiceModel | null = null;
  @Input() selectedDate: string = '';
  @Input() selectedDoctorSchedule: DoctorSchedule | null = null;
  @Output() confirm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  // Icons
  faXmark = faXmark;
  faCheckCircle = faCheckCircle;
  faInfoCircle = faInfoCircle;
  faUserMd = faUserMd;
  faStethoscope = faStethoscope;
  faCalendarAlt = faCalendarAlt;

  getVietnameseDayName(value: string | Date): string {
    return getVietnameseDayName(new Date(value));
  }

  formatDate(value: string | Date): string {
    return formatDate(value);
  }

  formatPhone(value: string): string {
    return formatPhone(value);
  }

  formatInsuranceId(value: string): string {
    return formatInsuranceId(value);
  }

  formatNationalId(value: string): string {
    return formatNationalId(value);
  }

  onConfirm(): void {
    this.confirm.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}
