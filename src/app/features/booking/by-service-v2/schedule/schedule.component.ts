import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { ServiceScheduleService } from '../../../shared/services/medical/service-schedule.service';
import { DoctorServiceService } from '../../../shared/services/doctor/doctor-service.service';
import { Holiday } from '../../../shared/services/doctor/holiday.service';
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
  timeFrameId: string | null = null;
  availableDays: string[] = [];
  loading = true;

  // Dữ liệu ngày lễ - sẽ được load từ API
  // holidayMatrix: [number, number][] = [[1, 1], [30, 4], [2, 9]];
  specificHolidays: string[] = [];

  faArrowLeft = faArrowLeft;

  private destroy$ = new Subject<void>();

  constructor(
    private scheduleService: ServiceScheduleService,
    private doctorServiceService: DoctorServiceService,
    private holidayService: Holiday,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    console.log('ScheduleComponent initialized');
    this.serviceId = this.route.snapshot.paramMap.get('serviceId');
    console.log('serviceIdngOnInit ', this.serviceId);
    this.timeFrameId = this.route.snapshot.paramMap.get('timeFrameId');
    if (this.serviceId) {
      this.fetchAvailableDays();
      this.fetchHolidays();
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

  fetchHolidays(): void {
    this.holidayService
      .getUpcomingHolidays()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (holidays) => {
          // Convert Date objects to string format
          this.specificHolidays = holidays.map(date => {
            const d = new Date(date);
            return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
          });
          console.log('Holidays loaded:', this.specificHolidays);
        },
        error: (err) => {
          console.error('Error fetching holidays:', err);
        },
      });
  }

  handleDateTimeSelection(date: string, timeFrameId: string): void {
    console.log('serviceId lúc gửi đi', this.serviceId);
    console.log('timeFrameId', timeFrameId);
    console.log('date', date);
    console.log('handleDateTimeSelection');
    if (this.serviceId) {
      this.router.navigate(
        [timeFrameId, date],
        { relativeTo: this.route }
      );
    }
  }

  goBack(): void {
    this.location.back();
  }
}