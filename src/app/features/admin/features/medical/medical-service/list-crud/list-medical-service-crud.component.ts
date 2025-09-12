import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../../../../../shared/services/medical/service.service';
import { ServiceCategoryService } from '../../../../../shared/services/medical/service-category.service';
import { Service } from '../../../../../models/responses/medical/service.model';
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
  faCircleQuestion
} from '@fortawesome/free-solid-svg-icons';
import {
  CreateMedicalServiceComponent

} from '../create/create-medical-service.component';

@Component({
  selector: 'app-list-medical-service-crud',
  templateUrl: './list-medical-service-crud.component.html',
  standalone: true,
  imports: [
    FormsModule,
    PaginationComponent,
    PageSizeSelectorComponent,
    RouterModule,
    CommonModule,
    FontAwesomeModule,
    CreateMedicalServiceComponent
  ]
})
export class ListMedicalServiceCrudComponent implements OnInit {
  // FontAwesome icons
  faRotate = faRotate;
  faMagnifyingGlass = faMagnifyingGlass;
  faPlus = faPlus;
  faPenToSquare = faPenToSquare;
  faCircleQuestion = faCircleQuestion;

  services: Service[] = [];
  categories: ServiceCategory[] = [];
  selectedCategory: string = '';
  keyword: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  totalPages: number = 1;
  totalElements: number = 0;
  loading: boolean = false;
  showCreateModal: boolean = false;

  constructor(
    private serviceService: ServiceService,
    private serviceCategoryService: ServiceCategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // Chỉ cập nhật các giá trị nếu chúng thực sự thay đổi
      const newPage = +params['page'] || 1;
      const newSize = +params['size'] || 10;
      const newKeyword = params['keyword'] || '';
      const newCategory = params['category'] || '';

      // Kiểm tra xem có cần cập nhật không
      if (newPage !== this.currentPage ||
        newSize !== this.pageSize ||
        newKeyword !== this.keyword ||
        newCategory !== this.selectedCategory) {

        this.currentPage = newPage;
        this.pageSize = newSize;
        this.keyword = newKeyword;
        this.selectedCategory = newCategory;


      }
    });
    this.loadCategories();
    this.searchServices();
  }

  updateQueryParams() {
    const queryParams: any = {
      page: this.currentPage,
      size: this.pageSize,
      keyword: this.keyword
    };

    // Chỉ thêm category nếu có giá trị
    if (this.selectedCategory && this.selectedCategory.trim() !== '') {
      queryParams.category = this.selectedCategory;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      replaceUrl: true // Sử dụng replaceUrl thay vì merge
    });
  }

  ngAfterViewInit(): void {
    console.log("list-doctor-crud.component ngAfterViewInit....................");
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn mượt về đầu trang
  }

  loadCategories(): void {
    this.serviceCategoryService.search('', 1, 1000).subscribe({
      next: (res: PageResponse<ServiceCategory>) => {
        this.categories = res.data;
      },
      error: (err: any) => {
        console.error('Error loading categories', err);
      }
    });
  }

  searchServices(page: number = 1): void {
    this.loading = true;
    this.serviceService.search(
      this.keyword,
      this.selectedCategory,
      page,
      this.pageSize
    ).subscribe({
      next: (res: PageResponse<Service>) => {
        this.services = res.data;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.currentPage = page;
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Error loading services', err);
      }
    });
  }

  handleSearch(): void {
    this.currentPage = 1;
    this.updateQueryParams();
    this.searchServices();
  }

  handleCategoryChange(): void {
    this.currentPage = 1;
    this.updateQueryParams();
    this.searchServices();
  }

  refreshList(): void {
    this.keyword = '';
    this.selectedCategory = '';
    this.currentPage = 1;
    this.searchServices();
  }

  addService(): void {
    this.showCreateModal = true;
  }

  onServiceCreated(): void {
    this.showCreateModal = false;
    this.searchServices();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateQueryParams();
    this.searchServices(page);
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.updateQueryParams();
    this.searchServices();
  }

  goToEditMedicalService(serviceId: string): void {
    console.log("list-medical-service-crud.component goToEditMedicalService....................");
    console.log(window.scrollY);
    
    // Lưu các tham số tìm kiếm vào localStorage trước khi chuyển trang
    const searchParams = {
      page: this.currentPage,
      size: this.pageSize,
      keyword: this.keyword,
      category: this.selectedCategory
    };
    localStorage.setItem('serviceListSearchParams', JSON.stringify(searchParams));
    
    // Chuyển đến edit page
    this.router.navigate([serviceId], { relativeTo: this.route });
  }
} 