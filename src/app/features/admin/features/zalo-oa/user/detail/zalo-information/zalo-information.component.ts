import { Component, OnDestroy, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faPen, faCircleInfo, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ZaloUserService } from '../../../../../../shared/services/zalo_oa/user/zalo-user.service';
import { ZaloUserResponse } from '../../../../../../models/responses/zalo_oa/user/zalo-user-response.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AdminModalConfirmComponent } from '../../../../../shared/components/modal-confirm/admin-modal-confirm.component';
import { ZaloUserRequest } from '../../../../../../models/requests/zalo_oa/user/zalo-user.request';

@Component({
  selector: 'app-zalo-information',
  templateUrl: './zalo-information.component.html',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, AdminModalConfirmComponent, FormsModule]
})
export class ZaloInformationComponent implements OnInit, OnDestroy {
  faUser = faUser;
  faPen = faPen;
  faCircleInfo = faCircleInfo;
  faCommentDots = faCommentDots;

  userId: string | null = null;
  user: ZaloUserResponse | null = null;
  private destroy$ = new Subject<void>();
  showConfirmModalUpdate = false;

  // Form data
  formData: ZaloUserRequest = {
    userAlias: '',
    phone: '',
    nameSharedInfo: '',
    address: ''
  };

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
        // Update form data when user data is loaded
        this.formData = {
          userAlias: user.userAlias || '',
          phone: user.phone || '',
          nameSharedInfo: user.nameSharedInfo || '',
          address: user.address || ''
        };
      },
      error: (error) => {
        this.toastr.error('Không thể tải thông tin người dùng Zalo', 'Lỗi');
        console.error('Error loading Zalo user:', error);
      }
    });
  }

  onUpdateClick(): void {
    this.showConfirmModalUpdate = true;
  }

  onConfirmUpdate(): void {
    if (!this.user || !this.userId) {
      console.warn('Không có thông tin người dùng để cập nhật.');
      return;
    }

    console.log('Bắt đầu cập nhật thông tin người dùng với ID:', this.userId);
    console.log('Request:', this.formData);

    this.zaloUserService.update(this.userId, this.formData).subscribe({
      next: (res) => {
        console.log('Cập nhật thành công. Response:', res);
        this.toastr.success('Cập nhật thông tin thành công', 'Thông báo');
        this.showConfirmModalUpdate = false;
        this.fetchUser();
      },
      error: (error) => {
        this.showConfirmModalUpdate = false;
        console.error('Lỗi khi cập nhật thông tin:', error);

        if (error.status === 500 && error.error?.message) {
          this.toastr.error(error.error.message, 'Lỗi');
        } else {
          this.toastr.error('Không thể cập nhật thông tin', 'Lỗi');
        }
      }
    });
  }

  onCancelUpdate(): void {
    this.showConfirmModalUpdate = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
} 