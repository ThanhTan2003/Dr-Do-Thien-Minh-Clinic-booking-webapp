import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faLock } from '@fortawesome/free-solid-svg-icons';

library.add(faLock);

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  lastUsername = '';
  lastPassword = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  private detectMaliciousInput(input: string): boolean {
    const maliciousPatterns = /<script|onerror|onload|javascript:/i;
    return maliciousPatterns.test(input);
  }

  private handleInputChange(controlName: string, value: string): void {
    if (this.detectMaliciousInput(value)) {
      this.toastr.error('Phát hiện mã độc trong dữ liệu nhập. Vui lòng kiểm tra lại!');
      this.loginForm.get(controlName)?.setValue('');
      return;
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { userName, password } = this.loginForm.value;

      // Kiểm tra nếu username và password giống với lần trước đó
      if (userName === this.lastUsername && password === this.lastPassword) {
        this.toastr.error('Thông tin đăng nhập không đúng. Vui lòng kiểm tra lại!');
        return;
      }

      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          // Lấy redirectUrl từ query params
          const redirectUrl = this.route.snapshot.queryParamMap.get('redirectUrl') || '/admin';
          this.router.navigateByUrl(redirectUrl);
        },
        error: (error) => {
          console.error('Đăng nhập thất bại, lỗi:', error);
          // Cập nhật lại thông tin đăng nhập cuối cùng
          this.lastUsername = userName;
          this.lastPassword = password;
          this.toastr.error(error.error?.message || 'Thông tin đăng nhập không đúng. Vui lòng kiểm tra lại!');
          this.isLoading = false;
        }
      });
    } else {
      this.toastr.info('Vui lòng điền đầy đủ thông tin đăng nhập!');
    }
  }
}