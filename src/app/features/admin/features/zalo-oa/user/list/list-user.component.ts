import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ZaloUserService } from '../../../../../shared/services/zalo_oa/user/zalo-user.service';
import { ZaloUserResponse } from '../../../../../models/responses/zalo_oa/user/zalo-user-response.model';
import { PageResponse } from '../../../../../models/responses/page-response.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { PageSizeSelectorComponent } from '../../../../shared/components/page-size-selector/page-size-selector.component';
import { TagService } from '../../../../../shared/services/zalo_oa/user/tag.service';
import { TagResponse } from '../../../../../models/responses/zalo_oa/user/tag-response.model';
import { 
  faRotate, 
  faMagnifyingGlass, 
  faCommentDots, 
  faCircleInfo 
} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  imports: [CommonModule, FontAwesomeModule, FormsModule, RouterModule, PaginationComponent, PageSizeSelectorComponent],
  standalone: true
})
export class ListUserComponent implements OnInit {
  // FontAwesome icons
  faRotate = faRotate;
  faMagnifyingGlass = faMagnifyingGlass;
  faCommentDots = faCommentDots;
  faCircleInfo = faCircleInfo;

  users: ZaloUserResponse[] = [];
  keyword: string = '';
  selectedTagId: string = '';
  tags: TagResponse[] = [];

  loading: boolean = false;

  totalPages: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  totalElements: number = 0;

  notification: string = '';

  constructor(
    private zaloUserService: ZaloUserService,
    private tagService: TagService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadTags();
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn mượt về đầu trang
  }

  loadTags(): void {
    this.tagService.getTags('', 1, 100).subscribe({
      next: (response: PageResponse<TagResponse>) => {
        this.tags = response.data;
      },
      error: (error: any) => {
        console.error('Error loading tags:', error);
      }
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.zaloUserService.searchUsers(
      this.keyword,
      this.selectedTagId,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (response: PageResponse<ZaloUserResponse>) => {
        this.users = response.data;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  handleSearch(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.loadUsers();
  }

  copyToClipboard(id: string): void {
    navigator.clipboard.writeText(id)
      .then(() => {
        this.notification = 'Đã sao chép Zalo User ID!';
        setTimeout(() => {
          this.notification = '';
        }, 2000);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  }

  syncUsers(): void {
    this.zaloUserService.syncUsers().subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error syncing users:', error);
      }
    });
  }

  goToDetailUser(userId: string): void {
    console.log(userId);
    this.router.navigate([userId], { relativeTo: this.route });
  }
} 