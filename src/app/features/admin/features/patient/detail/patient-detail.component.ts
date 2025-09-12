import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faHistory, faUserGroup, faNoteSticky, faFileMedical } from '@fortawesome/free-solid-svg-icons';
import { PatientInformationComponent } from './patient-information/patient-information.component';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, RouterOutlet, PatientInformationComponent]
})
export class PatientDetailComponent implements OnInit {
  patientId: string | null = null;
  userId: string | null = null;
  private destroy$ = new Subject<void>();

  faArrowLeft = faArrowLeft;
  faHistory = faHistory;
  faUserGroup = faUserGroup;
  faNoteSticky = faNoteSticky;
  faFileMedical = faFileMedical;
  tabs = [
    {
      label: 'THÔNG TIN ZALO',
      path: 'thong-tin-zalo',
      icon: this.faFileMedical
    },
    {
      label: 'NHÓM ĐỐI TƯỢNG',
      path: 'nhom-doi-tuong',
      icon: this.faUserGroup
    },
    {
      label: 'GHI CHÚ',
      path: 'ghi-chu',
      icon: this.faNoteSticky
    },
    {
      label: 'LỊCH SỬ KHÁM BỆNH',
      path: 'lich-su-kham-benh',
      icon: this.faHistory
    }
  ];

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.patientId = params.get('patientId');
      this.userId = params.get('userId');
      if (this.patientId && this.userId) {
        // Kiểm tra xem có route con nào đang active không
        const currentPath = this.router.url.split('/').pop();
        const isValidPath = this.tabs.some(tab => tab.path === currentPath);
        if (!currentPath || !isValidPath) {
          this.goTo('thong-tin-zalo');
        }
      }
    });
  }

  ngAfterViewInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goBack(): void {
    // Lấy các tham số tìm kiếm từ localStorage
    const searchParamsStr = localStorage.getItem('patientListSearchParams');
    
    if (searchParamsStr) {
      try {
        const searchParams = JSON.parse(searchParamsStr);
        
        // Quay về list page với các tham số tìm kiếm đã lưu
        this.router.navigate(['/admin/benh-nhan/danh-sach'], {
          queryParams: searchParams
        });
        
        // Xóa localStorage sau khi sử dụng
        localStorage.removeItem('patientListSearchParams');
      } catch (error) {
        console.error('Error parsing search params:', error);
        // Fallback: quay về list page mặc định
        this.router.navigate(['/admin/benh-nhan/danh-sach']);
      }
    } else {
      // Fallback: quay về list page mặc định
      this.router.navigate(['/admin/benh-nhan/danh-sach']);
    }
  }

  goTo(path: string) {
    this.router.navigate([path], { relativeTo: this.route });
  }

  isActive(path: string): boolean {
    return this.router.url.includes(path);
  }
} 