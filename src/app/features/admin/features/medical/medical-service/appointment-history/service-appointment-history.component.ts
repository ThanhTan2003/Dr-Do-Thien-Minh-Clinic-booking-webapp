import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClockRotateLeft, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-service-appointment-history',
  templateUrl: './service-appointment-history.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ]
})
export class ServiceAppointmentHistoryComponent {
  faClockRotateLeft = faClockRotateLeft;
  faCircleInfo = faCircleInfo;
} 