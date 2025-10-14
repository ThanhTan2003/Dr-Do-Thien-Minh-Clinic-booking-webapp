import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faRotate, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { PatientTagService } from '../../../../../shared/services/patient/patient-tag.service';
import { PageResponse } from '../../../../../models/responses/page-response.model';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { PageSizeSelectorComponent } from '../../../../shared/components/page-size-selector/page-size-selector.component';

@Component({
  selector: 'app-update-tags',
  templateUrl: './update-tags.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    PaginationComponent,
    PageSizeSelectorComponent
  ]
})
export class UpdateTagsComponent implements OnInit {
  @Input() patientId: string = '';
  @Output() openAddTagModal = new EventEmitter<void>();
  @Output() openDeleteTagModal = new EventEmitter<string>();
  
  tags: string[] = [];
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
    private patientTagService: PatientTagService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.patientId) {
      this.loadTags();
    }
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
    this.openAddTagModal.emit();
  }

  openDeleteModal(tag: string): void {
    this.openDeleteTagModal.emit(tag);
  }

  // Method để refresh data từ parent component
  refreshData(): void {
    this.loadTags();
  }
}
