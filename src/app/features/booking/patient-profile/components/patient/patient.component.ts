import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faCaretDown, faPlus } from '@fortawesome/free-solid-svg-icons';
import { DetailPatientComponent } from '../../../compoments/patient/detail-patient.component';
import { ModalErrorComponent } from '../../../../shared/components/modal-error.component';
import { PatientService } from '../../../../shared/services/patient/patient.service';
import { Patient } from '../../../../models/responses/patient/patient.model';
import { PageResponse } from '../../../../models/responses/page-response.model';

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
  pageSize = 5;
  keyword = '';
  loading = false;
  isModalOpen = false;
  isErrorModalOpen = false;
  errorTitle = '';
  errorMessage = '';

  faMagnifyingGlass = faMagnifyingGlass;
  faCaretDown = faCaretDown;
  faPlus = faPlus;

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
    
    // Subscribe to route changes
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.fetchPatients();
    });

    // Scroll to top
    window.scrollTo(0, 0);
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
    this.patientService.search(this.keyword, this.currentPage, this.pageSize).subscribe({
      next: (res: PageResponse<Patient>) => {
        this.totalPages = res.totalPages || 1;
        this.patients = this.currentPage === 1 ? res.data : [...this.patients, ...res.data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching patients:', err);
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
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchPatients();
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-GB');
  }
} 