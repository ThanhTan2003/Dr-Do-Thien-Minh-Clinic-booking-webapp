import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute, RouterLink, RouterEvent, NavigationEnd } from '@angular/router';
import { PatientService } from '../../../shared/services/patient/patient.service';
import { Patient } from '../../../models/responses/patient/patient.model';
import { DetailPatientComponent } from './detail/detail-patient.component';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil, filter } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faCaretDown, faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, FormsModule, DetailPatientComponent, FontAwesomeModule, RouterOutlet, RouterLink],
})
export class PatientComponent implements OnInit, OnDestroy {
  patients: Patient[] = [];
  totalPages = 1;
  currentPage = 1;
  pageSize = 5;
  keyword = '';
  loading = false;
  patientId: string | null = null;
  selectPatient: Patient | null = null;

  isModalOpen = false;

  faMagnifyingGlass = faMagnifyingGlass;
  faCaretDown = faCaretDown;
  faArrowLeft = faArrowLeft;
  faPlus = faPlus;

  private doctorId: string | null = null;
  private doctorServiceId: string | null = null;
  private doctorScheduleId!: string;
  private appointmentDate!: string;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  loadingMore = false;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) {}

  ngOnInit(): void {

    console.log('ngOnInit PatientComponent-----------------------------------------------------------');
    this.patientId = this.route.snapshot.params['patientId'];
    console.log('patientId', this.patientId);

    this.doctorId = this.route.snapshot.params['doctorId'];
    console.log('doctorId', this.doctorId);


    this.doctorServiceId = this.route.parent?.snapshot.paramMap.get('doctorServiceId') || '';
    console.log('doctorServiceId', this.doctorServiceId);

    this.doctorScheduleId = this.route.snapshot.params['doctorScheduleId'];
    console.log('doctorScheduleId', this.doctorScheduleId);

    this.appointmentDate = this.route.snapshot.params['date'];
    console.log('appointmentDate', this.appointmentDate);


    console.log('PatientComponent initialized');
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.patientId = params.get('patientId');
      this.currentPage = 1;
      this.patients = [];
      this.fetchPatients();
      this.cdr.detectChanges();
    });
    
    // Subscribe to router events to reload data when returning from create/update
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      // Check if we're returning to the patient list (not going to create/update)
      const url = event.url;
      if (url.includes('/patient') && !url.includes('/create') && !url.includes('/update')) {
        this.fetchPatients();
      }
    });
    
    this.setupSearchDebounce();
  }

  ngOnDestroy(): void {
    console.log('PatientComponent destroyed');
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
    this.patientService
      .searchPatientsByCustomer(this.keyword, this.currentPage, this.pageSize)
      .subscribe({
        next: (res) => {
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
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error fetching patients:', err);
            this.loadingMore = false;
            this.cdr.detectChanges();
          },
          complete: () => {
            this.loadingMore = false;
            this.cdr.detectChanges();
          },
        });
    }
  }

  goBack(): void {
    this.location.back();
  }

  getPatientImage(patient: Patient): string {
    return patient.image || '/images/default-patient.jpg';
  }

  // Getter để kiểm tra URL không kết thúc bằng '/create'
  get isNotCreateRoute(): boolean {
    return !this.router.url.endsWith('/create');
  }

  // Navigate to confirm component
  goToConfirm(patient: Patient): void {
    const params = this.route.snapshot.params;
    this.router.navigate([patient.id], { relativeTo: this.route });
  }
}