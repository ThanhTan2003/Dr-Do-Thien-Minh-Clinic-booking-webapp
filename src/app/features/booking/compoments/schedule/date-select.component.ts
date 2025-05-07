import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faCircleInfo,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { DoctorScheduleService } from '../../../shared/services/doctor/doctor-schedule.service';
import { SelectTimeComponent } from './time-select.component';

@Component({
  selector: 'app-select-date',
  templateUrl: './date-select.component.html',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, SelectTimeComponent],
})
export class SelectDateComponent implements OnInit, OnChanges {
  @Input() doctorServiceId: string | null = null;
  @Input() availableDays: string[] = [];
  @Input() holidayMatrix: [number, number][] = [];
  @Input() specificHolidays: string[] = [];
  @Input() doctorId: string | null = null;
  @Output() dateTimeSelection = new EventEmitter<{ date: string; doctorScheduleId: string }>();

  today = new Date();
  oneMonthLater = new Date(this.today.getFullYear(), this.today.getMonth() + 1, this.today.getDate());
  currentMonth = this.today.getMonth();
  currentYear = this.today.getFullYear();
  selectedDate: Date | null = null;
  timeSlots: { id: string; session: string; name: string }[] = [];
  isModalOpen = false;

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

  constructor(private scheduleService: DoctorScheduleService) {}

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
    if (nextDate > this.oneMonthLater) return;
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.updateDaysInMonth();
  }

  isHoliday(day: number, month: number, year: number): boolean {
    const dateString = `${year}/${month + 1}/${day}`;
    if (this.specificHolidays.includes(dateString)) return true;
    return this.holidayMatrix.some(
      ([holidayDay, holidayMonth]) => holidayDay === day && holidayMonth - 1 === month
    );
  }

  isSelectable(day: number, month: number, year: number): boolean {
    const date = new Date(year, month, day);
    const numericAvailableDays = this.availableDays.map((day) => this.dayMapping[day]);
    const isValidDay = numericAvailableDays.includes(date.getDay());
    const maxSelectableDate = new Date(this.today);
    maxSelectableDate.setMonth(this.today.getMonth() + 1);

    return (
      date > this.today &&
      date <= maxSelectableDate &&
      isValidDay &&
      !this.isHoliday(day, month, year)
    );
  }

  handleDateSelection(date: Date): void {
    if (!this.doctorId) return;

    this.selectedDate = date;
    const adjustedDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const year = adjustedDate.getFullYear();
    const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
    const day = String(adjustedDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    this.fetchTimeSlots(formattedDate);
  }

  fetchTimeSlots(formattedDate: string): void {
    if (!this.doctorId) return;

    this.scheduleService.getScheduleByDoctorAndDate(this.doctorId, formattedDate).subscribe({
      next: (data) => {
        this.timeSlots = data.map((slot) => ({
          id: slot.id,
          session: slot.timeFrameResponse.session,
          name: slot.timeFrameResponse.name,
        }));
        this.isModalOpen = true;
      },
      error: (err) => {
        console.error('Error fetching time slots:', err);
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

      this.dateTimeSelection.emit({ date: formattedDate, doctorScheduleId: slot.id });
      this.closeModal();
    }
  }
}