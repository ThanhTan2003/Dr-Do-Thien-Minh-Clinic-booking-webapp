import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Dịch vụ xác thực
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html'
})
export class LogoutComponent implements OnInit {
  constructor(
    private authService: AuthService, // Inject AuthService để gọi phương thức logout
    private router: Router // Inject Router để điều hướng
  ) {}

  // Tự động gọi khi component được khởi tạo
  ngOnInit() {
    this.authService.logout(); // Xóa token và trạng thái người dùng
    this.router.navigate(['/login']); // Chuyển hướng về trang đăng nhập
  }
}