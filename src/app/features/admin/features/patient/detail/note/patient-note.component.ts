import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faRotate, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { PatientNoteService } from '../../../../../shared/services/patient/patient-note.service';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { PageSizeSelectorComponent } from '../../../../shared/components/page-size-selector/page-size-selector.component';
import { AdminModalConfirmDeleteComponent } from '../../../../shared/components/modal-confirm-delete/admin-modal-confirm-delete.component';
import { AddNoteComponent } from '../../../../features/doctor/appointment/update/notes/add-note/add-note.component';
import { PatientNoteResponse } from '../../../../../models/responses/patient/patient-note.response';

@Component({
  selector: 'app-patient-note',
  templateUrl: './patient-note.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    PaginationComponent,
    PageSizeSelectorComponent,
    AdminModalConfirmDeleteComponent,
    AddNoteComponent
  ]
})
export class PatientNoteComponent implements OnInit {
  patientId: string = '';
  notes: PatientNoteResponse[] = [];
  keyword: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  totalPages: number = 1;
  totalElements: number = 0;
  loading: boolean = false;

  showAddModal: boolean = false;
  showConfirmDelete: boolean = false;
  noteToDelete: PatientNoteResponse | null = null;

  faPlus = faPlus;
  faRotate = faRotate;
  faMagnifyingGlass = faMagnifyingGlass;
  faXmark = faXmark;

  constructor(
    private route: ActivatedRoute,
    private patientNoteService: PatientNoteService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.patientId = this.route.parent?.snapshot.paramMap.get('patientId') || '';
    this.loadNotes();
  }

  loadNotes(): void {
    this.loading = true;
    this.patientNoteService.getNotesByPatientId(this.patientId, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
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
    this.showAddModal = true;
  }

  onNoteAdded(): void {
    this.showAddModal = false;
    this.loadNotes();
  }

  openDeleteModal(note: PatientNoteResponse): void {
    this.noteToDelete = note;
    this.showConfirmDelete = true;
  }

  closeConfirmDelete(): void {
    this.showConfirmDelete = false;
    this.noteToDelete = null;
  }

  deleteNote(): void {
    if (!this.noteToDelete) {
      return;
    }
    this.patientNoteService.deleteNote(this.noteToDelete.id).subscribe({
      next: () => {
        this.toastr.success('Xóa ghi chú thành công!');
        this.showConfirmDelete = false;
        this.noteToDelete = null;
        this.loadNotes();
      },
      error: (error) => {
        this.showConfirmDelete = false;
        if (error.status === 500 && error.error?.message) {
          this.toastr.error(error.error.message, 'Lỗi');
        } else {
          this.toastr.error('Không thể xóa ghi chú', 'Lỗi');
        }
      }
    });
  }
} 