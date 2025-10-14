import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faCircleInfo,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { ServiceScheduleService } from '../../../shared/services/medical/service-schedule.service';
import { SelectTimeComponent } from './time-select.component';

@Component({
  selector: 'app-select-date',
  templateUrl: './date-select.component.html',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, SelectTimeComponent],
})
export class SelectDateComponent implements OnInit, OnChanges {
  @Input() serviceId: string | null = null;
  @Input() availableDays: string[] = [];
  @Input() specificHolidays: string[] = [];
  @Output() dateTimeSelection = new EventEmitter<{ date: string; serviceScheduleId: string }>();

  today = new Date();
  
  // Biến lưu trữ giới hạn số ngày có thể đặt lịch
  bookingDaysLimit: number = 30; // Mặc định 30 ngày
  
  // Tính toán ngày giới hạn dựa trên bookingDaysLimit
  get minBookingDate(): Date {
    return new Date(this.today.getTime() + 24 * 60 * 60 * 1000); // Luôn từ ngày mai
  }
  
  get maxBookingDate(): Date {
    return new Date(this.today.getTime() + this.bookingDaysLimit * 24 * 60 * 60 * 1000);
  }
  
  currentMonth = this.today.getMonth();
  currentYear = this.today.getFullYear();
  selectedDate: Date | null = null;
  timeSlots: { id: string; session: string; name: string }[] = [];
  isModalOpen = false;
  loadingTimeSlots = false;

  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faCircleInfo = faCircleInfo;
  faPhone = faPhone;

  dayMapping: { [key: string]: number } = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
  };

  constructor(private scheduleService: ServiceScheduleService) {}

  /**
   * Cập nhật giới hạn số ngày có thể đặt lịch
   * @param days Số ngày giới hạn (mặc định: 30)
   */
  setBookingDaysLimit(days: number): void {
    this.bookingDaysLimit = days;
  }

  /**
   * Format ngày tháng để hiển thị
   * @param date Ngày cần format
   * @returns Chuỗi ngày tháng định dạng dd/mm/yyyy
   */
  formatDate(date: Date): string {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  }

  ngOnInit(): void {
    this.updateDaysInMonth();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['availableDays']) {
      this.updateDaysInMonth();
    }
  }

  daysInMonth: (Date | null)[] = [];

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

  isHoliday(day: number, month: number, year: number): boolean {
    console.log('specificHolidays ', this.specificHolidays);
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
    if (!this.serviceId) return;

    this.selectedDate = date;
    const adjustedDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const year = adjustedDate.getFullYear();
    const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
    const day = String(adjustedDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    this.fetchTimeSlots(formattedDate);
  }

  fetchTimeSlots(formattedDate: string): void {
    if (!this.serviceId) return;

    this.loadingTimeSlots = true;
    this.isModalOpen = true;

    this.scheduleService.getScheduleByServiceAndDate(this.serviceId, formattedDate).subscribe({
      next: (data) => {
        this.timeSlots = data.map((slot) => ({
          id: slot.timeFrameResponse.id,
          session: slot.timeFrameResponse.session,
          name: slot.timeFrameResponse.name,
        }));
        this.loadingTimeSlots = false;
      },
      error: (err) => {
        console.error('Error fetching time slots:', err);
        this.loadingTimeSlots = false;
      },
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.timeSlots = [];
  }

  handleTimeSlotSelection(slot: { id: string; session: string; name: string }): void {
    if (this.selectedDate) {
      const adjustedDate = new Date(this.selectedDate.getTime() + 7 * 60 * 60 * 1000);
      const year = adjustedDate.getFullYear();
      const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
      const day = String(adjustedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      this.dateTimeSelection.emit({ date: formattedDate, serviceScheduleId: slot.id });
      this.closeModal();
    }
  }
}