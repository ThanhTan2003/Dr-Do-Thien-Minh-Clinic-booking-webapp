import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faCaretDown, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ModalDetailComponent } from '../../../../shared/components/modal-detail.component';
import { DoctorServiceService } from '../../../../shared/services/doctor/doctor-service.service';
import { DoctorService } from '../../../../models/responses/doctor/doctor-service.model';
import { Location } from '@angular/common';
import { PageResponse } from '../../../../models/responses/page-response.model';

@Component({
  selector: 'app-doctor-service',
  templateUrl: './doctor-service.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalDetailComponent, FontAwesomeModule, RouterOutlet]
})
export class DoctorServiceComponent implements OnInit, OnDestroy {
  doctorServices: DoctorService[] = [];
  totalPages = 1;
  currentPage = 1;
  pageSize = 5;
  keyword = '';
  loading = false;
  serviceId: string | null = null;
  doctorServiceId: string | null = null;

  isModalOpen = false;
  modalContent = { title: '', content: '' };

  faMagnifyingGlass = faMagnifyingGlass;
  faCaretDown = faCaretDown;
  faArrowLeft = faArrowLeft;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private doctorServiceService: DoctorServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.serviceId = params.get('serviceId');
      this.doctorServiceId = params.get('doctorServiceId');
      this.currentPage = 1;
      this.doctorServices = [];
      this.fetchDoctorServices();
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
        this.fetchDoctorServices();
      });
  }

  fetchDoctorServices(): void {
    if (!this.serviceId) {
      console.error('Service ID is missing');
      return;
    }

    this.loading = true;
    this.doctorServiceService
      .searchByService(this.keyword, this.serviceId, this.currentPage, this.pageSize)
      .subscribe({
        next: (res: PageResponse<DoctorService>) => {
          this.totalPages = res.totalPages || 1;
          this.doctorServices = this.currentPage === 1 ? res.data : [...this.doctorServices, ...res.data];
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching doctor services:', err);
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

  openModal(doctorService: DoctorService): void {
    this.modalContent = {
      title: doctorService.doctorResponse.name.toUpperCase(),
      content: doctorService.doctorResponse.description || 'Không có mô tả.',
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
      this.fetchDoctorServices();
    }
  }

  goToSchedule(doctorServiceId: string): void {
    this.doctorServiceId = doctorServiceId;
    this.router.navigate([doctorServiceId], { relativeTo: this.route });
  }

  goBack(): void {
    this.location.back();
  }

  getDoctorImage(doctorService: DoctorService): string {
    return (
      doctorService.doctorResponse.image ||
      (doctorService.doctorResponse.gender === 'Nam'
        ? '/images/default-male-doctor.jpg'
        : '/images/default-female-doctor.jpg')
    );
  }
} 