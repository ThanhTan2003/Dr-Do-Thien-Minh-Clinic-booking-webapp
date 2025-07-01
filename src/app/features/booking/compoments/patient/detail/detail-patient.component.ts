import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Patient } from '../../../../models/responses/patient/patient.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail-patient',
  templateUrl: './detail-patient.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class DetailPatientComponent {
  @Input() patient: Patient | null = null;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}