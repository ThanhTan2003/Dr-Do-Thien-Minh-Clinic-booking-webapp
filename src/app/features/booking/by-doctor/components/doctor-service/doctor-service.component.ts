import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { DoctorServiceService } from '../../../../shared/services/doctor/doctor-service.service';
import { DoctorService } from '../../../../models/responses/doctor/doctor-service.model';
import { ModalDetailComponent } from '../../../../shared/components/modal-detail.component';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faCaretDown, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';

@Component({
  selector: 'app-doctor-service',
  templateUrl: './doctor-service.component.html',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, FormsModule, ModalDetailComponent, FontAwesomeModule, RouterOutlet],
})
export class DoctorServiceComponent implements OnInit, OnDestroy {
  services: DoctorService[] = [];
  totalPages = 1;
  currentPage = 1;
  pageSize = 5;
  keyword = '';
  loading = false;
  doctorId: string | null = null;
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
    console.log('DoctorServiceComponent initialized');
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.doctorId = params.get('doctorId');
      this.doctorServiceId = params.get('doctorServiceId');
      this.currentPage = 1;
      this.services = [];
      this.fetchServices();
      this.cdr.detectChanges();
    });
    this.setupSearchDebounce();
  }

  ngOnDestroy(): void {
    console.log('DoctorServiceComponent destroyed');
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
    if (!this.doctorId) {
      console.error('Doctor ID is missing');
      return;
    }

    this.loading = true;
    this.doctorServiceService
      .searchByDoctor(this.keyword, this.doctorId, true, true, this.currentPage, this.pageSize)
      .subscribe({
        next: (res) => {
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

  openModal(service: DoctorService): void {
    this.modalContent = {
      title: service.serviceResponse.serviceName.toUpperCase(),
      content: service.serviceResponse.description || 'Không có mô tả.',
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

  goToSchedule(doctorServiceId: string): void {
    this.doctorServiceId = doctorServiceId;
    this.router.navigate([doctorServiceId], { relativeTo: this.route }).then(success => {
      if (!success) {
        console.error('Navigation failed for doctorServiceId:', doctorServiceId);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  getServiceImage(service: DoctorService): string {
    return service.serviceResponse.image || '/images/default-service.jpg';
  }
}