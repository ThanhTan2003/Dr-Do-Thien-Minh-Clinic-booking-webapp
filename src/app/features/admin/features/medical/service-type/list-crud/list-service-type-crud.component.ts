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
  faPenToSquare
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-list-service-type-crud',
  templateUrl: './list-service-type-crud.component.html',
  standalone: true,
  imports: [FormsModule, PaginationComponent, PageSizeSelectorComponent, RouterModule, CommonModule, FontAwesomeModule]
})
export class ListServiceTypeCrudComponent implements OnInit {
  // FontAwesome icons
  faRotate = faRotate;
  faMagnifyingGlass = faMagnifyingGlass;
  faPlus = faPlus;
  faPenToSquare = faPenToSquare;

  categories: ServiceCategory[] = [];
  keyword: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  totalPages: number = 1;
  totalElements: number = 0;
  loading: boolean = false;

  constructor(
    private serviceCategoryService: ServiceCategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchCategories();
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
    this.router.navigate(['/admin/service-type/create']);
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
} 