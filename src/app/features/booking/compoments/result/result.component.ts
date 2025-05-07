import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { AppointmentService } from '../../../shared/services/appointment/appointment.service';
import { Appointment } from '../../../models/responses/appointment/appointment.model';

import { BookingSuccessComponent } from './success.component';
import { BookingFailureComponent } from './failure.component';

@Component({
  selector: 'app-booking-result',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    BookingSuccessComponent,
    BookingFailureComponent
  ],
  templateUrl: './result.component.html'
})
export class BookingResultComponent implements OnInit {
  appointment: Appointment | null = null;
  loading = true;

  private appointmentId!: string;

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit BookingResultComponent-----------------------------------------------------------');
    this.appointmentId = this.route.snapshot.paramMap.get('appointmentId')!;
    console.log('appointmentId', this.appointmentId);
    this.appointmentService.getById(this.appointmentId)
      .subscribe({
        next: (data) => {
          this.appointment = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Không thể lấy dữ liệu lịch hẹn:', err);
          this.appointment = null;
          this.loading = false;
        }
      });
  }
  
}
