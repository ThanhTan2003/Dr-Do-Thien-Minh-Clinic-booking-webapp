import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientTagService } from '../../../../../../shared/services/patient/patient-tag.service';
import { PageResponse } from '../../../../../../models/responses/page-response.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faRotate, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { PageSizeSelectorComponent } from '../../../../../shared/components/page-size-selector/page-size-selector.component';
import { AdminModalConfirmComponent } from '../../../../../shared/components/modal-confirm/admin-modal-confirm.component';
import { PatientTagRequest } from '../../../../../../models/requests/patient/patient-tag.request';

@Component({
  selector: 'app-add-tag-for-patient',
  templateUrl: './add-tag-for-patient.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    PaginationComponent,
    PageSizeSelectorComponent,
    AdminModalConfirmComponent
  ],
})
export class AddTagForPatientComponent implements OnInit {
  @Input() patientId: string = '';
  @Output() tagAdded = new EventEmitter<void>();

  availableTags: string[] = [];
  keyword: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  totalPages: number = 1;
  totalElements: number = 0;
  loading: boolean = false;

  showConfirmAdd: boolean = false;
  tagToAdd: string | null = null;

  faPlus = faPlus;
  faRotate = faRotate;
  faMagnifyingGlass = faMagnifyingGlass;

  constructor(
    private patientTagService: PatientTagService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAvailableTags();
  }

  loadAvailableTags(page: number = 1): void {
    this.loading = true;
    this.patientTagService.getAvailableTagsForPatient(this.patientId, this.keyword, page, this.pageSize).subscribe({
      next: (res: PageResponse<string>) => {
        this.availableTags = res.data;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.currentPage = page;
        this.loading = false;
      },
      error: () => { 
        this.loading = false;
        this.toastr.error('Không thể tải danh sách nhóm đối tượng có sẵn');
      }
    });
  }

  handleSearch(): void {
    this.currentPage = 1;
    this.loadAvailableTags();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAvailableTags(page);
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.loadAvailableTags();
  }

  goBack(): void {
    this.tagAdded.emit();
  }

  confirmAddTag(tag: string): void {
    this.tagToAdd = tag;
    this.showConfirmAdd = true;
  }

  closeConfirmAdd(): void {
    this.showConfirmAdd = false;
    this.tagToAdd = null;
  }

  addTag(): void {
    if (!this.tagToAdd) return;
    
    const request: PatientTagRequest = {
      patientId: this.patientId,
      tagName: this.tagToAdd
    };

    this.patientTagService.addTag(request).subscribe({
      next: () => {
        this.toastr.success('Thêm nhóm đối tượng thành công!');
        this.showConfirmAdd = false;
        this.tagToAdd = null;
        this.loadAvailableTags();
        this.tagAdded.emit();
      },
      error: () => {
        this.toastr.error('Thêm nhóm đối tượng thất bại!');
      }
    });
  }
} 