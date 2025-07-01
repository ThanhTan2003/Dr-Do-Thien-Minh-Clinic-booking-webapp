import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalLoadingComponent } from '../../../../shared/components/modal-loading.component';


import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faPhone,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-booking-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalLoadingComponent, FontAwesomeModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  faPhone = faPhone;
  faMapMarkerAlt = faMapMarkerAlt;

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = null;
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        if (res.authenticated) {
          const redirectUrl = this.route.snapshot.queryParamMap.get('redirectUrl') || '/booking';
          this.router.navigateByUrl(redirectUrl);
        } else {
          this.error = 'Đăng nhập thất bại!';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Sai tài khoản hoặc mật khẩu!';
        this.loading = false;
      }
    });
  }

  onLoginZalo(): void {
    this.loading = true;
    this.error = null;
    this.authService.login({ userName: 'admin', password: 'admin' }).subscribe({
      next: (res) => {
        if (res.authenticated) {
          const redirectUrl = this.route.snapshot.queryParamMap.get('redirectUrl') || '/booking';
          this.router.navigateByUrl(redirectUrl);
        } else {
          this.error = 'Đăng nhập thất bại!';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Sai tài khoản hoặc mật khẩu!';
        this.loading = false;
      }
    });
  }
} 