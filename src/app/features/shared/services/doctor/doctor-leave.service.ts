import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResponse } from '../../../models/responses/page-response.model';
import { HttpService } from '../../../../core/services/http.service';
import { ExamResultRequest } from '../../../models/requests/appointment/exam-result.request';
import { DoctorLeaveRequest } from '../../../models/requests/doctor/doctor-leave-request';
import { DoctorLeaveResponse } from '../../../models/responses/doctor/doctor-leave.model';

@Injectable({
  providedIn: 'root'
})

export class DoctorLeave {
  constructor(private http: HttpService) { }

  private readonly API_URL = '/api/v1/appointment/doctor-leave';

  /**
 * Tạo lịch nghỉ bác sĩ
 */
  createDoctorLeave(doctorLeaveRequest: DoctorLeaveRequest): Observable<DoctorLeaveResponse> {
    return this.http.post<DoctorLeaveResponse>(
      `${this.API_URL}`,
      doctorLeaveRequest
    );
  }

  /**
   * Xoá lịch nghỉ bác sĩ
   */
  deleteDoctorLeave(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/${id}`
    );
  }

  /**
   * Lấy danh sách lịch nghỉ của bác sĩ theo bác sĩ
   */
  getDoctorLeavesByDoctor(doctorId: string, page: number = 1, size: number = 10): Observable<PageResponse<DoctorLeaveResponse>> {
    return this.http.get<PageResponse<DoctorLeaveResponse>>(
      `${this.API_URL}/get-all/doctor?doctorId=${doctorId}&page=${page}&size=${size}`
    );
  }

  /**
   * Lấy danh sách tất cả lịch nghỉ bác sĩ
   */
  getDoctorLeaves(page: number = 1, size: number = 10): Observable<PageResponse<DoctorLeaveResponse>> {
    return this.http.get<PageResponse<DoctorLeaveResponse>>(
      `${this.API_URL}/get-all?page=${page}&size=${size}`
    );
  }

  /**
   * Tìm kiếm lịch nghỉ bác sĩ
   */
  searchDoctorLeaves(keyword: string = '', page: number = 1, size: number = 10): Observable<PageResponse<DoctorLeaveResponse>> {
    return this.http.get<PageResponse<DoctorLeaveResponse>>(
      `${this.API_URL}/get-all?keyword=${keyword}&page=${page}&size=${size}`
    );
  }

  /**
   * Lấy các lịch nghỉ bác sĩ sắp tới
   */
  getUpcomingDoctorLeaves(doctorId: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.API_URL}/upcoming/doctor?doctorId=${doctorId}`
    );
  }
}