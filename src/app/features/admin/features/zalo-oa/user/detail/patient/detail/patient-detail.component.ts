import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Patient } from '../../../../../../../models/responses/appointment/patient.model';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule]
})
export class PatientDetailComponent {
  @Input() patient: Patient | null = null;
  @Output() close = new EventEmitter<void>();

  faXmark = faXmark;

  closeModal(): void {
    this.close.emit();
  }
} 