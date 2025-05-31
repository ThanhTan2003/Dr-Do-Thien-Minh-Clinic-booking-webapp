import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthenticationService } from '../../../shared/services/identity/authentication.service';
import { UserService } from '../../../shared/services/identity/user.service';
import { AuthenticationRequest } from '../../../models/requests/identity/authentication.request';
import { AuthenticationResponse } from '../../../models/responses/identity/authentication.response';
import { UserResponse } from '../../../models/responses/identity/user.response';
import { LocalStorageService } from '../../../../core/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private localStorageService: LocalStorageService,
  ) {}

  login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    //console.log("Dang nhap");
    return this.authService.logIn(request).pipe(
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
    //console.log("Lay thong tin nguoi dung 1");
    return this.userService.getInfo().pipe(
      tap(user => console.log("user: ", user.roleName))
    );
  }

  refreshToken(): Observable<AuthenticationResponse> {
    console.log("Refresh token...");
    const refreshToken = this.localStorageService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token');
    }
    return this.authService.refresh({ token: refreshToken }).pipe(
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