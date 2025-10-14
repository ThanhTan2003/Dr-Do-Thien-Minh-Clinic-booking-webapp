import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalLoadingComponent } from '../../../../shared/components/modal-loading.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';
import { 
  faPhone,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import { ClinicService } from '../../../../shared/services/appointment/clinic.service';
import { Clinic } from '../../../../models/responses/appointment/clinic.model';

@Component({
  selector: 'app-booking-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalLoadingComponent, FontAwesomeModule]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;

  // Clinic information
  clinic: Clinic | null = null;
  clinicLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private clinicService: ClinicService,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadClinicInfo();
  }

  loadClinicInfo(): void {
    this.clinicLoading = true;
    this.clinicService.getClinicInfoPublicByCustomer().subscribe({
      next: (res: Clinic) => {
        this.clinic = res;
        this.clinicLoading = false;
      },
      error: () => {
        this.clinicLoading = false;
        // Fallback values if API fails
        this.clinic = {
          id: '',
          clinicName: '...',
          address: 'Chưa có thông tin',
          description: '',
          supportPhone: 'Chưa có thông tin'
        };
      }
    });
  }

  faPhone = faPhone;
  faMapMarkerAlt = faMapMarkerAlt;

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        if (res.authenticated) {
          const redirectUrl = this.route.snapshot.queryParamMap.get('redirectUrl') || '/booking';
          this.router.navigateByUrl(redirectUrl);
        } else {
          this.toastr.error('Đăng nhập thất bại!');
        }
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Thông tin đăng nhập không chính xác!');
        this.loading = false;
      }
    });
  }

  onLoginZalo(): void {
    this.loading = true;
    this.authService.login({ userName: 'admin', password: 'admin' }).subscribe({
      next: (res) => {
        if (res.authenticated) {
          const redirectUrl = this.route.snapshot.queryParamMap.get('redirectUrl') || '/booking';
          this.router.navigateByUrl(redirectUrl);
        } else {
          this.toastr.error('Đăng nhập thất bại!');
        }
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Đăng nhập qua Zalo không thành công!');
        this.loading = false;
      }
    });
  }
} 