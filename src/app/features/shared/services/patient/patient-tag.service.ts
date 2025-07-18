import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../core/services/http.service';
import { PatientTagRequest } from '../../../models/requests/patient/patient-tag.request';
import { PatientTagResponse } from '../../../models/responses/patient/patient-tag.response';
import { PageResponse } from '../../../models/responses/page-response.model';

@Injectable({
  providedIn: 'root'
})
export class PatientTagService {
  private readonly API_URL = '/api/v1/appointment/patient-tag';

  constructor(private http: HttpService) { }

  /**
   * Lấy các tag của bệnh nhân theo patientId
   */
  getTagsByPatient(patientId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/by-patient/${patientId}`);
  }

  /**
   * Lấy các tag của bệnh nhân theo zaloUid
   */
  getTagsByZaloUid(zaloUid: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/by-zalo-uid/${zaloUid}`);
  }

  /**
   * Lấy danh sách tất cả các tag
   */
  getAllDistinctTags(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/all-tags`);
  }

  /**
   * Thêm tag cho bệnh nhân
   */
  addTag(request: PatientTagRequest): Observable<PatientTagResponse> {
    return this.http.post<PatientTagResponse>(this.API_URL, request);
  }

  /**
   * Xóa tag của bệnh nhân theo patientId và tagName
   */
  removeTag(patientId: string, tagName: string): Observable<string> {
    return this.http.delete<string>(`${this.API_URL}/${patientId}?tagName=${tagName}`);
  }

  /**
 * Lấy danh sách các tag có sẵn cho bệnh nhân
 */
  getAvailableTagsForPatient(patientId: string, keyword: string = '', page: number = 1, size: number = 10): Observable<PageResponse<string>> {
    return this.http.get<PageResponse<string>>(
      `${this.API_URL}/available-tags/${patientId}?keyword=${keyword}&page=${page}&size=${size}`
    );
  }

}
