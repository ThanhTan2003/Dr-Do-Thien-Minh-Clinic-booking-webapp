import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faPen, faCircleInfo, faCommentDots, faXmark } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZaloUserService } from '../../../../../shared/services/zalo_oa/user/zalo-user.service';
import { ZaloUserResponse } from '../../../../../models/responses/zalo_oa/user/zalo-user-response.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AdminModalConfirmComponent } from '../../../../shared/components/modal-confirm/admin-modal-confirm.component';
import { ZaloUserRequest } from '../../../../../models/requests/zalo_oa/user/zalo-user.request';

@Component({
  selector: 'app-zalo-oa-info',
  templateUrl: './zalo-oa-info.component.html',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, AdminModalConfirmComponent, FormsModule]
})
export class ZaloOaInfoComponent implements OnInit, OnDestroy {
  @Input() zaloUid: string | null = null;
  @Output() close = new EventEmitter<void>();

  faUser = faUser;
  faPen = faPen;
  faCircleInfo = faCircleInfo;
  faCommentDots = faCommentDots;
  faXmark = faXmark;

  user: ZaloUserResponse | null = null;
  loading: boolean = false;
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
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.zaloUid) {
      this.fetchUser();
    }
  }

  fetchUser(): void {
    if (!this.zaloUid) return;
    
    this.loading = true;
    this.zaloUserService.getById(this.zaloUid).pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
        // Update form data when user data is loaded
        this.formData = {
          userAlias: user.userAlias || '',
          phone: user.phone || '',
          nameSharedInfo: user.nameSharedInfo || '',
          address: user.address || ''
        };
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error('Không thể tải thông tin người dùng Zalo', 'Lỗi');
        console.error('Error loading Zalo user:', error);
      }
    });
  }

  onUpdateClick(): void {
    this.showConfirmModalUpdate = true;
  }

  onConfirmUpdate(): void {
    if (!this.user || !this.zaloUid) {
      console.warn('Không có thông tin người dùng để cập nhật.');
      return;
    }

    this.zaloUserService.update(this.zaloUid, this.formData).subscribe({
      next: (res) => {
        this.toastr.success('Cập nhật thông tin thành công', 'Thông báo');
        this.showConfirmModalUpdate = false;
        this.fetchUser();
      },
      error: (error) => {
        this.showConfirmModalUpdate = false;
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

  onClose(): void {
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
