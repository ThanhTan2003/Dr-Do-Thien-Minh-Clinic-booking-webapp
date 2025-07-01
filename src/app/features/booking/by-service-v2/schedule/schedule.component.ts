import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { DoctorScheduleService } from '../../../shared/services/doctor/doctor-schedule.service';
import { DoctorServiceService } from '../../../shared/services/doctor/doctor-service.service';
import { SelectDateComponent } from './date-select.component';
import { Subject, takeUntil } from 'rxjs';
import { Location } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SelectDateComponent, FontAwesomeModule],
})
export class ScheduleComponent implements OnInit, OnDestroy {
  serviceId: string | null = null;
  doctorScheduleId: string | null = null;
  availableDays: string[] = [];
  loading = true;

  // Dữ liệu ngày lễ
  holidayMatrix: [number, number][] = [[1, 1], [30, 4], [2, 9]];
  specificHolidays: string[] = ['2024/12/30', '2025/09/03'];

  faArrowLeft = faArrowLeft;

  private destroy$ = new Subject<void>();

  constructor(
    private scheduleService: DoctorScheduleService,
    private doctorServiceService: DoctorServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    console.log('ScheduleComponent initialized');
    this.serviceId = this.route.snapshot.paramMap.get('serviceId');
    console.log('serviceIdngOnInit ', this.serviceId);
    this.doctorScheduleId = this.route.snapshot.paramMap.get('doctorScheduleId');
    if (this.serviceId) {
      this.fetchAvailableDays();
      //this.fetchDoctor();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchAvailableDays(): void {
    if (!this.serviceId) return;

    this.loading = true;
    this.scheduleService
      .getListDayOfWeekByService(this.serviceId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (days) => {
          this.availableDays = days;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching available days:', err);
          this.loading = false;
        },
      });
  }

  // fetchDoctor(): void {
  //   if (!this.doctorServiceId) return;

  //   this.doctorServiceService
  //     .getById(this.doctorServiceId)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (service) => {
  //         this.doctorId = service.doctorId;
  //       },
  //       error: (err) => {
  //         console.error('Error fetching doctor:', err);
  //       },
  //     });
  // }

  handleDateTimeSelection(date: string, doctorScheduleId: string): void {
    console.log('serviceId lúc gửi đi', this.serviceId);
    console.log('doctorScheduleId', doctorScheduleId);
    console.log('date', date);
    console.log('handleDateTimeSelection');
    if (this.serviceId) {
      this.router.navigate(
        [doctorScheduleId, date],
        { relativeTo: this.route }
      );
    }
  }

  goBack(): void {
    this.location.back();
  }
}