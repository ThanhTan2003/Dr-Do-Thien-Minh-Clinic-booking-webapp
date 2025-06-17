import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Patient } from '../../../../../../../models/responses/patient/patient.model';
import { PatientNoteService } from '../../../../../../../shared/services/patient/patient-note.service';
import { PatientNoteResponse } from '../../../../../../../models/responses/patient/patient-note.response';
import { PageResponse } from '../../../../../../../models/responses/page-response.model';
import { PaginationComponent } from '../../../../../../shared/components/pagination/pagination.component';
import { PageSizeSelectorComponent } from '../../../../../../shared/components/page-size-selector/page-size-selector.component';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, PaginationComponent, PageSizeSelectorComponent]
})
export class PatientDetailComponent implements OnInit {
  @Input() patient: Patient | null = null;
  @Output() close = new EventEmitter<void>();

  faXmark = faXmark;

  notes: PatientNoteResponse[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  totalPages: number = 1;
  totalElements: number = 0;
  loading: boolean = false;

  constructor(private patientNoteService: PatientNoteService) {}

  ngOnInit(): void {
    if (this.patient) {
      this.loadNotes();
    }
  }

  loadNotes(page: number = 1): void {
    if (!this.patient) return;
    
    this.loading = true;
    this.patientNoteService.getNotesByPatientId(this.patient.id, page, this.pageSize).subscribe({
      next: (response: PageResponse<PatientNoteResponse>) => {
        this.notes = response.data;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.currentPage = page;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading notes:', error);
        this.loading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadNotes(page);
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.loadNotes();
  }

  closeModal(): void {
    this.close.emit();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  }
} 