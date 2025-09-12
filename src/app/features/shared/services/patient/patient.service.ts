import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../core/services/http.service';
import { Patient } from '../../../models/responses/patient/patient.model';
import { PatientRequest } from '../../../models/requests/patient/patient.request';
import { PatientUpdateByCustomerRequest } from '../../../models/requests/patient/patient-update-by-customer.request';
import { PageResponse } from '../../../models/responses/page-response.model';

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
   * Lấy thông tin bệnh nhân theo ID
   */
  getById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.API_URL}/${id}`);
  }
  getByIdByCustomer(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.API_URL}/customer/${id}`);
  }

  /**
   * Tạo mới bệnh nhân
   */
  createByCustomer(request: PatientRequest): Observable<Patient> {
    return this.http.post<Patient>(`${this.API_URL}/customer`, request);
  }

  /**
   * Tạo mới bệnh nhân theo ZaloUid
   */
  createByZaloUid(zaloUid: string, request: PatientRequest): Observable<Patient> {
    return this.http.post<Patient>(`${this.API_URL}/${zaloUid}`, request);
  }

  /**
   * Cập nhật thông tin bệnh nhân
   */
  update(id: string, request: PatientRequest): Observable<Patient> {
    return this.http.put<Patient>(`${this.API_URL}/${id}`, request);
  }
  updateByIdByCustomer(id: string, request: PatientUpdateByCustomerRequest): Observable<Patient> {
    return this.http.put<Patient>(`${this.API_URL}/customer/${id}`, request);
  }


  /**
   * Xoá bệnh nhân
   */
  delete(id: string): Observable<string> {
    return this.http.delete<string>(`${this.API_URL}/${id}`);
  }

  /**
   * Tìm kiếm bệnh nhân theo từ khóa (có phân trang)
   */
  searchPatients(keyword: string = '', tagName: string = '', page: number = 1, size: number = 10): Observable<PageResponse<Patient>> {
    return this.http.get<PageResponse<Patient>>(
      `${this.API_URL}/search?keyword=${keyword}&tagName=${tagName}&page=${page}&size=${size}`
    );
  }
  searchPatientsByCustomer(keyword = '', page = 1, size = 10): Observable<PageResponse<Patient>> {
    return this.http.get<PageResponse<Patient>>(
      `${this.API_URL}/customer/search?keyword=${keyword}&page=${page}&size=${size}`
    );
  }

  /**
   * Lấy danh sách quan hệ bệnh nhân (danh sách các kiểu quan hệ)
   */
  getRelationships(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/relationships`);
  }

  /**
   * Tìm kiếm bệnh nhân theo zaloUid (có phân trang)
   */
  searchByZaloUid(
    zaloUid: string,
    keyword = '',
    tagName = '',
    page = 1,
    size = 10
  ): Observable<PageResponse<Patient>> {
    return this.http.get<PageResponse<Patient>>(
      `${this.API_URL}/search-by-zalo-user?zaloUid=${zaloUid}&keyword=${keyword}&tagName=${tagName}&page=${page}&size=${size}`
    );
  }
}
