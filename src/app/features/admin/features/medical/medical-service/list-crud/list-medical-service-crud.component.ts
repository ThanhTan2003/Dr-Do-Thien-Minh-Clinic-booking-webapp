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
  faPenToSquare
} from '@fortawesome/free-solid-svg-icons';
import { CreateMedicalServiceComponent } from '../create/create-medical-service.component';

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
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.searchServices();
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
    this.searchServices();
  }

  handleCategoryChange(): void {
    this.currentPage = 1;
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
    this.searchServices(page);
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.searchServices();
  }

  goToEditMedicalService(serviceId: string): void {
    console.log(serviceId);
    this.router.navigate([serviceId], { relativeTo: this.route });
  }
} 