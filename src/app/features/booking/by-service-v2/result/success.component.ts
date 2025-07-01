import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheckCircle, faFileMedical, faHome } from '@fortawesome/free-solid-svg-icons';
import { formatDate, formatPhone, formatInsuranceId, formatNationalId } from '../../../shared/util/format.util';
import { getStatusClassForBadge, getStatusClassForList } from '../../../shared/util/status.util';

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [CommonModule, DatePipe, FontAwesomeModule],
  templateUrl: './success.component.html'
})
export class BookingSuccessComponent {
  @Input() appointment: any;

  faCheckCircle = faCheckCircle;
  faFileMedical = faFileMedical;
  faHome = faHome;

  constructor(private router: Router) {}

  goToHome(): void {
    this.router.navigate(['/booking']);
  }

  goToPatientProfile(): void {
    this.router.navigate(['/booking/patient-profile']);
  }

  // Utility functions
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

  getStatusClassForBadge(status: string): string {
    return getStatusClassForBadge(status);
  }

  getStatusClassForList(status: string): string {
    return getStatusClassForList(status);
  }
}
