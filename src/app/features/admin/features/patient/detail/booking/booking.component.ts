import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NavigationEnd } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faUserMd, 
  faClipboardList } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, RouterOutlet]
})
export class BookingComponent implements OnInit, OnDestroy {
  selectedBookingType: any = null;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  faUserMd = faUserMd;
  faClipboardList = faClipboardList;

  bookingTypes = 
  [
    {
      icon: faUserMd,
      path: 'kham-theo-bac-si',
      label: 'Khám theo bác sĩ', 
      value: 'Khám theo bác sĩ'
    },
    {
      icon: faClipboardList,
      path: 'kham-theo-dich-vu',
      label: 'Khám theo dịch vụ', 
      value: 'Khám theo dịch vụ'
    }
  ];

  ngOnInit() {
    // Lắng nghe router events để cập nhật selectedBookingType
    this.router.events
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.updateSelectedBookingType();
        }
      });

    // Kiểm tra path hiện tại hoặc navigate to default nếu chưa có path con
    const currentPath = this.currentLastPathSegment;
    const foundBookingType = this.bookingTypes.find(type => type.path === currentPath);
    
    if (foundBookingType) {
      // Nếu đã có path hợp lệ, chỉ set selectedBookingType
      this.selectedBookingType = foundBookingType;
    } else {
      // Nếu chưa có path con hoặc path không hợp lệ, navigate to default
      this.router.navigate(['kham-theo-bac-si'], { relativeTo: this.route });
      this.selectedBookingType = this.bookingTypes[0]; // Default to first option
    }
  }

  get currentLastPathSegment(): string {
    const path = this.location.path();
    const segments = path.split('/');
    // Lấy segment cuối cùng trong URL
    return segments.length > 0 ? segments[segments.length - 1] : '';
  }

  updateSelectedBookingType() {
    const currentPath = this.currentLastPathSegment;
    this.selectedBookingType = this.bookingTypes.find(type => type.path === currentPath);
  }

  goTo(path: string) {
    this.router.navigate([path], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
} 