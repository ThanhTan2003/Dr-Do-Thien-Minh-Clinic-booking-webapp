import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../core/services/http.service';
import { ServiceCategory } from '../../../models/responses/medical/service-category.model';
import { ServiceCategoryRequest } from '../../../models/requests/medical/service-category.request';
import { PageResponse } from '../../../models/responses/page-response.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceCategoryService {
  constructor(private http: HttpService) {}

  private readonly API_URL = '/api/v1/appointment/service-category';

  /**
   * Tìm kiếm danh mục dịch vụ theo từ khoá (phân trang)
   */
  search(keyword = '', page = 1, size = 10): Observable<PageResponse<ServiceCategory>> {
    return this.http.get<PageResponse<ServiceCategory>>(
      `${this.API_URL}/search?keyword=${keyword}&page=${page}&size=${size}`
    );
  }

  /**
   * Lấy danh mục dịch vụ theo ID
   */
  getById(id: string): Observable<ServiceCategory> {
    return this.http.get<ServiceCategory>(`${this.API_URL}/${id}`);
  }

  /**
   * Tạo danh mục dịch vụ
   */
  create(request: ServiceCategoryRequest): Observable<ServiceCategory> {
    return this.http.post<ServiceCategory>(this.API_URL, request);
  }

  /**
   * Cập nhật danh mục dịch vụ theo ID
   */
  updateById(id: string, request: ServiceCategoryRequest): Observable<ServiceCategory> {
    return this.http.put<ServiceCategory>(`${this.API_URL}/${id}`, request);
  }

  /**
   * Xoá danh mục dịch vụ theo ID
   */
  deleteById(id: string): Observable<string> {
    return this.http.delete<string>(`${this.API_URL}/${id}`);
  }
}
