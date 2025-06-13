import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServiceCategoryService } from '../../../../../shared/services/medical/service-category.service';
import { ServiceCategory } from '../../../../../models/responses/medical/service-category.model';
import { PageResponse } from '../../../../../models/responses/page-response.model';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { PageSizeSelectorComponent } from '../../../../shared/components/page-size-selector/page-size-selector.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faRotate, 
  faPlus,
  faMagnifyingGlass, 
  faPenToSquare,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { CreateServiceTypeComponent } from '../create/create-service-type.component';
import { UpdateServiceTypeComponent } from '../update/update-service-type.component';
import { AdminModalConfirmComponent } from '../../../../shared/components/modal-confirm/admin-modal-confirm.component';
import { AdminModalConfirmDeleteComponent } from '../../../../shared/components/modal-confirm-delete/admin-modal-confirm-delete.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-service-type-crud',
  templateUrl: './list-service-type-crud.component.html',
  standalone: true,
  imports: [
    FormsModule, 
    PaginationComponent, 
    PageSizeSelectorComponent, 
    RouterModule, 
    CommonModule, 
    FontAwesomeModule,
    CreateServiceTypeComponent,
    UpdateServiceTypeComponent,
    AdminModalConfirmComponent,
    AdminModalConfirmDeleteComponent
  ]
})
export class ListServiceTypeCrudComponent implements OnInit {
  // FontAwesome icons
  faRotate = faRotate;
  faMagnifyingGlass = faMagnifyingGlass;
  faPlus = faPlus;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;

  categories: ServiceCategory[] = [];
  keyword: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  totalPages: number = 1;
  totalElements: number = 0;
  loading: boolean = false;
  showCreateModal: boolean = false;
  showUpdateModal: boolean = false;
  showConfirmModal: boolean = false;
  showConfirmDeleteModal: boolean = false;
  selectedCategory: ServiceCategory | null = null;

  constructor(
    private serviceCategoryService: ServiceCategoryService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.searchCategories();
  }

  ngAfterViewInit(): void {
    console.log("list-doctor-crud.component ngAfterViewInit....................");
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn mượt về đầu trang
  }

  searchCategories(page: number = 1): void {
    this.loading = true;
    this.serviceCategoryService.search(
      this.keyword,
      page,
      this.pageSize
    ).subscribe({
      next: (res: PageResponse<ServiceCategory>) => {
        this.categories = res.data;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.currentPage = page;
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Error loading categories', err);
      }
    });
  }

  handleSearch(): void {
    this.currentPage = 1;
    this.searchCategories();
  }

  refreshList(): void {
    this.keyword = '';
    this.currentPage = 1;
    this.searchCategories();
  }

  addCategory(): void {
    this.showCreateModal = true;
  }

  onServiceTypeCreated(): void {
    this.showCreateModal = false;
    this.searchCategories();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.searchCategories(page);
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.searchCategories();
  }

  updateCategory(category: ServiceCategory): void {
    this.selectedCategory = category;
    this.showUpdateModal = true;
  }

  onServiceTypeUpdated(): void {
    this.showUpdateModal = false;
    this.showConfirmModal = false;
    this.searchCategories();
  }

  deleteCategory(category: ServiceCategory): void {
    this.selectedCategory = category;
    this.showConfirmDeleteModal = true;
  }

  onConfirmDelete(): void {
    if (this.selectedCategory) {
      this.serviceCategoryService.deleteById(this.selectedCategory.id).subscribe({
        next: () => {
          this.toastr.success('Xóa chuyên môn thành công!');
          this.showConfirmDeleteModal = false;
          this.searchCategories();
        },
        error: (err) => {
          this.toastr.error(err.error?.message || 'Đã xảy ra lỗi. Vui lòng thử lại!');
        }
      });
    }
  }
} 