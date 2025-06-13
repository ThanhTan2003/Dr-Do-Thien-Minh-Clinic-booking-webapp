import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagService } from '../../../../../../../shared/services/zalo_oa/user/tag.service';
import { TagResponse } from '../../../../../../../models/responses/zalo_oa/user/tag-response.model';
import { PageResponse } from '../../../../../../../models/responses/page-response.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleInfo, faPlus, faXmark, faRotate, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '../../../../../../shared/components/pagination/pagination.component';
import { PageSizeSelectorComponent } from '../../../../../../shared/components/page-size-selector/page-size-selector.component';
import { AdminModalConfirmComponent } from '../../../../../../shared/components/modal-confirm/admin-modal-confirm.component';
import { ZaloUserTagService } from '../../../../../../../shared/services/zalo_oa/user/zalo-user-tag.service';

@Component({
  selector: 'app-add-tag-for-user',
  templateUrl: './add-tag-for-user.component.html',
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
export class AddTagForUserComponent implements OnInit {
  @Input() userId: string = '';
  @Output() tagAdded = new EventEmitter<void>();

  availableTags: TagResponse[] = [];
  keyword: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  totalPages: number = 1;
  totalElements: number = 0;
  loading: boolean = false;

  showConfirmAdd: boolean = false;
  tagToAdd: TagResponse | null = null;

  faCircleInfo = faCircleInfo;
  faPlus = faPlus;
  faXmark = faXmark;
  faRotate = faRotate;
  faMagnifyingGlass = faMagnifyingGlass;

  constructor(
    private tagService: TagService,
    private zaloUserTagService: ZaloUserTagService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAvailableTags();
  }

  loadAvailableTags(page: number = 1): void {
    this.loading = true;
    this.tagService.getAvailableTagsForUser(this.userId, this.keyword, page, this.pageSize).subscribe({
      next: (res: PageResponse<TagResponse>) => {
        this.availableTags = res.data;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.currentPage = page;
        this.loading = false;
      },
      error: () => { 
        this.loading = false;
        this.toastr.error('Không thể tải danh sách tag có sẵn');
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

  confirmAddTag(tag: TagResponse): void {
    this.tagToAdd = tag;
    this.showConfirmAdd = true;
  }

  closeConfirmAdd(): void {
    this.showConfirmAdd = false;
    this.tagToAdd = null;
  }

  addTag(): void {
    if (!this.tagToAdd) return;
    this.zaloUserTagService.addTagForUser(this.userId, this.tagToAdd.name).subscribe({
      next: () => {
        this.toastr.success('Thêm tag thành công!');
        this.showConfirmAdd = false;
        this.tagToAdd = null;
        this.loadAvailableTags();
        this.tagAdded.emit();
      },
      error: () => {
        this.toastr.error('Thêm tag thất bại!');
      }
    });
  }
}
