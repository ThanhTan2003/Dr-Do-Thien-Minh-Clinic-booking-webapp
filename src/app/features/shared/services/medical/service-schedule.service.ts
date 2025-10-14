import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../core/services/http.service';
import { ServiceSchedule } from '../../../models/responses/medical/service-schedule.model';
import { ServiceScheduleRequest } from '../../../models/requests/medical/service-schedule-request';

@Injectable({
  providedIn: 'root'
})
export class ServiceScheduleService {
  constructor(private http: HttpService) {}

  private readonly API_URL = '/api/v1/appointment/service-schedule';

  /**
   * 1. Lấy danh sách lịch khám theo tiêu chí (lọc theo serviceId, dayOfWeek, session, status)
   */
  getServiceSchedules(
    serviceId?: string,
    dayOfWeek?: string,
    session?: string,
    status?: boolean
  ): Observable<ServiceSchedule[]> {
    const params = new URLSearchParams();
    if (serviceId) params.append('serviceId', serviceId);
    if (dayOfWeek) params.append('dayOfWeek', dayOfWeek);
    if (session) params.append('session', session);
    if (status !== undefined) params.append('status', status.toString());

    return this.http.get<ServiceSchedule[]>(
      `${this.API_URL}/search?${params.toString()}`
    );
  }

  /**
   * 2. Thêm danh sách lịch khám mới cho dịch vụ
   */
  createOrUpdateBatch(requests: ServiceScheduleRequest[]): Observable<ServiceSchedule[]> {
    return this.http.post<ServiceSchedule[]>(`${this.API_URL}/batch`, requests);
  }

  /**
   * 3. Cập nhật lịch khám theo ID
   */
  updateById(id: string, request: ServiceScheduleRequest): Observable<ServiceSchedule> {
    return this.http.put<ServiceSchedule>(`${this.API_URL}/${id}`, request);
  }

  /**
   * 4. Cập nhật danh sách lịch khám dịch vụ
   */
  updateBatch(requests: ServiceScheduleRequest[]): Observable<ServiceSchedule[]> {
    return this.http.put<ServiceSchedule[]>(`${this.API_URL}/batch`, requests);
  }

  /**
   * 5. Xoá lịch khám theo ID
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  /**
   * 6. Lấy lịch làm việc của dịch vụ theo ngày
   */
  getScheduleByServiceAndDate(serviceId: string, date: string): Observable<ServiceSchedule[]> {
    return this.http.get<ServiceSchedule[]>(
      `${this.API_URL}/service/${serviceId}/schedule?date=${date}`
    );
  }

  /**
   * 7. Lấy danh sách trạng thái của lịch làm việc dịch vụ
   */
  getStatuses(): Observable<any[]> {
    // Sử dụng cùng endpoint với doctor schedule vì cấu trúc tương tự
    return this.http.get<any[]>('/api/v1/appointment/doctor-schedule/statuses');
  }

  getListDayOfWeekByService(serviceId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/customer/get-day-of-week-by-service/${serviceId}`);
  }
}
