import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ZaloInformationComponent } from './zalo-information/zalo-information.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faHistory, faUserGroup, faNoteSticky, faFileMedical } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    RouterOutlet,
    ZaloInformationComponent,
    FontAwesomeModule]
})
export class DetailUserComponent implements OnInit {
  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  userId: string | null = null;
  private destroy$ = new Subject<void>();

  faArrowLeft = faArrowLeft;
  faHistory = faHistory;
  faUserGroup = faUserGroup;
  faNoteSticky = faNoteSticky;
  faFileMedical = faFileMedical;
  tabs = [
    // {
    //   label: 'NHÓM ĐỐI TƯỢNG',
    //   path: 'nhom-doi-tuong',
    //   icon: this.faUserGroup
    // },
    {
      label: 'GHI CHÚ',
      path: 'ghi-chu',
      icon: this.faNoteSticky
    },
    {
      label: 'HỒ SƠ KHÁM BỆNH',
      path: 'ho-so-kham-benh',
      icon: this.faFileMedical
    },
    {
      label: 'LỊCH SỬ KHÁM BỆNH',
      path: 'lich-su-kham-benh',
      icon: this.faHistory
    }
  ];

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.userId = params.get('userId');
      if (this.userId) {
        // Kiểm tra xem có route con nào đang active không
        const currentPath = this.router.url.split('/').pop();
        const isValidPath = this.tabs.some(tab => tab.path === currentPath);

        // Nếu không có route con nào active hoặc route không hợp lệ, mới chuyển về tab mặc định
        if (!currentPath || !isValidPath) {
          this.goTo('ghi-chu');
        }
      }
    });
  }

  ngAfterViewInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn mượt về đầu trang
  }

  goBack(): void {
    // this.router.navigate(['/admin/zalo-oa/nguoi-dung']);
    // this.location.back();
    // Lấy các tham số tìm kiếm từ localStorage
    const searchParamsStr = localStorage.getItem('userListSearchParams');

    if (searchParamsStr) {
      try {
        const searchParams = JSON.parse(searchParamsStr);

        // Quay về list page với các tham số tìm kiếm đã lưu
        this.router.navigate(['/admin/zalo-oa/nguoi-dung'], {
          queryParams: searchParams
        });

        // Xóa localStorage sau khi sử dụng
        localStorage.removeItem('userListSearchParams');
      } catch (error) {
        console.error('Error parsing search params:', error);
        // Fallback: quay về list page mặc định
        this.router.navigate(['/admin/zalo-oa/nguoi-dung']);
      }
    } else {
      // Fallback: quay về list page mặc định
      this.router.navigate(['/admin/zalo-oa/nguoi-dung']);
    }
  }

  getTabHref(path: string): string {
    const currentUrl = this.router.url;
    const baseUrl = currentUrl.split('/').slice(0, -1).join('/');
    return `${baseUrl}/${path}`;
  }

  goTo(path: string, event?: Event) {
    // Chỉ prevent default và navigate nếu là left click (không có modifier keys)
    if (event) {
      const mouseEvent = event as MouseEvent;
      if (!mouseEvent.ctrlKey && !mouseEvent.metaKey && !mouseEvent.shiftKey) {
        event.preventDefault();
        this.router.navigate([path], { relativeTo: this.route });
      }
    } else {
      this.router.navigate([path], { relativeTo: this.route });
    }
  }

  isActive(path: string): boolean {
    // Kiểm tra route con hiện tại có khớp với tab không
    return this.router.url.includes(path);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
} 