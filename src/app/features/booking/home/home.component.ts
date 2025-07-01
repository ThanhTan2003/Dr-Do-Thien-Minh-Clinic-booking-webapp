import { Component } from '@angular/core';
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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FontAwesomeModule]
})
export class HomeComponent {
  // FontAwesome icons
  faUserMd = faUserMd;
  faStethoscope = faStethoscope;
  faFileMedical = faFileMedical;
  faCalendarCheck = faCalendarCheck;
  faPhone = faPhone;
  faMapMarkerAlt = faMapMarkerAlt;

  constructor(private router: Router) {}

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
