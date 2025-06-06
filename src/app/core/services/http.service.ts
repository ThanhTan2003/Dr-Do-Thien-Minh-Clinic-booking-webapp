import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    console.log('[HttpService] Đã khởi tạo (constructor)');
   }

  private getHeaders(url: string): HttpHeaders {
    // Không thêm Authorization ở đây nữa!
    return new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
  }

  get<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${url}`, {
      headers: this.getHeaders(url),
      params
    });
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${url}`, body, {
      headers: this.getHeaders(url)
    });
  }

  put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${url}`, body, {
      headers: this.getHeaders(url)
    });
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${url}`, {
      headers: this.getHeaders(url)
    });
  }

  patch<T>(url: string, body: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${url}`, body, {
      headers: this.getHeaders(url)
    });
  }
} 