import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../core/services/http.service';
import { FileResponse } from '../../../models/responses/file/file.model';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private http: HttpService) {}

  private readonly API_URL = '/api/v1/appointment/file';

  /**
   * 1.1 Upload ảnh Service Category
   */
  uploadServiceCategoryImage(serviceCategoryId: string, file: File): Observable<FileResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<FileResponse>(
      `${this.API_URL}/service-category/${serviceCategoryId}/upload`,
      formData
    );
  }

  /**
   * 1.2 Download ảnh Service Category (Public)
   */
  downloadServiceCategoryImage(fileId: string): Observable<Blob> {
    return this.http.get<Blob>(`${this.API_URL}/public/download/service-category/${fileId}`);
  }

  /**
   * 1.3 Xoá ảnh Service Category
   */
  deleteServiceCategoryImage(fileId: string): Observable<{ success: boolean; message: string; fileId: string }> {
    return this.http.delete<{ success: boolean; message: string; fileId: string }>(
      `${this.API_URL}/service-category/${fileId}`
    );
  }

  /**
   * 2.1 Upload ảnh Doctor
   */
  uploadDoctorImage(doctorId: string, file: File): Observable<FileResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<FileResponse>(
      `${this.API_URL}/doctor/${doctorId}/upload`,
      formData
    );
  }

  /**
   * 2.2 Download ảnh Doctor (Public)
   */
  downloadDoctorImage(fileId: string): Observable<Blob> {
    return this.http.get<Blob>(`${this.API_URL}/public/download/doctor/${fileId}`);
  }

  /**
   * 2.3 Xoá ảnh Doctor
   */
  deleteDoctorImage(fileId: string): Observable<{ success: boolean; message: string; fileId: string }> {
    return this.http.delete<{ success: boolean; message: string; fileId: string }>(
      `${this.API_URL}/doctor/${fileId}`
    );
  }
}
