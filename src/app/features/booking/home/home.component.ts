import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faUserMd, 
  faStethoscope, 
  faFileMedical,
  faCalendarCheck,
  faPhone,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import { ClinicService } from '../../shared/services/appointment/clinic.service';
import { Clinic } from '../../models/responses/appointment/clinic.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FontAwesomeModule]
})
export class HomeComponent implements OnInit {
  // FontAwesome icons
  faUserMd = faUserMd;
  faStethoscope = faStethoscope;
  faFileMedical = faFileMedical;
  faCalendarCheck = faCalendarCheck;
  faPhone = faPhone;
  faMapMarkerAlt = faMapMarkerAlt;

  // Clinic information
  clinic: Clinic | null = null;
  loading = false;

  constructor(
    private router: Router,
    private clinicService: ClinicService
  ) {}

  ngOnInit(): void {
    this.loadClinicInfo();
  }

  loadClinicInfo(): void {
    this.loading = true;
    this.clinicService.getClinicInfo().subscribe({
      next: (res: Clinic) => {
        this.clinic = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        // Fallback values if API fails
        this.clinic = {
          id: '',
          clinicName: 'Chưa có thông tin',
          address: 'Chưa có thông tin',
          description: '',
          supportPhone: 'Chưa có thông tin'
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
}
