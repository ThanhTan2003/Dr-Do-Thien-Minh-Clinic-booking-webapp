import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { AppointmentService } from '../../../../shared/services/appointment/appointment.service';
import { Appointment } from '../../../../models/responses/appointment/appointment.model';

import {formatDate, formatPhone, formatInsuranceId, formatNationalId} from '../../../../shared/util/format.util'
import { getStatusClassForForm } from '../../../../shared/util/status.util';

@Component({
  selector: 'app-patient-appointment-detail',
  templateUrl: './patient-appointment-detail.component.html',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule]
})
export class PatientAppointmentDetailComponent implements OnInit {
  appointment: Appointment | null = null;
  appointmentId: string = '';
  faArrowLeft = faArrowLeft;
  loadingData: boolean = true;

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

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
  getStatusClass(status: string): string {
    return getStatusClassForForm(status);
  }

  ngOnInit() {
    this.appointmentId = this.route.snapshot.params['appointmentId'];
    this.loadingData = true;
    this.fetchAppointment();
  }

  fetchAppointment() {
    this.appointmentService.getByIdByCustomer(this.appointmentId).subscribe({
      next: (data: Appointment) => {
        this.appointment = data;
        this.loadingData = false;
      },
      error: (error: any) => {
        console.error('Error fetching data:', error);
        this.loadingData = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
} 