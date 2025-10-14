import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faRotate, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { PatientNoteService } from '../../../../../shared/services/patient/patient-note.service';
import { PatientNoteResponse } from '../../../../../models/responses/patient/patient-note.response';
import { PageResponse } from '../../../../../models/responses/page-response.model';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { PageSizeSelectorComponent } from '../../../../shared/components/page-size-selector/page-size-selector.component';

@Component({
  selector: 'app-update-notes',
  templateUrl: './update-notes.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    PaginationComponent,
    PageSizeSelectorComponent
  ]
})
export class UpdateNotesComponent implements OnInit {
  @Input() patientId: string = '';
  @Output() openAddNoteModal = new EventEmitter<void>();
  @Output() openDeleteNoteModal = new EventEmitter<PatientNoteResponse>();
  
  notes: PatientNoteResponse[] = [];
  keyword: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  totalPages: number = 1;
  totalElements: number = 0;
  loading: boolean = false;

  faPlus = faPlus;
  faRotate = faRotate;
  faMagnifyingGlass = faMagnifyingGlass;
  faXmark = faXmark;

  constructor(
    private patientNoteService: PatientNoteService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.patientId) {
      this.loadNotes();
    }
  }

  loadNotes(): void {
    this.loading = true;
    this.patientNoteService.getNotesByPatientId(this.patientId, this.currentPage, this.pageSize).subscribe({
      next: (res: PageResponse<PatientNoteResponse>) => {
        this.notes = res.data;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.loading = false;
      },
      error: () => { 
        this.loading = false;
        this.toastr.error('Không thể tải danh sách ghi chú');
      }
    });
  }

  handleSearch(): void {
    this.currentPage = 1;
    this.loadNotes();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadNotes();
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.loadNotes();
  }

  openAddModal(): void {
    this.openAddNoteModal.emit();
  }

  openDeleteModal(note: PatientNoteResponse): void {
    this.openDeleteNoteModal.emit(note);
  }

  // Method để refresh data từ parent component
  refreshData(): void {
    this.loadNotes();
  }
}
