import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute, RouterLink, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil, filter } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faCaretDown, faPlus, faHome } from '@fortawesome/free-solid-svg-icons';
import { DetailPatientComponent } from '../../../compoments/patient/detail/detail-patient.component';
import { ModalErrorComponent } from '../../../../shared/components/modal-error.component';
import { PatientService } from '../../../../shared/services/patient/patient.service';
import { Patient } from '../../../../models/responses/patient/patient.model';
import { PageResponse } from '../../../../models/responses/page-response.model';
import {formatDate, formatPhone, formatInsuranceId, formatNationalId} from '../../../../shared/util/format.util';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, DetailPatientComponent, ModalErrorComponent, FontAwesomeModule, RouterOutlet, RouterLink]
})
export class PatientProfileComponent implements OnInit, OnDestroy {
  patients: Patient[] = [];
  selectPatient: Patient | null = null;
  totalPages = 1;
  currentPage = 1;
  pageSize = 10;
  keyword = '';
  loading = false;
  loadingMore = false;
  isModalOpen = false;
  isErrorModalOpen = false;
  errorTitle = '';
  errorMessage = '';

  faMagnifyingGlass = faMagnifyingGlass;
  faCaretDown = faCaretDown;
  faPlus = faPlus;
  faHome = faHome;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.fetchPatients();
    // Chỉ reload khi quay lại từ create/update
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      const url = event.url;
      if (url.includes('/patient-profile') && !url.includes('/create') && !url.includes('/update')) {
        this.fetchPatients();
      }
    });
    // Không scrollTo(0,0) khi phân trang
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
        this.fetchPatients();
      });
  }

  fetchPatients(): void {
    this.loading = true;
    this.patientService.searchPatientsByCustomer(this.keyword, 1, this.pageSize).subscribe({
      next: (res) => {
        this.totalPages = res.totalPages || 1;
        this.patients = res.data;
      },
      error: (err) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.keyword);
  }

  openModal(patient: Patient): void {
    this.selectPatient = patient;
    this.isModalOpen = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.cdr.detectChanges();
  }

  showErrorModal(action: 'update' | 'delete'): void {
    if (action === 'update') {
      this.errorTitle = 'Không thể cập nhật';
      this.errorMessage = 'Phòng khám hiện chưa cho phép thực hiện thao tác cập nhật thông tin hồ sơ trực tiếp trên ứng dụng. Bạn vui lòng liên hệ phòng khám qua Zalo OA để được hỗ trợ. Trân trọng!';
    } else {
      this.errorTitle = 'Không thể xóa';
      this.errorMessage = 'Phòng khám hiện chưa cho phép thực hiện thao tác xóa thông tin hồ sơ trực tiếp trên ứng dụng. Bạn vui lòng liên hệ phòng khám qua Zalo OA để được hỗ trợ. Trân trọng!';
    }
    this.isErrorModalOpen = true;
    this.cdr.detectChanges();
  }

  closeErrorModal(): void {
    this.isErrorModalOpen = false;
    this.cdr.detectChanges();
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages && !this.loadingMore) {
      this.currentPage++;
      this.loadingMore = true;
      this.patientService
        .searchPatientsByCustomer(this.keyword, this.currentPage, this.pageSize)
        .subscribe({
          next: (res) => {
            this.totalPages = res.totalPages || 1;
            this.patients = [...this.patients, ...res.data];
          },
          error: (err) => {
            this.loadingMore = false;
          },
          complete: () => {
            this.loadingMore = false;
          },
        });
    }
  }

  goToHome(): void {
    this.router.navigate(['/booking']);
  }

  formatDate(value: string | Date): string {
    return formatDate(value);
  }
  formatPhone(value: string): string {
    return formatPhone(value);
  }
  formatInsuranceId(value: string): string {
    return formatInsuranceId(value);
  }
  formatNationalId(value: string): string {
    return formatNationalId(value);
  }
} 