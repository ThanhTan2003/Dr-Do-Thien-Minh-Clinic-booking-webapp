import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TagService } from '../../../../../../shared/services/zalo_oa/user/tag.service';
import { ZaloUserTagService } from '../../../../../../shared/services/zalo_oa/user/zalo-user-tag.service';
import { TagResponse } from '../../../../../../models/responses/zalo_oa/user/tag-response.model';
import { PageResponse } from '../../../../../../models/responses/page-response.model';
import { ToastrService } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faXmark, faPeopleGroup, faRotate, faPlus, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { AdminModalConfirmComponent } from '../../../../../shared/components/modal-confirm/admin-modal-confirm.component';
import { AdminModalConfirmDeleteComponent } from '../../../../../shared/components/modal-confirm-delete/admin-modal-confirm-delete.component';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { PageSizeSelectorComponent } from '../../../../../shared/components/page-size-selector/page-size-selector.component';
import { AddTagForUserComponent } from './add-tag/add-tag-for-user.component';

@Component({
  selector: 'app-tag-information',
  templateUrl: './tag-information.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    AdminModalConfirmComponent,
    AdminModalConfirmDeleteComponent,
    PaginationComponent,
    PageSizeSelectorComponent,
    AddTagForUserComponent
  ]
})
export class TagInformationComponent implements OnInit {
  userId: string = '';
  tags: TagResponse[] = [];
  keyword: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  totalPages: number = 1;
  totalElements: number = 0;
  loading: boolean = false;

  showAddModal: boolean = false;
  showConfirmDelete: boolean = false;
  tagToDelete: TagResponse | null = null;

  faMagnifyingGlass = faMagnifyingGlass;
  faXmark = faXmark;
  faPeopleGroup = faPeopleGroup;
  faRotate = faRotate;
  faPlus = faPlus;
  faCircleQuestion = faCircleQuestion;

  constructor(
    private route: ActivatedRoute,
    private tagService: TagService,
    private zaloUserTagService: ZaloUserTagService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.route.parent?.snapshot.paramMap.get('userId') || '';
    
    this.route.queryParams.subscribe(params => {
      // Chỉ cập nhật các giá trị nếu chúng thực sự thay đổi
      const newPage = +params['page'] || 1;
      const newSize = +params['size'] || 10;
      const newKeyword = params['keyword'] || '';
      
      // Kiểm tra xem có cần cập nhật không
      if (newPage !== this.currentPage || 
          newSize !== this.pageSize || 
          newKeyword !== this.keyword) {
        
        this.currentPage = newPage;
        this.pageSize = newSize;
        this.keyword = newKeyword;
        
        this.loadTags();
      }
    });
    
    this.loadTags();
  }

  loadTags(page: number = 1): void {
    this.loading = true;
    this.tagService.searchTagsByUser(this.userId, this.keyword, page, this.pageSize).subscribe({
      next: (res: PageResponse<TagResponse>) => {
        this.tags = res.data;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.currentPage = page;
        this.loading = false;
      },
      error: () => { 
        this.loading = false;
        this.toastr.error('Không thể tải danh sách tag');
      }
    });
  }

  updateQueryParams() {
    const queryParams: any = {
      page: this.currentPage,
      size: this.pageSize,
      keyword: this.keyword
    };
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      replaceUrl: true
    });
  }
  

  handleSearch(): void {
    this.currentPage = 1;
    this.updateQueryParams();
    this.loadTags();
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateQueryParams();
    this.loadTags(page);
  }
  
  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.updateQueryParams();
    this.loadTags();
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  onTagAdded(): void {
    this.showAddModal = false;
    this.loadTags();
  }

  openDeleteModal(tag: TagResponse): void {
    this.tagToDelete = tag;
    this.showConfirmDelete = true;
  }

  closeConfirmDelete(): void {
    this.showConfirmDelete = false;
    this.tagToDelete = null;
  }

  deleteTag(): void {
    if (!this.tagToDelete) {
      console.warn('Không có tag nào được chọn để xoá.');
      return;
    }
  
    console.log('Bắt đầu xoá tag với tên:', this.tagToDelete.name);
  
    this.zaloUserTagService.removeTagFromUser(this.userId, this.tagToDelete.name).subscribe({
      next: (res) => {
        console.log('Xóa thành công. Response:', res);
        this.toastr.success('Xóa tag thành công!');
        this.showConfirmDelete = false;
        this.tagToDelete = null;
        this.loadTags();
      },
      error: (error) => {
        this.showConfirmDelete = false;
        console.error('Lỗi khi xoá tag:', error);
  
        if (error.status === 500 && error.error?.message) {
          this.toastr.error(error.error.message, 'Lỗi');
          console.log('Lỗi 500 với message:', error.error.message);
        } else {
          this.toastr.error('Không thể xóa tag', 'Lỗi');
          console.log('Lỗi khác:', error.status);
        }
      }
    });
  }
} 