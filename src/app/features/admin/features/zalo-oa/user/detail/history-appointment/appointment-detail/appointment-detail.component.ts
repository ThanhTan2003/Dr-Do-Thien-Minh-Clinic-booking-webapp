import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Appointment } from '../../../../../../../models/responses/appointment/appointment.model';
import { AppointmentService } from '../../../../../../../shared/services/appointment/appointment.service';

@Component({
  selector: 'app-appointment-detail',
  templateUrl: './appointment-detail.component.html',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule]
})
export class AppointmentDetailComponent implements OnInit {
  @Input() appointmentId: string = '';
  @Output() close = new EventEmitter<void>();

  faXmark = faXmark;
  appointment: Appointment | null = null;
  loading: boolean = false;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    if (this.appointmentId) {
      this.loadAppointment();
    }
  }

  loadAppointment(): void {
    this.loading = true;
    this.appointmentService.getById(this.appointmentId).subscribe({
      next: (response: Appointment) => {
        this.appointment = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appointment:', error);
        this.loading = false;
      }
    });
  }

  closeModal(): void {
    this.close.emit();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  formatPhoneNumber(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    const match = digits.match(/^(\d{4})(\d{3})(\d{3})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]}`;
    }
    return phone;
  }
  
} 