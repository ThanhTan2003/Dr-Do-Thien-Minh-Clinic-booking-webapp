import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faCaretDown, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ModalDetailComponent } from '../../../shared/components/modal-detail.component';
import { ServiceService } from '../../../shared/services/medical/service.service';
import { Service } from '../../../models/responses/medical/service.model';
import { Location } from '@angular/common';
import { PageResponse } from '../../../models/responses/page-response.model';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalDetailComponent, FontAwesomeModule, RouterOutlet]
})
export class ServiceComponent implements OnInit, OnDestroy {
  services: Service[] = [];
  totalPages = 1;
  currentPage = 1;
  pageSize = 5;
  keyword = '';
  loading = false;
  serviceCategoryId: string | null = null;
  serviceId: string | null = null;

  isModalOpen = false;
  modalContent = { title: '', content: '' };

  faMagnifyingGlass = faMagnifyingGlass;
  faCaretDown = faCaretDown;
  faArrowLeft = faArrowLeft;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private serviceService: ServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.serviceCategoryId = params.get('serviceCategoryId');
      this.serviceId = params.get('serviceId');
      this.currentPage = 1;
      this.services = [];
      this.fetchServices();
      this.cdr.detectChanges();
    });
    this.setupSearchDebounce();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchDebounce(): void {
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.fetchServices();
      });
  }

  fetchServices(): void {
    if (!this.serviceCategoryId) {
      console.error('Service Category ID is missing');
      return;
    }

    this.loading = true;
    this.serviceService
      .searchByCustomer(this.keyword, this.serviceCategoryId, this.currentPage, this.pageSize)
      .subscribe({
        next: (res: PageResponse<Service>) => {
          this.totalPages = res.totalPages || 1;
          this.services = this.currentPage === 1 ? res.data : [...this.services, ...res.data];
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching services:', err);
          this.loading = false;
          this.cdr.detectChanges();
        },
        complete: () => {
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.keyword);
  }

  getShortenedDescription(description: string, maxLength: number): string {
    if (!description || description.length <= maxLength) {
      return description || '';
    }

    let shortened = description.substring(0, maxLength);
    const lastSpaceIndex = shortened.lastIndexOf(' ');

    if (lastSpaceIndex !== -1) {
      shortened = shortened.substring(0, lastSpaceIndex);
    }

    return `${shortened}...`;
  }

  openModal(service: Service): void {
    this.modalContent = {
      title: service.serviceName.toUpperCase(),
      content: service.description || 'Không có mô tả.',
    };
    this.isModalOpen = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.cdr.detectChanges();
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchServices();
    }
  }

  goToDoctorService(serviceId: string): void {
    this.serviceId = serviceId;
    this.router.navigate([serviceId], { relativeTo: this.route });
  }

  goBack(): void {
    this.location.back();
  }

  getServiceImage(service: Service): string {
    return service.image || 'https://cdn-icons-png.flaticon.com/512/1976/1976945.png';
  }
} 