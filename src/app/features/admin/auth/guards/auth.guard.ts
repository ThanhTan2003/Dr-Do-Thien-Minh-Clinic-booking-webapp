// Code for production
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/admin/login']);
    return false;
  }
}

// Kiểm tra xem người dùng đã đăng nhập (có token trong localStorage) trước khi truy cập một route.
// Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập (/login).

// Cách hoạt động:
// AuthGuard triển khai interface CanActivate, trả về true (cho phép truy cập) hoặc false (chặn truy cập).
// Gọi AuthService.isLoggedIn() để kiểm tra trạng thái đăng nhập.
// Nếu không đăng nhập, sử dụng Router để chuyển hướng.