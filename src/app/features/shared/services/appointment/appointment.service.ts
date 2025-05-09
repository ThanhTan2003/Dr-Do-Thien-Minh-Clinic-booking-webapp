import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Appointment } from '../../../models/responses/appointment/appointment.model';
import { AppointmentRequest } from '../../../models/requests/appointment/appointment.request';
import { PageResponse } from '../../../models/responses/page-response.model';
import { HttpService } from '../../../../core/services/http.service';

@Injectable({
  providedIn: 'root'
})

export class AppointmentService {
  constructor(private http: HttpService) {}

  private readonly API_URL = '/api/v1/appointment/main';

  create(request: AppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(this.API_URL, request);
  }

  getById(id: string): Observable<Appointment> {
    console.log('getById', `${this.API_URL}/${id}`);
    return this.http.get<Appointment>(`${this.API_URL}/${id}`);
  }

  getByDoctorServiceId(doctorServiceId: string, status = '', page = 1, size = 10): Observable<PageResponse<Appointment>> {
    return this.http.get<PageResponse<Appointment>>(
      `${this.API_URL}/doctor/${doctorServiceId}?status=${status}&page=${page}&size=${size}`
    );
  }

  getByZaloUid(zaloUid: string, status = '', page = 1, size = 10): Observable<PageResponse<Appointment>> {
    return this.http.get<PageResponse<Appointment>>(
      `${this.API_URL}/zalo/${zaloUid}?status=${status}&page=${page}&size=${size}`
    );
  }

  getByPatientId(patientId: string, status = '', keyword = '', page = 1, size = 10): Observable<PageResponse<Appointment>> {
    return this.http.get<PageResponse<Appointment>>(
      `${this.API_URL}/patient/${patientId}?status=${status}&keyword=${keyword}&page=${page}&size=${size}`
    );
  }

  getByAppointmentDate(appointmentDate: string, page = 1, size = 10): Observable<PageResponse<Appointment>> {
    return this.http.get<PageResponse<Appointment>>(
      `${this.API_URL}/date/${appointmentDate}?page=${page}&size=${size}`
    );
  }

  getAppointmentStatuses(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/statuses`);
  }

  getAppointmentsByFilters(doctorId: string, appointmentDate: string, status = '', page = 1, size = 10): Observable<PageResponse<Appointment>> {
    return this.http.get<PageResponse<Appointment>>(
      `${this.API_URL}/search?doctorId=${doctorId}&appointmentDate=${appointmentDate}&status=${status}&page=${page}&size=${size}`
    );
  }

  confirmAppointment(appointmentId: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.API_URL}/confirm/${appointmentId}`, {});
  }

  cancelAppointment(appointmentId: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.API_URL}/cancel/${appointmentId}`, {});
  }

  remindAppointment(appointmentId: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.API_URL}/remind/${appointmentId}`, {});
  }

  markAsExamined(appointmentId: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.API_URL}/mark-as-examined/${appointmentId}`, {});
  }

  getAppointmentsByScheduleAndDate(doctorScheduleId: string, appointmentDate: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.API_URL}/search-by-schedule?doctorScheduleId=${doctorScheduleId}&appointmentDate=${appointmentDate}`);
  }
}
