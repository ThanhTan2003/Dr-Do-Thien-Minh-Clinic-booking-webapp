import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../../core/services/http.service';
import { TagResponse } from '../../../../models/responses/zalo_oa/user/tag-response.model';
import { ZaloUserResponse } from '../../../../models/responses/zalo_oa/user/zalo-user-response.model';
import { PageResponse } from '../../../../models/responses/page-response.model';

@Injectable({
  providedIn: 'root'
})
export class ZaloUserTagService {
  constructor(private http: HttpService) {}

  private readonly API_URL = '/api/v1/zalo-oa/zalo-user-tag';

  /**
   * Thêm tag cho user
   */
  addTagForUser(userId: string, tagName: string): Observable<string> {
    return this.http.post<string>(`${this.API_URL}/add?userId=${userId}&tagName=${tagName}`, {});
  }

  /**
   * Xóa tag khỏi user
   */
  removeTagFromUser(userId: string, tagName: string): Observable<string> {
    return this.http.delete<string>(`${this.API_URL}/remove?userId=${userId}&tagName=${tagName}`);
  }

  /**
   * Lấy danh sách tag của user
   */
  getTagsByUserId(userId: string): Observable<TagResponse[]> {
    return this.http.get<TagResponse[]>(`${this.API_URL}/tags?userId=${userId}`);
  }

  /**
   * Lấy danh sách user theo tag name
   */
  getUsersByTagName(tagName: string, page = 1, size = 10): Observable<PageResponse<ZaloUserResponse>> {
    return this.http.get<PageResponse<ZaloUserResponse>>(
      `${this.API_URL}/users-by-tag?tagName=${tagName}&page=${page}&size=${size}`
    );
  }

  /**
   * Lấy danh sách user theo danh sách tag names
   */
  getUsersByTagNames(tagNames: string[], page = 1, size = 10): Observable<PageResponse<ZaloUserResponse>> {
    const tagNamesParam = tagNames.join(',');
    return this.http.get<PageResponse<ZaloUserResponse>>(
      `${this.API_URL}/users-by-tags?tagNames=${tagNamesParam}&page=${page}&size=${size}`
    );
  }
}