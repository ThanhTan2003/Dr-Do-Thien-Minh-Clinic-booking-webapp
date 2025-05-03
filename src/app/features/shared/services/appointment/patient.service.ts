import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { Patient } from '../../models/responses/appointment/patient.model';
import { PatientRequest } from '../../models/requests/appointment/patient.request';
import { PageResponse } from '../../models/responses/page-response.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private http: HttpService) {}

  private readonly API_URL = '/api/v1/appointment/patient';

  /**
   * Lấy danh sách bệnh nhân (có phân trang)
   */
  getAll(page = 1, size = 10): Observable<PageResponse<Patient>> {
    return this.http.get<PageResponse<Patient>>(`${this.API_URL}?page=${page}&size=${size}`);
  }

  /**
   * Tìm bệnh nhân theo từ khoá (có phân trang)
   */
  search(keyword = '', page = 1, size = 10): Observable<PageResponse<Patient>> {
    return this.http.get<PageResponse<Patient>>(
      `${this.API_URL}/search?keyword=${keyword}&page=${page}&size=${size}`
    );
  }

  /**
   * Lấy thông tin bệnh nhân theo ID
   */
  getById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.API_URL}/${id}`);
  }

  /**
   * Tạo mới bệnh nhân
   */
  create(request: PatientRequest): Observable<Patient> {
    return this.http.post<Patient>(this.API_URL, request);
  }

  /**
   * Cập nhật thông tin bệnh nhân
   */
  update(id: string, request: PatientRequest): Observable<Patient> {
    return this.http.put<Patient>(`${this.API_URL}/${id}`, request);
  }

  /**
   * Xoá bệnh nhân
   */
  delete(id: string): Observable<string> {
    return this.http.delete<string>(`${this.API_URL}/${id}`);
  }
}
