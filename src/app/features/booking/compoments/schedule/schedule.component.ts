import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { DoctorScheduleService } from '../../../shared/services/doctor/doctor-schedule.service';
import { DoctorServiceService } from '../../../shared/services/doctor/doctor-service.service';
import { Holiday } from '../../../shared/services/doctor/holiday.service';
import { DoctorLeave } from '../../../shared/services/doctor/doctor-leave.service';
import { SelectDateComponent } from './date-select.component';
import { Subject, takeUntil, forkJoin } from 'rxjs';
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
  doctorServiceId: string | null = null;
  doctorScheduleId: string | null = null;
  availableDays: string[] = [];
  doctorId: string | null = null;
  loading = true;

  // Dữ liệu ngày lễ - sẽ được load từ API
  // holidayMatrix: [number, number][] = [[1, 1], [30, 4], [2, 9]];
  holidayMatrix: [number, number][] = [];
  specificHolidays: string[] = []; // Tổng hợp của holidays + doctorLeaves
  private holidays: string[] = []; // Chỉ chứa ngày nghỉ lễ
  private doctorLeaves: string[] = []; // Chỉ chứa ngày nghỉ phép bác sĩ

  faArrowLeft = faArrowLeft;

  private destroy$ = new Subject<void>();

  constructor(
    private scheduleService: DoctorScheduleService,
    private doctorServiceService: DoctorServiceService,
    private holidayService: Holiday,
    private doctorLeaveService: DoctorLeave,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    console.log('ScheduleComponent initialized');
    
    this.doctorServiceId = this.route.snapshot.paramMap.get('doctorServiceId');
    this.doctorScheduleId = this.route.snapshot.paramMap.get('doctorScheduleId');
    if (this.doctorServiceId) {
      this.fetchAvailableDays();
      this.fetchDoctor();
      this.fetchHolidays();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchAvailableDays(): void {
    if (!this.doctorServiceId) return;

    this.loading = true;
    this.scheduleService
      .getListDayOfWeekByDoctorService(this.doctorServiceId)
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

  fetchDoctor(): void {
    if (!this.doctorServiceId) return;

    this.doctorServiceService
      .getById(this.doctorServiceId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (service) => {
          this.doctorId = service.doctorId;
          // Sau khi có doctorId, fetch doctor leaves
          if (this.doctorId) {
            this.fetchDoctorLeaves();
          }
        },
        error: (err) => {
          console.error('Error fetching doctor:', err);
        },
      });
  }

  fetchHolidays(): void {
    this.holidayService
      .getUpcomingHolidays()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (holidays) => {
          // Convert Date objects to string format
          this.holidays = holidays.map(date => {
            const d = new Date(date);
            return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
          });
          console.log('Holidays loaded:', this.holidays);
          this.updateSpecificHolidays();
        },
        error: (err) => {
          console.error('Error fetching holidays:', err);
        },
      });
  }

  fetchDoctorLeaves(): void {
    if (!this.doctorId) return;

    this.doctorLeaveService
      .getUpcomingDoctorLeaves(this.doctorId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (leaves) => {
          this.doctorLeaves = leaves.map(date => {
            const d = new Date(date);
            return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
          });
          console.log('Doctor leaves loaded:', this.doctorLeaves);
          this.updateSpecificHolidays();
        },
        error: (err) => {
          console.error('Error fetching doctor leaves:', err);
        },
      });
  }

  private sortByYmd(dates: string[]): string[] {
    return dates.sort((a, b) => {
      const [ay, am, ad] = a.split('/').map(Number);
      const [by, bm, bd] = b.split('/').map(Number);
      return ay - by || am - bm || ad - bd;
    });
  }

  private updateSpecificHolidays(): void {
    const merged = [...this.holidays, ...this.doctorLeaves];
    const unique = Array.from(new Set(merged));
    this.specificHolidays = this.sortByYmd(unique);
    console.log('Specific holidays updated (sorted):', this.specificHolidays);
  }
  

  handleDateTimeSelection(date: string, doctorScheduleId: string): void {
    console.log('doctorServiceId lúc gửi đi', this.doctorServiceId);
    console.log('doctorId', this.doctorId);
    console.log('doctorScheduleId', doctorScheduleId);
    console.log('date', date);
    console.log('handleDateTimeSelection');
    if (this.doctorServiceId && this.doctorId) {
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