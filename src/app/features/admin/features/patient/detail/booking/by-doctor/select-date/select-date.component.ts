import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faXmark,
  faCalendarAlt,
  faChevronLeft,
  faChevronRight,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

// Models
import { DoctorSchedule } from '../../../../../../../models/responses/doctor/doctor-schedule.model';

// Services
import { DoctorScheduleService } from '../../../../../../../shared/services/doctor/doctor-schedule.service';
import { DoctorServiceService } from '../../../../../../../shared/services/doctor/doctor-service.service';
import { Holiday } from '../../../../../../../shared/services/doctor/holiday.service';
import { DoctorLeave } from '../../../../../../../shared/services/doctor/doctor-leave.service';

// Components
import { SelectTimeComponent } from '../select-time/select-time.component';

@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    SelectTimeComponent
  ]
})
export class SelectDateComponent implements OnInit, OnDestroy {
  @Input() doctorId: string = '';
  @Input() doctorServiceId: string = '';
  @Output() dateSelected = new EventEmitter<{ date: string, doctorSchedule: DoctorSchedule }>();
  @Output() close = new EventEmitter<void>();

  // Calendar data
  today = new Date();
  currentMonth = this.today.getMonth();
  currentYear = this.today.getFullYear();
  daysInMonth: (Date | null)[] = [];
  selectedDate: Date | null = null;

  // Available days and holidays
  availableDays: string[] = [];
  specificHolidays: string[] = [];
  private holidays: string[] = [];
  private doctorLeaves: string[] = [];

  // Time slots
  timeSlots: { id: string; session: string; name: string }[] = [];
  showTimeModal = false;
  loadingTimeSlots = false;

  // Booking limit
  bookingDaysLimit: number = 30;

  // Day mapping
  dayMapping: { [key: string]: number } = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
  };

  // Icons
  faXmark = faXmark;
  faCalendarAlt = faCalendarAlt;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faCircleInfo = faCircleInfo;

  // Loading
  loading = true;

  private destroy$ = new Subject<void>();

  constructor(
    private scheduleService: DoctorScheduleService,
    private doctorServiceService: DoctorServiceService,
    private holidayService: Holiday,
    private doctorLeaveService: DoctorLeave,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (!this.doctorId || !this.doctorServiceId) {
      this.toastr.error('Thiếu thông tin bác sĩ hoặc dịch vụ');
      return;
    }
    
    this.updateDaysInMonth();
    this.fetchAvailableDays();
    this.fetchHolidays();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get minBookingDate(): Date {
    return new Date(this.today.getTime() + 24 * 60 * 60 * 1000); // From tomorrow
  }
  
  get maxBookingDate(): Date {
    return new Date(this.today.getTime() + this.bookingDaysLimit * 24 * 60 * 60 * 1000);
  }

  formatDate(date: Date): string {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  }

  updateDaysInMonth(): void {
    this.daysInMonth = this.getDaysInMonth(this.currentMonth, this.currentYear);
  }

  getDaysInMonth(month: number, year: number): (Date | null)[] {
    const days: (Date | null)[] = [];
    const date = new Date(year, month, 1);
    const firstDayOfWeek = date.getDay();

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return days;
  }

  prevMonth(): void {
    if (this.currentMonth === this.today.getMonth() && this.currentYear === this.today.getFullYear()) return;
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.updateDaysInMonth();
  }

  nextMonth(): void {
    const nextDate = new Date(this.currentYear, this.currentMonth + 1, 1);
    if (nextDate > this.maxBookingDate) return;
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.updateDaysInMonth();
  }

  fetchAvailableDays(): void {
    this.loading = true;
    this.scheduleService
      .getListDayOfWeekByDoctorService(this.doctorServiceId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (days: any) => {
          this.availableDays = days;
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error fetching available days:', err);
          this.toastr.error('Không thể tải ngày khả dụng');
          this.loading = false;
        },
      });
  }

  fetchHolidays(): void {
    this.holidayService
      .getUpcomingHolidays()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (holidays: any) => {
          this.holidays = holidays.map((date: any) => {
            const d = new Date(date);
            return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
          });
          this.fetchDoctorLeaves();
        },
        error: (err: any) => {
          console.error('Error fetching holidays:', err);
        },
      });
  }

  fetchDoctorLeaves(): void {
    this.doctorLeaveService
      .getUpcomingDoctorLeaves(this.doctorId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (leaves: any) => {
          this.doctorLeaves = leaves.map((date: any) => {
            const d = new Date(date);
            return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
          });
          this.updateSpecificHolidays();
        },
        error: (err: any) => {
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
  }

  isHoliday(day: number, month: number, year: number): boolean {
    const dateString = `${year}/${(month + 1).toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
    return this.specificHolidays.includes(dateString);
  }

  isSelectable(day: number, month: number, year: number): boolean {
    const date = new Date(year, month, day);
    const numericAvailableDays = this.availableDays.map((day) => this.dayMapping[day]);
    const isValidDay = numericAvailableDays.includes(date.getDay());

    return (
      date >= this.minBookingDate &&
      date <= this.maxBookingDate &&
      isValidDay &&
      !this.isHoliday(day, month, year)
    );
  }

  handleDateSelection(date: Date): void {
    this.selectedDate = date;
    const adjustedDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const year = adjustedDate.getFullYear();
    const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
    const day = String(adjustedDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    this.fetchTimeSlots(formattedDate);
  }

  fetchTimeSlots(formattedDate: string): void {
    this.loadingTimeSlots = true;
    this.showTimeModal = true;

    this.scheduleService.getScheduleByDoctorAndDate(this.doctorId, formattedDate)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.timeSlots = data.map((slot: any) => ({
            id: slot.id,
            session: slot.timeFrameResponse.session,
            name: slot.timeFrameResponse.name,
          }));
          this.loadingTimeSlots = false;
        },
        error: (err: any) => {
          console.error('Error fetching time slots:', err);
          this.toastr.error('Không thể tải khung giờ');
          this.loadingTimeSlots = false;
        },
      });
  }

  closeTimeModal(): void {
    this.showTimeModal = false;
    this.timeSlots = [];
  }

  handleTimeSlotSelection(slot: { id: string; session: string; name: string }): void {
    if (this.selectedDate) {
      const adjustedDate = new Date(this.selectedDate.getTime() + 7 * 60 * 60 * 1000);
      const year = adjustedDate.getFullYear();
      const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
      const day = String(adjustedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      // Find the doctor schedule
      this.scheduleService.getById(slot.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (doctorSchedule: any) => {
            this.dateSelected.emit({ 
              date: formattedDate, 
              doctorSchedule: doctorSchedule 
            });
            this.closeTimeModal();
          },
          error: (err: any) => {
            console.error('Error fetching doctor schedule:', err);
            this.toastr.error('Không thể lấy thông tin lịch khám');
          }
        });
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
