import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthenticationService } from '../../../shared/services/identity/authentication.service';
import { AccountService } from '../../../shared/services/identity/account.service';
import { AuthenticationRequest } from '../../../models/requests/identity/authentication.request';
import { AuthenticationResponse } from '../../../models/responses/identity/authentication.response';
import { AccountResponse } from '../../../models/responses/identity/account/account.response';
import { LocalStorageService } from '../../../../core/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private authService: AuthenticationService,
    private accountService: AccountService,
    private router: Router,
    private localStorageService: LocalStorageService,
  ) {}

  login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.authService.login(request).pipe(
      tap(response => {
        if (response.authenticated) {
          this.localStorageService.setAccessToken(response.accessToken);
          this.localStorageService.setRefreshToken(response.refreshToken);
        }
      })
    );
  }

  logout(): void {
    const token = this.localStorageService.getAccessToken();
    if (token) {
      this.authService.logout({ token }).subscribe(() => {
        this.clearAuthData();
        this.router.navigate(['/admin/login']);
      });
    } else {
      this.clearAuthData();
      this.router.navigate(['/admin/login']);
    }
  }

  private clearAuthData(): void {
    this.localStorageService.removeAccessToken();
    this.localStorageService.removeRefreshToken();
  }

  isAuthenticated(): boolean {
    return !!this.localStorageService.getAccessToken();
  }

  getAccountInfo(): Observable<AccountResponse> {
    return this.accountService.getMyInfo().pipe(
      tap(account => console.log("account: ", account.roleResponse.name))
    );
  }

  refreshToken(): Observable<AuthenticationResponse> {
    console.log("Refresh token...");
    const refreshToken = this.localStorageService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token');
    }
    return this.authService.refreshToken({ token: refreshToken }).pipe(
      tap(response => {
        if (response.authenticated) {
          this.localStorageService.setAccessToken(response.accessToken);
          this.localStorageService.setRefreshToken(response.refreshToken);
        }
      })
    );
  }
}

// Xử lý logic xác thực (đăng nhập, đăng xuất).
// Lưu trữ token và quản lý trạng thái người dùng (sử dụng BehaviorSubject thay vì localStorage cho userRole và userName).
// Gọi API để lấy thông tin người dùng sau khi đăng nhập.