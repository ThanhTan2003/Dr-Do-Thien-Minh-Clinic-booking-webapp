import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faUserMd, 
  faStethoscope, 
  faFileMedical,
  faCalendarCheck,
  faPhone,
  faMapMarkerAlt,
  faSignOutAlt,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import { ClinicService } from '../../shared/services/appointment/clinic.service';
import { Clinic } from '../../models/responses/appointment/clinic.model';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule]
})
export class HomeComponent implements OnInit {
  // FontAwesome icons
  faUserMd = faUserMd;
  faStethoscope = faStethoscope;
  faFileMedical = faFileMedical;
  faCalendarCheck = faCalendarCheck;
  faPhone = faPhone;
  faMapMarkerAlt = faMapMarkerAlt;
  faSignOutAlt = faSignOutAlt;
  faCalendarAlt = faCalendarAlt;

  // Clinic information
  clinic: Clinic | null = null;
  loading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private clinicService: ClinicService
  ) {}

  ngOnInit(): void {
    this.loadClinicInfo();
  }

  loadClinicInfo(): void {
    this.loading = true;
    this.clinicService.getClinicInfoPublicByCustomer().subscribe({
      next: (res: Clinic) => {
        this.clinic = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        // Fallback values if API fails
        this.clinic = {
          id: '',
          clinicName: 'Chưa có thông tin',
          address: 'Chưa có thông tin',
          description: '',
          supportPhone: 'Chưa có thông tin',
          allowBookingByDoctor: true,
          allowBookingByService: true
        };
      }
    });
  }

  goToByDoctor(): void {
    this.router.navigate(['/booking/by-doctor']);
  }

  goToByService(): void {
    this.router.navigate(['/booking/by-service']);
  }

  goToPatientProfile(): void {
    this.router.navigate(['/booking/patient-profile']);
  }

  goToAppointmentSchedule(): void {
    this.router.navigate(['/booking/appointment-schedule']);
  }

  logout(): void {
    // TODO: Implement logout logic
    this.authService.logout();
  }

  // Helper methods for template
  get hasDescription(): boolean {
    return this.clinic?.description != null && this.clinic.description.trim() !== '';
  }

  get canBookByDoctor(): boolean {
    return this.clinic?.allowBookingByDoctor === true;
  }

  get canBookByService(): boolean {
    return this.clinic?.allowBookingByService === true;
  }
}