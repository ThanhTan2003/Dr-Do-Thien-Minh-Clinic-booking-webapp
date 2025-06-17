import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  /**
   * Tạo lịch hẹn mới
   */
  create(request: AppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(this.API_URL, request);
  }

  /**
   * Lấy lịch hẹn theo ID
   */ 
  getById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.API_URL}/${id}`);
  }

  /**
   * Tìm kiếm các cuộc hẹn theo doctorServiceId (có phân trang)
   */
  getByDoctorServiceId(doctorServiceId: string, status = '', keyword = '', page = 1, size = 10): Observable<PageResponse<Appointment>> {
    return this.http.get<PageResponse<Appointment>>(
      `${this.API_URL}/doctor/${doctorServiceId}?status=${status}&keyword=${keyword}&page=${page}&size=${size}`
    );
  }

  /**
   * Tìm kiếm các cuộc hẹn theo zaloUid (có phân trang)
   */
  getByZaloUid(zaloUid: string, status = '', keyword = '', page = 1, size = 10): Observable<PageResponse<Appointment>> {
    return this.http.get<PageResponse<Appointment>>(
      `${this.API_URL}/zalo/${zaloUid}?status=${status}&keyword=${keyword}&page=${page}&size=${size}`
    );
  }

  /**
   * Tìm kiếm các cuộc hẹn theo patientId (có phân trang)
   */
  getByPatientId(patientId: string, status = '', keyword = '', page = 1, size = 10): Observable<PageResponse<Appointment>> {
    return this.http.get<PageResponse<Appointment>>(
      `${this.API_URL}/patient/${patientId}?status=${status}&keyword=${keyword}&page=${page}&size=${size}`
    );
  }

  /**
   * Tìm kiếm các cuộc hẹn theo ngày hẹn
   */
  getByAppointmentDate(appointmentDate: string, page = 1, size = 10): Observable<PageResponse<Appointment>> {
    return this.http.get<PageResponse<Appointment>>(
      `${this.API_URL}/date/${appointmentDate}?page=${page}&size=${size}`
    );
  }

  /**
   * Lấy danh sách các trạng thái cuộc hẹn
   */
  getAppointmentStatuses(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/statuses`);
  }

  /**
   * Tìm kiếm cuộc hẹn theo doctorId, appointmentDate và status
   */
  getAppointmentsByFilters(doctorId: string, appointmentDate: string, status = '', page = 1, size = 10): Observable<PageResponse<Appointment>> {
    return this.http.get<PageResponse<Appointment>>(
      `${this.API_URL}/search?doctorId=${doctorId}&appointmentDate=${appointmentDate}&status=${status}&page=${page}&size=${size}`
    );
  }

  /**
   * Xác nhận lịch hẹn (Cập nhật status thành "Đã phê duyệt")
   */
  confirmAppointment(appointmentId: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.API_URL}/confirm/${appointmentId}`, {});
  }

  /**
   * Huỷ lịch hẹn (Cập nhật status thành "Đã huỷ")
   */
  cancelAppointment(appointmentId: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.API_URL}/cancel/${appointmentId}`, {});
  }

  /**
   * Nhắc lịch khám (Cập nhật status thành "Chờ khám")
   */
  remindAppointment(appointmentId: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.API_URL}/remind/${appointmentId}`, {});
  }

  /**
   * Đánh dấu là đã khám (Cập nhật status thành "Đã khám")
   */
  markAsExamined(appointmentId: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.API_URL}/mark-as-examined/${appointmentId}`, {});
  }

  /**
   * Tìm các cuộc hẹn của bác sĩ theo lịch trình và ngày hẹn
   */
  getAppointmentsByScheduleAndDate(doctorScheduleId: string, appointmentDate: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.API_URL}/search-by-schedule?doctorScheduleId=${doctorScheduleId}&appointmentDate=${appointmentDate}`);
  }
}
