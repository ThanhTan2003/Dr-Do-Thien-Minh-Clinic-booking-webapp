import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../../../shared/services/doctor/doctor.service';
import { ServiceCategoryService } from '../../../../shared/services/medical/service-category.service';
import { Doctor } from '../../../../models/responses/doctor/doctor.model';
import { DoctorStatus } from '../../../../models/responses/doctor/doctor-status.model';
import { PageResponse } from '../../../../models/responses/page-response.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { PageSizeSelectorComponent } from '../../../shared/components/page-size-selector/page-size-selector.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faRotate,
  faPlus,
  faMagnifyingGlass,
  faCommentDots,
  faCircleInfo,
  faPenToSquare,
  faCircleQuestion
} from '@fortawesome/free-solid-svg-icons';
import { ServiceCategory } from '../../../../models/responses/medical/service-category.model';
import { CreateDoctorComponent } from '../create/create-doctor.component';
import { ScrollPositionService } from '../scroll-position.service';

@Component({
  selector: 'app-list-doctor-crud',
  templateUrl: './list-doctor-crud.component.html',
  standalone: true,
  imports: [
    FormsModule,
    PaginationComponent,
    PageSizeSelectorComponent,
    RouterModule,
    CommonModule,
    FontAwesomeModule,
    CreateDoctorComponent
  ]
})
export class ListDoctorCrudComponent implements OnInit {
  // FontAwesome icons
  faRotate = faRotate;
  faMagnifyingGlass = faMagnifyingGlass;
  faCommentDots = faCommentDots;
  faCircleInfo = faCircleInfo;
  faPlus = faPlus;
  faPenToSquare = faPenToSquare;
  faCircleQuestion = faCircleQuestion;

  doctors: Doctor[] = [];
  categories: ServiceCategory[] = [];
  statuses: DoctorStatus[] = [];
  selectedStatus: string = '';
  selectedCategory: string = '';
  keyword: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  totalPages: number = 1;
  totalElements: number = 0;
  loading: boolean = false;
  showCreateModal: boolean = false;
  private scrollKey = 'list-doctor-crud';

  constructor(
    private doctorService: DoctorService,
    private serviceCategoryService: ServiceCategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private scrollService: ScrollPositionService
  ) {
  }

  ngOnInit(): void {
    console.log("list-doctor-crud.component ngOnInit....................");
    this.route.queryParams.subscribe(params => {
      // Chỉ cập nhật các giá trị nếu chúng thực sự thay đổi
      const newPage = +params['page'] || 1;
      const newSize = +params['size'] || 10;
      const newKeyword = params['keyword'] || '';
      const newStatus = params['status'] || '';
      const newCategory = params['category'] || '';

      // Kiểm tra xem có cần cập nhật không
      if (newPage !== this.currentPage ||
        newSize !== this.pageSize ||
        newKeyword !== this.keyword ||
        newStatus !== this.selectedStatus ||
        newCategory !== this.selectedCategory) {

        this.currentPage = newPage;
        this.pageSize = newSize;
        this.keyword = newKeyword;
        this.selectedStatus = newStatus;
        this.selectedCategory = newCategory;
      }
    });

    this.loadStatuses();
    this.searchDoctors();
    this.loadCategories();
  }

  handleSearch(): void {
    this.currentPage = 1;
    this.updateQueryParams();
    this.searchDoctors();
  }

  handleStatusChange(): void {
    this.currentPage = 1;
    this.updateQueryParams();
    this.searchDoctors();
  }

  handleCategoryChange(): void {
    this.currentPage = 1;
    this.updateQueryParams();
    this.searchDoctors();
  }

  // ... existing code ...

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateQueryParams();
    this.searchDoctors(page);
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.updateQueryParams();
    this.searchDoctors();
  }

  // Thêm method mới để update query params
  updateQueryParams() {
    const queryParams: any = {
      page: this.currentPage,
      size: this.pageSize,
      keyword: this.keyword
    };

    // Chỉ thêm status nếu có giá trị
    if (this.selectedStatus && this.selectedStatus.trim() !== '') {
      queryParams.status = this.selectedStatus;
    }

    // Chỉ thêm category nếu có giá trị
    if (this.selectedCategory && this.selectedCategory.trim() !== '') {
      queryParams.category = this.selectedCategory;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }

  ngAfterViewInit(): void {
    console.log("list-doctor-crud.component ngAfterViewInit....................");
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn mượt về đầu trang
  }
  ngDestroy(): void {
    console.log("list-doctor-crud.component ngDestroy....................");
  }

  loadStatuses(): void {
    this.doctorService.getAllDoctorStatuses().subscribe({
      next: (statuses: DoctorStatus[]) => {
        console.log("list-doctor-crud.component loadStatuses....................");
        console.log(statuses);
        this.statuses = statuses;
      },
      error: (err: any) => {
        console.error('Error loading statuses', err);
      }
    });
  }

  loadCategories(): void {
    this.serviceCategoryService.search().subscribe({
      next: (res: PageResponse<ServiceCategory>) => {
        this.categories = res.data;
      },
      error: (err: any) => {
        console.error('Error loading categories', err);
      }
    });
  }

  searchDoctors(page: number = 1): void {
    this.loading = true;
    let status: boolean = true;
    if (this.selectedStatus !== '') {
      status = this.selectedStatus === 'true';
    }
    this.doctorService.searchDoctorsWithStatusAndCategory(
      this.keyword,
      status,
      this.selectedCategory,
      page,
      this.pageSize
    ).subscribe({
      next: (res: PageResponse<Doctor>) => {
        this.doctors = res.data;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.currentPage = page;
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Error loading doctors', err);
      }
    });
  }

  refreshList(): void {
    this.keyword = '';
    this.selectedStatus = '';
    this.currentPage = 1;
    this.searchDoctors();
  }

  addDoctor(): void {
    this.showCreateModal = true;
  }

  onDoctorCreated(): void {
    this.showCreateModal = false;
    this.searchDoctors();
  }


  removeVietnameseTones(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
  }

  goToEditDoctor(doctorId: string): void {
    console.log("list-doctor-crud.component goToEditDoctor....................");
    console.log(window.scrollY);
    
    // Lưu các tham số tìm kiếm vào localStorage trước khi chuyển trang
    const searchParams = {
      page: this.currentPage,
      size: this.pageSize,
      keyword: this.keyword,
      status: this.selectedStatus,
      category: this.selectedCategory
    };
    localStorage.setItem('doctorListSearchParams', JSON.stringify(searchParams));
    
    // Lưu scroll position
    this.scrollService.setPosition(this.scrollKey, window.scrollY);
    
    // Chuyển đến edit page
    this.router.navigate([doctorId], { relativeTo: this.route });
  }
} 