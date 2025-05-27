import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../../core/services/http.service';
import { TagRequest } from '../../../../models/requests/zalo_oa/user/tag.request';
import { TagResponse } from '../../../../models/responses/zalo_oa/user/tag-response.model';
import { PageResponse } from '../../../../models/responses/page-response.model';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  constructor(private http: HttpService) {}

  private readonly API_URL = '/api/v1/zalo-oa/tag';

  /**
   * Tạo tag mới
   */
  create(request: TagRequest): Observable<TagResponse> {
    return this.http.post<TagResponse>(this.API_URL, request);
  }

  /**
   * Cập nhật tag theo ID
   */
  update(id: string, request: TagRequest): Observable<TagResponse> {
    return this.http.put<TagResponse>(`${this.API_URL}/${id}`, request);
  }

  /**
   * Xóa tag theo ID
   */
  delete(id: string): Observable<string> {
    return this.http.delete<string>(`${this.API_URL}/${id}`);
  }

  /**
   * Kiểm tra sự tồn tại của tag theo tên
   */
  checkTagExists(name: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/exists?name=${name}`);
  }

  /**
   * Lấy danh sách tag phân trang
   */
  getTags(keyword = '', page = 1, size = 10): Observable<PageResponse<TagResponse>> {
    return this.http.get<PageResponse<TagResponse>>(
      `${this.API_URL}?keyword=${keyword}&page=${page}&size=${size}`
    );
  }

  /**
   * Lấy tag theo ID
   */
  getTagById(id: string): Observable<TagResponse> {
    return this.http.get<TagResponse>(`${this.API_URL}/${id}`);
  }

  /**
   * Lấy tag theo tên
   */
  getTagByName(name: string): Observable<TagResponse> {
    return this.http.get<TagResponse>(`${this.API_URL}/by-name?name=${name}`);
  }
}