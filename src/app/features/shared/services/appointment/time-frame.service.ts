import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../core/services/http.service';
import { TimeFrame } from '../../../models/responses/appointment/time-frame.model';
import { TimeFrameRequest } from '../../../models/requests/appointment/time-frame.request';
import { PageResponse } from '../../../models/responses/page-response.model';

@Injectable({
  providedIn: 'root'
})
export class TimeFrameService {
  constructor(private http: HttpService) { }

  private readonly API_URL = '/api/v1/appointment/timeframes';

  /**
   * Tạo mới khung giờ khám
   */
  create(request: TimeFrameRequest): Observable<TimeFrame> {
    return this.http.post<TimeFrame>(this.API_URL, request);
  }

  /**
   * Lấy danh sách khung giờ khám (có phân trang)
   */
  getAll(page = 1, size = 10): Observable<PageResponse<TimeFrame>> {
    return this.http.get<PageResponse<TimeFrame>>(
      `${this.API_URL}?page=${page}&size=${size}`
    );
  }

  /**
   * Lấy thông tin khung giờ theo ID
   */
  getById(id: string): Observable<TimeFrame> {
    return this.http.get<TimeFrame>(`${this.API_URL}/${id}`);
  }

  /**
   * Cập nhật khung giờ khám theo ID
   */
  updateById(id: string, request: TimeFrameRequest): Observable<TimeFrame> {
    return this.http.put<TimeFrame>(`${this.API_URL}/${id}`, request);
  }

  /**
   * Xoá khung giờ khám theo ID
   */
  deleteById(id: string): Observable<string> {
    return this.http.delete<string>(`${this.API_URL}/${id}`);
  }

  /**
   * Lấy danh sách khung giờ khám đang hoạt động
   */
  getAllActiveTimeFrames(): Observable<TimeFrame[]> {
    return this.http.get<TimeFrame[]>(`${this.API_URL}/active`);
  }

  /**
   * Lấy tất cả các phiên (sessions)
   */
  getAllSessions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/sessions`);
  }
}
