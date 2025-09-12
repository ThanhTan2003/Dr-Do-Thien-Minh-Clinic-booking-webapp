import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResponse } from '../../../models/responses/page-response.model';
import { HttpService } from '../../../../core/services/http.service';
import { ExamResultRequest } from '../../../models/requests/appointment/exam-result.request';
import { Appointment } from '../../../models/responses/appointment/appointment.model';

@Injectable({
  providedIn: 'root'
})

export class AppointmentSchedule {
  constructor(private http: HttpService) { }

  private readonly API_URL = '/api/v1/appointment/schedule';

  /**
 * Tìm DS các appointment theo ngày lễ
 */
  searchAppointments(holidayId: string, keyword: string = '', page: number = 1, size: number = 10): Observable<PageResponse<Appointment>> {
    return this.http.get<PageResponse<Appointment>>(
      `${this.API_URL}/search?holidayId=${holidayId}&keyword=${keyword}&page=${page}&size=${size}`
    );
  }

  /**
   * Tìm DS các appointment theo ngày nghỉ bác sĩ
   */
  searchAppointmentsForDoctorLeave(doctorLeaveId: string, keyword: string = '', page: number = 1, size: number = 10): Observable<PageResponse<Appointment>> {
    return this.http.get<PageResponse<Appointment>>(
      `${this.API_URL}/doctor-leave/search?doctorLeaveId=${doctorLeaveId}&keyword=${keyword}&page=${page}&size=${size}`
    );
  }
}