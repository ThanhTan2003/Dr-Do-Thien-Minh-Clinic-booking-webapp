import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Service quản lý Access Token trong memory (runtime)
 * ✅ Best Practice: Access Token không lưu trong localStorage
 */
@Injectable({
  providedIn: 'root'
})
export class TokenService {
  // Lưu Access Token trong memory
  private accessToken: string | null = null;
  
  // Observable để theo dõi trạng thái token
  private accessToken$ = new BehaviorSubject<string | null>(null);

  constructor() {
    console.log('[TokenService] Khởi tạo - Token lưu trong memory');
  }

  /**
   * Lưu Access Token vào memory
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
    this.accessToken$.next(token);
    console.log('[TokenService] Access Token đã được lưu trong memory');
  }

  /**
   * Lấy Access Token từ memory
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Observable để subscribe thay đổi token
   */
  getAccessToken$(): Observable<string | null> {
    return this.accessToken$.asObservable();
  }

  /**
   * Xóa Access Token khỏi memory
   */
  clearAccessToken(): void {
    this.accessToken = null;
    this.accessToken$.next(null);
    console.log('[TokenService] Access Token đã bị xóa khỏi memory');
  }

  /**
   * Kiểm tra có token không
   */
  hasToken(): boolean {
    return this.accessToken !== null && this.accessToken.length > 0;
  }
}