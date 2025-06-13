import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faRotate, 
  faMagnifyingGlass,
  faUserNurse
} from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { DoctorServiceService } from '../../../../../../shared/services/doctor/doctor-service.service';
import { DoctorService } from '../../../../../../models/responses/doctor/doctor-service.model';
import { DoctorServiceStatus } from '../../../../../../models/responses/doctor/doctor-service-status.model';
import { PageResponse } from '../../../../../../models/responses/page-response.model';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { PageSizeSelectorComponent } from '../../../../../shared/components/page-size-selector/page-size-selector.component';
import { DoctorService as DoctorServiceAPI } from '../../../../../../shared/services/doctor/doctor.service';
import { DoctorStatus } from '../../../../../../models/responses/doctor/doctor-status.model';

@Component({
  selector: 'app-service-list-doctor',
  templateUrl: './service-list-doctor.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    PaginationComponent,
    PageSizeSelectorComponent
  ]
})
export class ServiceListDoctorComponent implements OnInit {
  // FontAwesome icons
  faRotate = faRotate;
  faMagnifyingGlass = faMagnifyingGlass;
  faUserNurse = faUserNurse;

  doctorServices: DoctorService[] = [];
  serviceStatuses: DoctorServiceStatus[] = [];
  doctorStatuses: DoctorStatus[] = [];
  selectedServiceStatus: boolean | undefined;
  selectedDoctorStatus: boolean | undefined;
  keyword: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  totalPages: number = 1;
  totalElements: number = 0;
  loading: boolean = false;
  serviceId: string = '';

  constructor(
    private doctorServiceService: DoctorServiceService,
    private doctorService: DoctorServiceAPI,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadStatuses();
    this.serviceId = this.route.snapshot.params['serviceId'];
    this.searchDoctors();
  }

  loadStatuses(): void {
    // Load service statuses
    this.doctorServiceService.getAllDoctorServiceStatuses().subscribe({
      next: (res: DoctorServiceStatus[]) => {
        this.serviceStatuses = res;
      },
      error: (err: any) => {
        console.error('Error loading service statuses', err);
      }
    });

    // Load doctor statuses
    this.doctorService.getAllDoctorStatuses().subscribe({
      next: (res: DoctorStatus[]) => {
        this.doctorStatuses = res;
      },
      error: (err: any) => {
        console.error('Error loading doctor statuses', err);
      }
    });
  }

  searchDoctors(page: number = 1): void {
    this.loading = true;
    this.doctorServiceService.searchByService(
      this.keyword,
      this.serviceId,
      this.selectedServiceStatus,
      this.selectedDoctorStatus,
      page,
      this.pageSize
    ).subscribe({
      next: (res: PageResponse<DoctorService>) => {
        this.doctorServices = res.data;
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

  handleServiceStatusChange(): void {
    this.currentPage = 1;
    this.searchDoctors();
  }

  handleDoctorStatusChange(): void {
    this.currentPage = 1;
    this.searchDoctors();
  }

  refreshList(): void {
    this.keyword = '';
    this.selectedServiceStatus = undefined;
    this.selectedDoctorStatus = undefined;
    this.currentPage = 1;
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
} 