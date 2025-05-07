import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../core/services/http.service';
import { DoctorService } from '../../../models/responses/doctor/doctor-service.model';
import { DoctorServiceRequest } from '../../../models/requests/doctor/doctor-service.request';
import { PageResponse } from '../../../models/responses/page-response.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorServiceService {
  constructor(private http: HttpService) {}

  private readonly API_URL = '/api/v1/appointment/doctor-service';

  /**
   * Tạo mới dịch vụ của bác sĩ
   */
  create(request: DoctorServiceRequest): Observable<DoctorService> {
    return this.http.post<DoctorService>(this.API_URL, request);
  }

  /**
   * Lấy tất cả dịch vụ bác sĩ (phân trang)
   */
  getAll(page = 1, size = 10): Observable<PageResponse<DoctorService>> {
    return this.http.get<PageResponse<DoctorService>>(
      `${this.API_URL}?page=${page}&size=${size}`
    );
  }

  /**
   * Tìm dịch vụ theo serviceId và từ khóa
   */
  searchByService(keyword = '', serviceId = '', page = 1, size = 10): Observable<PageResponse<DoctorService>> {
    return this.http.get<PageResponse<DoctorService>>(
      `${this.API_URL}/search-by-service?keyword=${keyword}&serviceId=${serviceId}&page=${page}&size=${size}`
    );
  }

  /**
   * Tìm dịch vụ theo doctorId và từ khóa
   */
  searchByDoctor(keyword = '', doctorId = '', page = 1, size = 10): Observable<PageResponse<DoctorService>> {
    return this.http.get<PageResponse<DoctorService>>(
      `${this.API_URL}/search-by-doctor?keyword=${keyword}&doctorId=${doctorId}&page=${page}&size=${size}`
    );
  }

  /**
   * Lấy chi tiết dịch vụ theo ID
   */
  getById(id: string): Observable<DoctorService> {
    return this.http.get<DoctorService>(`${this.API_URL}/${id}`);
  }

  /**
   * Cập nhật dịch vụ
   */
  updateById(id: string, request: DoctorServiceRequest): Observable<DoctorService> {
    return this.http.put<DoctorService>(`${this.API_URL}/${id}`, request);
  }

  /**
   * Xoá dịch vụ
   */
  deleteById(id: string): Observable<string> {
    return this.http.delete<string>(`${this.API_URL}/${id}`);
  }

  /**
   * Lấy dịch vụ theo doctorId
   */
  getByDoctorId(doctorId: string, page = 1, size = 10): Observable<PageResponse<DoctorService>> {
    return this.http.get<PageResponse<DoctorService>>(
      `${this.API_URL}/doctor/${doctorId}?page=${page}&size=${size}`
    );
  }

  /**
   * Lấy dịch vụ theo serviceId
   */
  getByServiceId(serviceId: string, page = 1, size = 10): Observable<PageResponse<DoctorService>> {
    return this.http.get<PageResponse<DoctorService>>(
      `${this.API_URL}/service/${serviceId}?page=${page}&size=${size}`
    );
  }

  /**
   * Lấy dịch vụ theo status (true/false)
   */
  getByStatus(status: boolean, page = 1, size = 10): Observable<PageResponse<DoctorService>> {
    return this.http.get<PageResponse<DoctorService>>(
      `${this.API_URL}/status/${status}?page=${page}&size=${size}`
    );
  }
}
