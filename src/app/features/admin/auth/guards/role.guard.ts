// Code for production
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const allowedRoles = route.data['roles'] as string[];
    console.log("allowedRoles: ", allowedRoles);
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/admin/login']);
      return false;
    }
    try {
      console.log("Kiem tra vai tro nguoi dung ở RoleGuard");
      const user = await firstValueFrom(this.authService.getUserInfo());
      if (!user || !allowedRoles.includes(user.roleId)) {
        this.router.navigate(['/admin/home']);
        return false;
      }
      return true;
    } catch {
      console.log("Khong tim thay user");
      this.router.navigate(['/admin/login']);
      return false;
    }
  }
}

// Kiểm tra vai trò người dùng (admin, medical-staff, media-staff) để đảm bảo họ có quyền truy cập route.