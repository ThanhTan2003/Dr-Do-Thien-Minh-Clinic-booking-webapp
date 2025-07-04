import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-select-time',
  templateUrl: './time-select.component.html',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
})
export class SelectTimeComponent {
  @Input() selectedDate: Date | null = null;
  @Input() timeSlots: { id: string; session: string; name: string }[] = [];
  @Input() doctorId: string | null = null;
  @Input() loading: boolean = false;
  @Output() timeSlotSelection = new EventEmitter<{ id: string; session: string; name: string }>();
  @Output() close = new EventEmitter<void>();

  groupTimeSlots(): { session: string; slots: { id: string; session: string; name: string }[] }[] {
    const sessions = this.timeSlots.reduce((acc, slot) => {
      if (!acc[slot.session]) acc[slot.session] = [];
      acc[slot.session].push(slot);
      return acc;
    }, {} as { [key: string]: { id: string; session: string; name: string }[] });

    return Object.entries(sessions).map(([session, slots]) => ({
      session,
      slots,
    }));
  }

  handleTimeSlotClick(slot: { id: string; session: string; name: string }): void {
    console.log('Selected time slot:', slot);
    this.timeSlotSelection.emit(slot);
  }

  closeModal(): void {
    this.close.emit();
  }
}