import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { AppointmentService } from '../../../../shared/services/appointment/appointment.service';
import { Appointment } from '../../../../models/responses/appointment/appointment.model';

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

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.appointmentId = this.route.snapshot.params['appointmentId'];
    this.fetchAppointment();
  }

  fetchAppointment() {
    this.appointmentService.getById(this.appointmentId).subscribe({
      next: (data: Appointment) => {
        this.appointment = data;
      },
      error: (error: any) => console.error('Error fetching data:', error)
    });
  }

  getStatusColorClass(status: string): string {
    switch (status) {
      case 'Chờ xác nhận':
        return 'text-yellow-600';
      case 'Đã xác nhận':
        return 'text-green-600';
      case 'Đã huỷ':
        return 'text-red-600';
      case 'Chờ khám':
        return 'text-gray-600';
      case 'Đã khám':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  }

  goBack() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
} 