import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../core/services/http.service';
import { Doctor } from '../../../models/responses/doctor/doctor.model';
import { DoctorRequest } from '../../../models/requests/doctor/doctor.request';
import { PageResponse } from '../../../models/responses/page-response.model';
import { DoctorStatus } from '../../../models/responses/doctor/doctor-status.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  constructor(private http: HttpService) { }

  private readonly API_URL = '/api/v1/appointment/doctor';

  /**
   * Lấy danh sách bác sĩ (phân trang)
   */
  getAll(page = 1, size = 10): Observable<PageResponse<Doctor>> {
    return this.http.get<PageResponse<Doctor>>(
      `${this.API_URL}?page=${page}&size=${size}`
    );
  }

  /**
   * Tìm bác sĩ theo từ khoá
   */
  searchDoctorsByCustomer(keyword: string, page = 1, size = 10): Observable<PageResponse<Doctor>> {
    return this.http.get<PageResponse<Doctor>>(
      `${this.API_URL}/customer/search?keyword=${keyword}&page=${page}&size=${size}`
    );
  }

  /**
   * Tìm bác sĩ theo serviceId + từ khoá
   */
  searchByService(keyword = '', serviceId = '', page = 1, size = 10): Observable<PageResponse<Doctor>> {
    return this.http.get<PageResponse<Doctor>>(
      `${this.API_URL}/search-by-service?keyword=${keyword}&serviceId=${serviceId}&page=${page}&size=${size}`
    );
  }

  /**
 * Cập nhật avatar bác sĩ
 */
  updateAvatar(id: string, file: File): Observable<Doctor> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.put<Doctor>(
      `${this.API_URL}/${id}/avatar`,
      formData
    );
  }


  /**
   * Tìm bác sĩ theo trạng thái hoạt động
   */
  searchByStatus(status: boolean, page = 1, size = 10): Observable<PageResponse<Doctor>> {
    return this.http.get<PageResponse<Doctor>>(
      `${this.API_URL}/search/status?status=${status}&page=${page}&size=${size}`
    );
  }

  /**
   * Lấy thông tin bác sĩ theo ID
   */
  getById(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.API_URL}/${id}`);
  }

  /**
   * Tạo mới bác sĩ
   */
  create(request: DoctorRequest): Observable<Doctor> {
    return this.http.post<Doctor>(this.API_URL, request);
  }

  /**
   * Cập nhật thông tin bác sĩ
   */
  update(id: string, request: DoctorRequest): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.API_URL}/${id}`, request);
  }

  /**
   * Xoá bác sĩ theo ID
   */
  delete(id: string): Observable<string> {
    return this.http.delete<string>(`${this.API_URL}/${id}`);
  }

  /**
 * Tìm kiếm bác sĩ theo từ khoá và danh mục dịch vụ (phân trang)
 */
  searchDoctorsByCategory(
    keyword = '',
    serviceCategoryId = '',
    page = 1,
    size = 10
  ): Observable<PageResponse<Doctor>> {
    const url = `${this.API_URL}/admin/search?keyword=${keyword}&serviceCategoryId=${serviceCategoryId}&page=${page}&size=${size}`;
    return this.http.get<PageResponse<Doctor>>(url);
  }


  /**
 * Tìm bác sĩ theo từ khóa, trạng thái (tùy chọn) và danh mục dịch vụ
 */
  /**
   * Tìm kiếm bác sĩ theo từ khoá + trạng thái (tuỳ chọn) + serviceCategoryId (phân trang)
   */
  searchDoctorsWithStatusAndCategory(
    keyword = '',
    serviceCategoryId = '',
    status: boolean | undefined,
    page = 1,
    size = 10
  ): Observable<PageResponse<Doctor>> {
    let url = `${this.API_URL}/search/keyword-status-category?keyword=${keyword}&serviceCategoryId=${serviceCategoryId}`;
    if (status !== undefined) {
      url += `&status=${status}`;
    }
    url += `&page=${page}&size=${size}`;

    return this.http.get<PageResponse<Doctor>>(url);
  }


  /**
   * Lấy danh sách trạng thái
   */
  getAllDoctorStatuses(): Observable<DoctorStatus[]> {
    return this.http.get<DoctorStatus[]>(
      `${this.API_URL}/statuses`
    );
  }
}
