import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../core/services/http.service';
import { Appointment } from '../../../models/responses/appointment/appointment.model';
import { ServiceAppointmentRequest } from '../../../models/requests/appointment/service-appointment.request';
import { AdvisoryStatus } from '../../../models/responses/appointment/advisory-status.model';
import { SuggestedDoctor } from '../../../models/responses/appointment/suggested-doctor.model';
import { PageResponse } from '../../../models/responses/page-response.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceAppointmentService {
  constructor(private http: HttpService) {}

  private readonly API_URL = '/api/v1/appointment/service-appointment';

  /**
   * Tạo lịch hẹn dịch vụ mới
   */
  createServiceAppointment(request: ServiceAppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(this.API_URL, request);
  }

  /**
   * Chuyển đổi lịch hẹn sang lịch hẹn dịch vụ
   */
  convertToServiceAppointment(
    appointmentId: string,
    request: ServiceAppointmentRequest
  ): Observable<Appointment> {
    return this.http.put<Appointment>(
      `${this.API_URL}/${appointmentId}/convert`,
      request
    );
  }

  /**
   * Lấy danh sách trạng thái gợi ý
   */
  getSuggestionStatuses(): Observable<AdvisoryStatus[]> {
    return this.http.get<AdvisoryStatus[]>(`${this.API_URL}/suggestion-statuses`);
  }

  /**
   * Lấy danh sách gợi ý bác sĩ cho lịch hẹn theo dịch vụ
   */
  getSuggestedDoctorsByAppointment(
    appointmentId: string,
    keyword = '',
    page = 1,
    size = 10
  ): Observable<PageResponse<SuggestedDoctor>> {
    return this.http.get<PageResponse<SuggestedDoctor>>(
      `${this.API_URL}/${appointmentId}/suggested-doctors?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`
    );
  }
}
