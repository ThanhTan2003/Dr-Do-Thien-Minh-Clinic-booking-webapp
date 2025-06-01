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
  faPenToSquare
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
    // setTimeout(() => {
    //   window.scrollTo({ top: this.scrollService.getPosition(this.scrollKey), behavior: 'auto' });
    // }, 0);
    this.loadStatuses();
    this.searchDoctors();
    this.loadCategories();
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

  handleSearch(): void {
    this.currentPage = 1;
    this.searchDoctors();
  }

  handleStatusChange(): void {
    this.currentPage = 1;
    this.searchDoctors();
  }

  handleCategoryChange(): void {
    this.currentPage = 1;
    this.searchDoctors();
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

  onPageChange(page: number): void {
    this.currentPage = page;
    this.searchDoctors(page);
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.searchDoctors();
  }

  removeVietnameseTones(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
  }

  goToEditDoctor(doctorId: string): void {
    console.log("list-doctor-crud.component goToEditDoctor....................");
    console.log(window.scrollY);
    this.scrollService.setPosition(this.scrollKey, window.scrollY);
    this.router.navigate([doctorId], { relativeTo: this.route });
  }
} 