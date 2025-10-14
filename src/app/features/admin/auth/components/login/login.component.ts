import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faLock, faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

library.add(faLock, faUser, faEye, faEyeSlash);

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
  showPassword = false;

  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;

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
    // Kiểm tra XSS patterns
    const xssPatterns = /<script|onerror|onload|javascript:|alert\(|<img|<\/script>/i;
    // Kiểm tra SQL injection patterns
    const sqlPatterns = /('|--|;|\/\*|\*\/|@@|char|nchar|varchar|nvarchar|alter|begin|cast|create|cursor|declare|delete|drop|end|exec|execute|fetch|insert|kill|open|select|sys|table|update|union|waitfor|delay)/i;
    // Các patterns tấn công khác (ví dụ: command injection, path traversal)
    const otherPatterns = /(\.\.\/|;|&&|\||`|\$\(|<|>|\(|\)|{|})/;

    return xssPatterns.test(input) || sqlPatterns.test(input);
    // return xssPatterns.test(input) || sqlPatterns.test(input) || otherPatterns.test(input);
  }

  onInputChange(controlName: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (this.detectMaliciousInput(value)) {
      this.toastr.error('Phát hiện mã độc hoặc ký tự không hợp lệ trong dữ liệu nhập. Vui lòng kiểm tra lại!');
      // this.loginForm.get(controlName)?.setValue('');
      return;
    }
  }

  onUsernameKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault(); // Ngăn hành vi mặc định nếu cần
      this.passwordInput.nativeElement.focus();
    }
  }

  onPasswordKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onSubmit();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { userName, password } = this.loginForm.value;

      // Kiểm tra thêm lần nữa trước khi submit
      if (this.detectMaliciousInput(userName) || this.detectMaliciousInput(password)) {
        this.toastr.error('Dữ liệu nhập chứa ký tự không hợp lệ!');
        return;
      }

      if (userName === this.lastUsername && password === this.lastPassword) {
        this.toastr.error('Thông tin đăng nhập không đúng. Vui lòng kiểm tra lại!');
        return;
      }

      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          const redirectUrl = this.route.snapshot.queryParamMap.get('redirectUrl') || '/admin';
          this.router.navigateByUrl(redirectUrl);
        },
        error: (error) => {
          console.error('Đăng nhập thất bại, lỗi:', error);
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