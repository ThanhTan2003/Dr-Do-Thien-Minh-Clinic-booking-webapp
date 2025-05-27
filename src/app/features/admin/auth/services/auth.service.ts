import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthenticationService } from '../../../shared/services/identity/authentication.service';
import { UserService } from '../../../shared/services/identity/user.service';
import { AuthenticationRequest } from '../../../models/requests/identity/authentication.request';
import { AuthenticationResponse } from '../../../models/responses/identity/authentication.response';
import { UserResponse } from '../../../models/responses/identity/user.response';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { TokenRefreshService } from './token-refresh.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private tokenRefreshService: TokenRefreshService
  ) {}

  login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    console.log("Dang nhap");
    return this.authService.logIn(request).pipe(
      tap(response => {
        if (response.authenticated) {
          this.localStorageService.setAccessToken(response.accessToken);
          this.localStorageService.setRefreshToken(response.refreshToken);
          // Bắt đầu timer refresh token sau khi đăng nhập thành công
          this.tokenRefreshService.startRefreshTokenTimer();
        }
      })
    );
  }

  logout(): void {
    const token = this.localStorageService.getAccessToken();
    if (token) {
      this.authService.logOut({ token }).subscribe(() => {
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
    // Dừng timer refresh token khi đăng xuất
    this.tokenRefreshService.stopRefreshTokenTimer();
  }

  isAuthenticated(): boolean {
    return !!this.localStorageService.getAccessToken();
  }

  // getUserInfo(): Observable<UserResponse> {
  //   console.log("Lay thong tin nguoi dung 1");
  //   const user = this.userService.getInfo();
  //   console.log("user: ", user.roleName);
  //   return user;
  // }

  getUserInfo(): Observable<UserResponse> {
    console.log("Lay thong tin nguoi dung 1");
    return this.userService.getInfo().pipe(
      tap(user => console.log("user: ", user.roleName))
    );
  }
}

// Xử lý logic xác thực (đăng nhập, đăng xuất).
// Lưu trữ token và quản lý trạng thái người dùng (sử dụng BehaviorSubject thay vì localStorage cho userRole và userName).
// Gọi API để lấy thông tin người dùng sau khi đăng nhập.