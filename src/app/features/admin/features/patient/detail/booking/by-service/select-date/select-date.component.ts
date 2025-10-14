import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
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
import { TimeFrame } from '../../../../../../../models/responses/appointment/time-frame.model';

// Services
import { ServiceScheduleService } from '../../../../../../../shared/services/medical/service-schedule.service';
import { Holiday } from '../../../../../../../shared/services/doctor/holiday.service';
import { TimeFrameService } from '../../../../../../../shared/services/appointment/time-frame.service';

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
  @Input() serviceId: string = '';
  @Output() dateTimeSelected = new EventEmitter<{ date: string, timeFrame: TimeFrame }>();
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
    private scheduleService: ServiceScheduleService,
    private holidayService: Holiday,
    private timeFrameService: TimeFrameService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (!this.serviceId) {
      this.toastr.error('Thiếu thông tin dịch vụ');
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
      .getListDayOfWeekByService(this.serviceId)
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
          this.specificHolidays = holidays.map((date: any) => {
            const d = new Date(date);
            return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
          });
        },
        error: (err: any) => {
          console.error('Error fetching holidays:', err);
        },
      });
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

    this.scheduleService.getScheduleByServiceAndDate(this.serviceId, formattedDate)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.timeSlots = data.map((slot: any) => ({
            id: slot.timeFrameResponse.id,
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

      // Find the time frame
      this.timeFrameService.getById(slot.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (timeFrame: any) => {
            this.dateTimeSelected.emit({ 
              date: formattedDate, 
              timeFrame: timeFrame 
            });
            this.closeTimeModal();
          },
          error: (err: any) => {
            console.error('Error fetching time frame:', err);
            this.toastr.error('Không thể lấy thông tin khung giờ');
          }
        });

      // this.dateTimeSelected.emit({ date: formattedDate, timeFrame: slot });
      this.closeTimeModal();
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
