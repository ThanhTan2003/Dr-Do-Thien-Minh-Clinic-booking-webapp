import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../../core/services/http.service';
import { ZaloUserRequest } from '../../../../models/requests/zalo_oa/user/zalo-user.request';
import { ZaloUserResponse } from '../../../../models/responses/zalo_oa/user/zalo-user-response.model';
import { PageResponse } from '../../../../models/responses/page-response.model';

@Injectable({
  providedIn: 'root'
})
export class ZaloUserService {
  constructor(private http: HttpService) {}

  private readonly API_URL = '/api/v1/zalo-oa/user';

  /**
   * Lấy thông tin user theo ID
   */
  getById(id: string): Observable<ZaloUserResponse> {
    return this.http.get<ZaloUserResponse>(`${this.API_URL}/${id}`);
  }

  /**
   * Tạo user mới
   */
  create(request: ZaloUserRequest): Observable<ZaloUserResponse> {
    return this.http.post<ZaloUserResponse>(this.API_URL, request);
  }

  /**
   * Cập nhật user theo ID
   */
  update(id: string, request: ZaloUserRequest): Observable<ZaloUserResponse> {
    return this.http.put<ZaloUserResponse>(`${this.API_URL}/${id}`, request);
  }

  /**
   * Xóa user theo ID
   */
  delete(id: string): Observable<string> {
    return this.http.delete<string>(`${this.API_URL}/${id}`);
  }

  /**
   * Tìm kiếm user phân trang
   */
  searchUsers(keyword: string, tagId: string, page: number, size: number): Observable<PageResponse<ZaloUserResponse>> {
    return this.http.get<PageResponse<ZaloUserResponse>>(
      `${this.API_URL}/search?keyword=${keyword}&tagId=${tagId}&page=${page}&size=${size}`
    );
  }

  syncUsers(): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/sync`, {});
  }
}