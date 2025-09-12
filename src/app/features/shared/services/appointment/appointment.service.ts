import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../../../models/responses/appointment/appointment.model';
import { AppointmentRequest } from '../../../models/requests/appointment/appointment.request';
import { PageResponse } from '../../../models/responses/page-response.model';
import { HttpService } from '../../../../core/services/http.service';
import { ExamResultRequest } from '../../../models/requests/appointment/exam-result.request';
import { ServiceAppointmentRequest } from '../../../models/requests/appointment/service-appointment.request';
import { AppointmentResultResponse } from '../../../models/responses/appointment/appointment-result.response';

@Injectable({
  providedIn: 'root'
})

export class AppointmentService {
  constructor(private http: HttpService) { }

  private readonly API_URL = '/api/v1/appointment/main';

  /**
   * Lấy lịch hẹn theo ID
  */
  getById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.API_URL}/${id}`);
  }
  getByIdByCustomer(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.API_URL}/customer/${id}`);
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
  getByPatientIdByCustomer(patientId: string, status = '', keyword = '', page = 1, size = 10): Observable<PageResponse<Appointment>> {
    return this.http.get<PageResponse<Appointment>>(
      `${this.API_URL}/customer/patient/${patientId}?status=${status}&keyword=${keyword}&page=${page}&size=${size}`
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
 * Lấy danh sách các trạng thái cuộc hẹn Chờ khám - Đã khám
 */
  getExamStatusList(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/exam-statuses`);
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
   * Tìm các cuộc hẹn của bác sĩ theo lịch trình và ngày hẹn
   */
  getAppointmentsByScheduleAndDate(doctorScheduleId: string, appointmentDate: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.API_URL}/search-by-schedule?doctorScheduleId=${doctorScheduleId}&appointmentDate=${appointmentDate}`);
  }

  /**
   * Lấy danh sách lịch khám của bác sĩ theo ngày
   */
  getDoctorAppointmentsByDate(doctorId: string, appointmentDate: string, status = '', keyword = '', page = 1, size = 10): Observable<PageResponse<Appointment>> {
    return this.http.get<PageResponse<Appointment>>(
      `${this.API_URL}/doctor/${doctorId}/date/${appointmentDate}?status=${status}&keyword=${keyword}&page=${page}&size=${size}`
    );
  }

  /**
 * Lấy các cuộc hẹn của bác sĩ theo ngày Chờ khám - Đã khám
 */
  getDoctorAppointmentsForExamByDate(
    doctorId: string,
    appointmentDate: string,
    status = '',
    keyword = '',
    page = 1,
    size = 10
  ): Observable<PageResponse<Appointment>> {
    return this.http.get<PageResponse<Appointment>>(
      `${this.API_URL}/doctor/${doctorId}/exam-appointments/${appointmentDate}?status=${status}&keyword=${keyword}&page=${page}&size=${size}`
    );
  }

  /**
   * Lấy danh sách lịch sử khám của bác sĩ
   */
  getDoctorAppointmentHistory(doctorId: string, status = '', keyword = '', page = 1, size = 10): Observable<PageResponse<Appointment>> {
    return this.http.get<PageResponse<Appointment>>(
      `${this.API_URL}/doctor/${doctorId}/history?status=${status}&keyword=${keyword}&page=${page}&size=${size}`
    );
  }

  /**
   * Lấy danh sách lịch sử khám của dịch vụ
   */
  getServiceAppointmentHistory(serviceId: string, status = '', keyword = '', page = 1, size = 10): Observable<PageResponse<Appointment>> {
    return this.http.get<PageResponse<Appointment>>(
      `${this.API_URL}/service/${serviceId}/history?status=${status}&keyword=${keyword}&page=${page}&size=${size}`
    );
  }

  /**
 * Lấy danh sách lịch khám của tất cả bác sĩ
 */
  getAllDoctorsAppointments(status: string = '', keyword: string = '', page: number = 1, size: number = 10): Observable<PageResponse<Appointment>> {
    return this.http.get<PageResponse<Appointment>>(
      `${this.API_URL}/get-all?status=${status}&keyword=${keyword}&page=${page}&size=${size}`
    );
  }

  /**
   * Lấy danh sách lịch khám của tất cả bác sĩ theo ngày
   */
  getAllDoctorsAppointmentsByDate(appointmentDate: string, status = '', keyword = '', page = 1, size = 10): Observable<PageResponse<Appointment>> {
    return this.http.get<PageResponse<Appointment>>(
      `${this.API_URL}/date/${appointmentDate}?status=${status}&keyword=${keyword}&page=${page}&size=${size}`
    );
  }

  /**
 * Lấy danh sách lịch khám của tất cả bác sĩ theo ngày Chờ khám - Đã khám
 */
  getAllDoctorsAppointmentsForExamByDate(
    appointmentDate: string,
    status = '',
    keyword = '',
    page = 1,
    size = 10
  ): Observable<PageResponse<Appointment>> {
    return this.http.get<PageResponse<Appointment>>(
      `${this.API_URL}/exam-appointments/${appointmentDate}?status=${status}&keyword=${keyword}&page=${page}&size=${size}`
    );
  }


  /**
   * Lấy lịch sử khám của bệnh nhân
   */
  getPatientAppointmentHistory(patientId: string, serviceId = '', numberOfMonths = 0, page = 1, size = 10): Observable<PageResponse<Appointment>> {
    return this.http.get<PageResponse<Appointment>>(
      `${this.API_URL}/history/patient/${patientId}?serviceId=${serviceId}&numberOfMonths=${numberOfMonths}&page=${page}&size=${size}`
    );
  }

  /**
   * Cập nhật kết quả khám cho lịch hẹn
   */
  updateExamResult(
    appointmentId: string,
    request: ExamResultRequest
  ): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${appointmentId}/exam-result`, request);
  }

  /**
 * Lấy lịch sử kết quả khám của bệnh nhân theo dịch vụ
 */
  getResultByPatientAndService(patientId: string, serviceId: string, date: string | null = null, page: number = 1, size: number = 10): Observable<PageResponse<AppointmentResultResponse>> {
    let url = `${this.API_URL}/result/${patientId}/${serviceId}?page=${page}&size=${size}`;

    if (date) {
      url += `&date=${date}`;
    }

    return this.http.get<PageResponse<AppointmentResultResponse>>(url);
  }


}