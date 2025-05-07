import { Component, Input } from '@angular/core';
import { CommonModule, NgIf, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheckCircle, faFileMedical } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [CommonModule, NgIf, DatePipe, FontAwesomeModule],
  templateUrl: './success.component.html'
})
export class BookingSuccessComponent {
  @Input() appointment: any;

  faCheckCircle = faCheckCircle;
  faFileMedical = faFileMedical;

  constructor(private router: Router) {}

  goToHistory(): void {
    // TODO: điều chỉnh path cho phù hợp với router của bạn
    this.router.navigate(['/user/appointment-history']);
  }
}
