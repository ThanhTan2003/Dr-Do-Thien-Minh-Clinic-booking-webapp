import { Component, OnDestroy, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ZaloUserService } from '../../../../../../shared/services/zalo_oa/user/zalo-user.service';
import { ZaloUserResponse } from '../../../../../../models/responses/zalo_oa/user/zalo-user-response.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-zalo-information',
  templateUrl: './zalo-information.component.html',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule]
})
export class ZaloInformationComponent implements OnInit, OnDestroy {
  faUser = faUser;
  userId: string | null = null;
  user: ZaloUserResponse | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private zaloUserService: ZaloUserService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.userId = params.get('userId');
      if (this.userId) {
        this.fetchUser();
      }
    });
  }

  fetchUser(): void {
    if (!this.userId) return;
    
    this.zaloUserService.getById(this.userId).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (error) => {
        this.toastr.error('Không thể tải thông tin người dùng Zalo', 'Lỗi');
        console.error('Error loading Zalo user:', error);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
} 