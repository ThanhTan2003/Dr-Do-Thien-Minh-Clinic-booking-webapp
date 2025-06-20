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
export class EditDoctorComponent implements OnInit {
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
      label: 'LỊCH LÀM VIỆC',
      path: 'lich-kham',
      icon: this.faCalendarDays,
    },
    {
      label: 'LỊCH KHÁM THEO NGÀY',
      path: 'kham-theo-ngay',
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
        // Kiểm tra xem có route con nào đang active không
        const currentPath = this.router.url.split('/').pop();
        const isValidPath = this.tabs.some(tab => tab.path === currentPath);
        
        // Nếu không có route con nào active hoặc route không hợp lệ, mới chuyển về tab mặc định
        if (!currentPath || !isValidPath) {
          this.goTo('dich-vu-kham-benh');
        }
      }
      // if (this.doctorId) {
      //   this.goTo('dich-vu-kham-benh');
      // }
    });
  }

  ngAfterViewInit(): void {
    console.log("list-doctor-crud.component ngAfterViewInit....................");
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn mượt về đầu trang
  }

  goBack(): void {
    this.router.navigate(['/admin/bac-si/danh-sach']);
  }

  goTo(path: string) {
    this.router.navigate([path], { relativeTo: this.route });
  }

  isActive(path: string): boolean {
    // Kiểm tra route con hiện tại có khớp với tab không
    return this.router.url.includes(path);
  }

  ngDestroy(): void {
    console.log("edit-doctor.component ngDestroy....................");
  }
}