import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faRotate, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { PatientTagService } from '../../../../../shared/services/patient/patient-tag.service';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { PageSizeSelectorComponent } from '../../../../shared/components/page-size-selector/page-size-selector.component';
import { AdminModalConfirmDeleteComponent } from '../../../../shared/components/modal-confirm-delete/admin-modal-confirm-delete.component';
import { AddTagForPatientComponent } from '../../../appointment/update/tags/add-tag/add-tag-for-patient.component';

@Component({
  selector: 'app-patient-tag',
  templateUrl: './patient-tag.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    PaginationComponent,
    PageSizeSelectorComponent,
    AdminModalConfirmDeleteComponent,
    AddTagForPatientComponent
  ]
})
export class PatientTagComponent implements OnInit {
  patientId: string = '';
  tags: string[] = [];
  keyword: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  totalPages: number = 1;
  totalElements: number = 0;
  loading: boolean = false;

  showAddModal: boolean = false;
  showConfirmDelete: boolean = false;
  tagToDelete: string | null = null;

  faPlus = faPlus;
  faRotate = faRotate;
  faMagnifyingGlass = faMagnifyingGlass;
  faXmark = faXmark;

  constructor(
    private route: ActivatedRoute,
    private patientTagService: PatientTagService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.patientId = this.route.parent?.snapshot.paramMap.get('patientId') || '';
    this.loadTags();
  }

  loadTags(): void {
    this.loading = true;
    this.patientTagService.getTagsByPatient(this.patientId).subscribe({
      next: (tags: string[]) => {
        this.tags = tags;
        this.totalElements = tags.length;
        this.totalPages = Math.ceil(tags.length / this.pageSize);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Không thể tải danh sách nhóm đối tượng');
      }
    });
  }

  handleSearch(): void {
    this.currentPage = 1;
    this.loadTags();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTags();
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.loadTags();
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  onTagAdded(): void {
    this.showAddModal = false;
    this.loadTags();
  }

  openDeleteModal(tag: string): void {
    this.tagToDelete = tag;
    this.showConfirmDelete = true;
  }

  closeConfirmDelete(): void {
    this.showConfirmDelete = false;
    this.tagToDelete = null;
  }

  deleteTag(): void {
    if (!this.tagToDelete) {
      return;
    }
    this.patientTagService.removeTag(this.patientId, this.tagToDelete).subscribe({
      next: () => {
        this.toastr.success('Xóa nhóm đối tượng thành công!');
        this.showConfirmDelete = false;
        this.tagToDelete = null;
        this.loadTags();
      },
      error: (error) => {
        this.showConfirmDelete = false;
        if (error.status === 500 && error.error?.message) {
          this.toastr.error(error.error.message, 'Lỗi');
        } else {
          this.toastr.error('Không thể xóa nhóm đối tượng', 'Lỗi');
        }
      }
    });
  }
} 