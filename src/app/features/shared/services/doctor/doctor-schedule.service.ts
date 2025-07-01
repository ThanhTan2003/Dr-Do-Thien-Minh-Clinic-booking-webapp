import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../core/services/http.service';
import { DoctorSchedule } from '../../../models/responses/doctor/doctor-schedule.model';
import { ServiceSchedule } from '../../../models/responses/medical/service-schedule.model';
import { DoctorScheduleRequest } from '../../../models/requests/doctor/doctor-schedule.request';
import { PageResponse } from '../../../models/responses/page-response.model';
import { DoctorScheduleStatus } from '../../../models/responses/doctor/doctor-schedule-status.model';


@Injectable({
  providedIn: 'root'
})
export class DoctorScheduleService {
  constructor(private http: HttpService) {}

  private readonly API_URL = '/api/v1/appointment/doctor-schedule';

  /**
   * Tạo mới lịch làm việc cho bác sĩ
   */
  create(request: DoctorScheduleRequest): Observable<DoctorSchedule> {
    return this.http.post<DoctorSchedule>(this.API_URL, request);
  }

  /**
   * Lấy tất cả lịch làm việc (phân trang)
   */
  getAll(page = 1, size = 10): Observable<PageResponse<DoctorSchedule>> {
    return this.http.get<PageResponse<DoctorSchedule>>(`${this.API_URL}?page=${page}&size=${size}`);
  }

  /**
   * Lấy lịch làm việc theo ID
   */
  getById(id: string): Observable<DoctorSchedule> {
    return this.http.get<DoctorSchedule>(`${this.API_URL}/${id}`);
  }

  /**
   * Cập nhật lịch làm việc
   */
  updateById(id: string, request: DoctorScheduleRequest): Observable<DoctorSchedule> {
    return this.http.put<DoctorSchedule>(`${this.API_URL}/${id}`, request);
  }

  /**
   * Xoá lịch làm việc
   */
  deleteById(id: string): Observable<string> {
    return this.http.delete<string>(`${this.API_URL}/${id}`);
  }

  /**
   * Lấy lịch làm việc theo bác sĩ
   */
  getByDoctorId(doctorId: string, page = 1, size = 10): Observable<PageResponse<DoctorSchedule>> {
    return this.http.get<PageResponse<DoctorSchedule>>(
      `${this.API_URL}/doctor/${doctorId}?page=${page}&size=${size}`
    );
  }

  /**
   * Lấy lịch làm việc của bác sĩ theo ngày
   */
  getScheduleByDoctorAndDate(doctorId: string, date: string): Observable<DoctorSchedule[]> {
    return this.http.get<DoctorSchedule[]>(
      `${this.API_URL}/doctor/${doctorId}/schedule?date=${date}`
    );
  }
  getScheduleByServiceAndDate(serviceId: string, date: string): Observable<ServiceSchedule[]> {
    return this.http.get<ServiceSchedule[]>(
      `${this.API_URL}/service/${serviceId}/schedule?date=${date}`
    );
  }

  /**
   * Lấy lịch làm việc theo khung giờ
   */
  getByTimeFrameId(timeFrameId: string, page = 1, size = 10): Observable<PageResponse<DoctorSchedule>> {
    return this.http.get<PageResponse<DoctorSchedule>>(
      `${this.API_URL}/timeframe/${timeFrameId}?page=${page}&size=${size}`
    );
  }

  /**
   * Lấy lịch làm việc theo trạng thái
   */
  getByStatus(status: boolean, page = 1, size = 10): Observable<PageResponse<DoctorSchedule>> {
    return this.http.get<PageResponse<DoctorSchedule>>(
      `${this.API_URL}/status/${status}?page=${page}&size=${size}`
    );
  }

  /**
   * Lấy danh sách ngày trong tuần bác sĩ làm việc
   */
  getListDayOfWeekByDoctor(doctorId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/get-day-of-week-by-doctor/${doctorId}`);
  }

  /**
   * Lấy danh sách ngày trong tuần theo dịch vụ bác sĩ
   */
  getListDayOfWeekByDoctorService(doctorServiceId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/customer/get-day-of-week-by-doctor-service/${doctorServiceId}`);
  }

  getListDayOfWeekByService(serviceId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/customer/get-day-of-week-by-service/${serviceId}`);
  }

    /**
   * Tạo mới hoặc cập nhật lịch làm việc cho bác sĩ theo batch
   */
    createOrUpdateBatch(requests: DoctorScheduleRequest[]): Observable<DoctorSchedule[]> {
      return this.http.post<DoctorSchedule[]>(`${this.API_URL}/batch`, requests);
    }

    /**
     * Lấy lịch làm việc của bác sĩ theo ngày trong tuần
     */
    getSchedules(doctorId: string, dayOfWeek: string): Observable<DoctorSchedule[]> {
      return this.http.get<DoctorSchedule[]>(
        `${this.API_URL}/schedules?doctorId=${doctorId}&dayOfWeek=${dayOfWeek}`
      );
    }
  
    /**
     * Lấy lịch làm việc đang hoạt động của bác sĩ theo ngày trong tuần
     */
    getActiveSchedules(doctorId: string, dayOfWeek: string): Observable<DoctorSchedule[]> {
      return this.http.get<DoctorSchedule[]>(
        `${this.API_URL}/active-schedules?doctorId=${doctorId}&dayOfWeek=${dayOfWeek}`
      );
    }
  
    /**
     * Lấy danh sách trạng thái của lịch làm việc bác sĩ
     */
    getStatuses(): Observable<DoctorScheduleStatus[]> {
      return this.http.get<DoctorScheduleStatus[]>(`${this.API_URL}/statuses`);
    }
}
