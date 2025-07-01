import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../core/services/http.service';
import { Service } from '../../../models/responses/medical/service.model';
import { ServiceRequest } from '../../../models/requests/medical/service.request';
import { PageResponse } from '../../../models/responses/page-response.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  constructor(private http: HttpService) {}

  private readonly API_URL = '/api/v1/appointment/service';

  /**
   * Lấy tất cả dịch vụ (phân trang)
   */
  getAll(page = 1, size = 10): Observable<PageResponse<Service>> {
    return this.http.get<PageResponse<Service>>(
      `${this.API_URL}?page=${page}&size=${size}`
    );
  }

  /**
   * Tìm kiếm dịch vụ theo từ khoá + serviceCategoryId (phân trang)
   */
  search(keyword = '', serviceCategoryId = '', page = 1, size = 10): Observable<PageResponse<Service>> {
    return this.http.get<PageResponse<Service>>(
      `${this.API_URL}/search?keyword=${keyword}&serviceCategoryId=${serviceCategoryId}&page=${page}&size=${size}`
    );
  }
  searchByCustomer(keyword = '', serviceCategoryId = '', page = 1, size = 10): Observable<PageResponse<Service>> {
    return this.http.get<PageResponse<Service>>(
      `${this.API_URL}/customer/search?keyword=${keyword}&serviceCategoryId=${serviceCategoryId}&page=${page}&size=${size}`
    );
  }

  /**
   * Lấy chi tiết dịch vụ theo ID
   */
  getById(id: string): Observable<Service> {
    return this.http.get<Service>(`${this.API_URL}/${id}`);
  }

  /**
   * Tạo mới dịch vụ
   */
  create(request: ServiceRequest): Observable<Service> {
    return this.http.post<Service>(this.API_URL, request);
  }

  /**
   * Cập nhật dịch vụ theo ID
   */
  updateById(id: string, request: ServiceRequest): Observable<Service> {
    return this.http.put<Service>(`${this.API_URL}/${id}`, request);
  }

  /**
   * Xoá dịch vụ theo ID
   */
  deleteById(id: string): Observable<string> {
    return this.http.delete<string>(`${this.API_URL}/${id}`);
  }
  
    /**
   * Tìm kiếm dịch vụ theo bác sĩ + từ khoá + trạng thái + serviceCategoryId (phân trang)
   */
    searchByDoctor(
      keyword = '',
      doctorId: string,
      status = false,
      serviceCategoryId = '',
      page = 1,
      size = 10
    ): Observable<PageResponse<Service>> {
      return this.http.get<PageResponse<Service>>(
        `${this.API_URL}/search-by-doctor?keyword=${keyword}&doctorId=${doctorId}&status=${status}&serviceCategoryId=${serviceCategoryId}&page=${page}&size=${size}`
      );
    }
  
    /**
   * Tìm kiếm dịch vụ theo bác sĩ + từ khoá + trạng thái + serviceCategoryId (phân trang) chưa đăng ký
   */
    searchServicesNotRegisteredByDoctor(
      keyword = '',
      doctorId: string,
      serviceCategoryId = '',
      page = 1,
      size = 10
    ): Observable<PageResponse<Service>> {
      return this.http.get<PageResponse<Service>>(
        `${this.API_URL}/search-not-registered-by-doctor?keyword=${keyword}&doctorId=${doctorId}&status=${status}&serviceCategoryId=${serviceCategoryId}&page=${page}&size=${size}`
      );
    }
}
