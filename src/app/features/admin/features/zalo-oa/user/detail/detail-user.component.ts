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
  ) {}

  userId: string | null = null;
  private destroy$ = new Subject<void>();

  faArrowLeft = faArrowLeft;
  faHistory = faHistory;
  faUserGroup = faUserGroup;
  faNoteSticky = faNoteSticky;
  faFileMedical = faFileMedical;
  tabs = [
    {
      label: 'NHÓM ĐỐI TƯỢNG',
      path: 'nhom-doi-tuong',
      icon: this.faUserGroup
    },
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
        this.goTo('nhom-doi-tuong');
      }
    });
  }

  ngAfterViewInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn mượt về đầu trang
  }

  goBack(): void {
    this.router.navigate(['/admin/zalo-oa/nguoi-dung']);
  }

  goTo(path: string) {
    this.router.navigate([path], { relativeTo: this.route });
  }

  isActive(path: string): boolean {
    // Kiểm tra route con hiện tại có khớp với tab không
    return this.router.url.includes(path);
  }

  ngDestroy(): void {
    
  }
} 