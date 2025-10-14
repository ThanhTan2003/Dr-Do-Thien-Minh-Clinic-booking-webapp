import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faXmark, 
  faCheckCircle, 
  faInfoCircle,
  faStethoscope,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';

// Models
import { Patient } from '../../../../../../../models/responses/patient/patient.model';
import { Service } from '../../../../../../../models/responses/medical/service.model';
import { TimeFrame } from '../../../../../../../models/responses/appointment/time-frame.model';

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
  @Input() selectedService: Service | null = null;
  @Input() selectedDate: string = '';
  @Input() selectedTimeFrame: TimeFrame | null = null;
  @Output() confirm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  // Icons
  faXmark = faXmark;
  faCheckCircle = faCheckCircle;
  faInfoCircle = faInfoCircle;
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

