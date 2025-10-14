import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { EditDoctorInfoComponent } from './edit-doctor-info/edit-doctor-info.component';
import { Location } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFileMedical, faArrowLeft, faCalendarDays, faStethoscope, faUmbrellaBeach, faHistory } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-edit-doctor',
  standalone: true, // Đánh dấu component là standalone
  imports: [
    CommonModule, 
    FormsModule, 
    FontAwesomeModule, 
    RouterOutlet,
    // Import các component con để sử dụng trong template
    EditDoctorInfoComponent,
    FontAwesomeModule
  ],
  templateUrl: './edit-doctor.component.html'
})
export class EditDoctorComponent implements OnInit, OnDestroy {
  faArrowLeft = faArrowLeft;
  doctorId: string | null = null;
  private destroy$ = new Subject<void>();

  faFileMedical = faFileMedical;
  faCalendarDays = faCalendarDays;
  faStethoscope = faStethoscope;
  faUmbrellaBeach = faUmbrellaBeach;
  faHistory = faHistory;
  
  tabs = [
    {
      label: 'DỊCH VỤ KHÁM BỆNH',
      path: 'dich-vu-kham-benh',
      icon: this.faFileMedical,
    },
    {
      label: 'LỊCH NHẬN KHÁM',
      path: 'lich-nhan-kham',
      icon: this.faCalendarDays,
    },
    {
      label: 'LỊCH KHÁM THEO NGÀY',
      path: 'lich-kham-theo-ngay',
      icon: this.faStethoscope,
    },
    {
      label: 'NGHỈ PHÉP',
      path: 'nghi-phep',
      icon: this.faUmbrellaBeach,
    },
    {
      label: 'LỊCH SỬ KHÁM',
      path: 'lich-su-kham-benh',
      icon: faHistory,
    }
  ];
  

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute
  ) {}



  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.doctorId = params.get('doctorId');
      if (this.doctorId) {
        // Lấy path cuối cùng, loại bỏ query string nếu có
        let currentPath = this.router.url.split('/').pop() || '';
        if (currentPath.includes('?')) {
          currentPath = currentPath.split('?')[0];
        }
        const isValidPath = this.tabs.some(tab => tab.path === currentPath);

        if (!currentPath || !isValidPath) {
          this.goTo('dich-vu-kham-benh');
        }
      }
    });
  }

  ngAfterViewInit(): void {
    console.log("list-doctor-crud.component ngAfterViewInit....................");
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn mượt về đầu trang
  }

  goBack(): void {
    // Lấy các tham số tìm kiếm từ localStorage
    const searchParamsStr = localStorage.getItem('doctorListSearchParams');
    
    if (searchParamsStr) {
      try {
        const searchParams = JSON.parse(searchParamsStr);
        
        // Quay về list page với các tham số tìm kiếm đã lưu
        this.router.navigate(['/admin/bac-si/danh-sach'], {
          queryParams: searchParams
        });
        
        // Xóa localStorage sau khi sử dụng
        localStorage.removeItem('doctorListSearchParams');
      } catch (error) {
        console.error('Error parsing search params:', error);
        // Fallback: quay về list page mặc định
        this.router.navigate(['/admin/bac-si/danh-sach']);
      }
    } else {
      // Fallback: quay về list page mặc định
      this.router.navigate(['/admin/bac-si/danh-sach']);
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
    console.log("edit-doctor.component ngOnDestroy....................");
    this.destroy$.next();
    this.destroy$.complete();
  }
}