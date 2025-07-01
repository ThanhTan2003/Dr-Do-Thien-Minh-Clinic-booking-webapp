import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles = route.data['roles'] as string[];
    // Nếu chưa đăng nhập thì chuyển về login
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/booking/login']);
      return false;
    }
    // Nếu có nhiều role về sau, có thể lấy role từ localStorage hoặc token
    // Ở đây chỉ có 1 role nên luôn trả về true
    return true;
  }
}
