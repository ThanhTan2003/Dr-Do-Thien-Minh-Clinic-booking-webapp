import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { DoctorService } from '../../../../shared/services/doctor/doctor.service';
import { Doctor } from '../../../../models/responses/doctor/doctor.model';
import { ModalDetailComponent } from '../../../../shared/components/modal-detail.component';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { DoctorServiceComponent } from '../doctor-service/doctor-service.component';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, FormsModule, ModalDetailComponent, FontAwesomeModule, RouterOutlet, DoctorServiceComponent],
})
export class DoctorComponent implements OnInit, OnDestroy {
  doctors: Doctor[] = [];
  totalPages = 1;
  currentPage = 1;
  pageSize = 5;
  keyword = '';
  loading = false;
  doctorId: string | null = null;

  isModalOpen = false;
  modalContent = { title: '', content: '' };

  // FontAwesome icons
  faMagnifyingGlass = faMagnifyingGlass;
  faCaretDown = faCaretDown;

  // Debounce search
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private doctorService: DoctorService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    console.log('DoctorComponent initialized');
    this.setupSearchDebounce();
    this.fetchDoctors();
  }

  ngOnDestroy(): void {
    console.log('DoctorComponent destroyed');
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchDebounce(): void {
    this.searchSubject
      .pipe(
        debounceTime(500), // Debounce 500ms
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.fetchDoctors();
      });
  }

  fetchDoctors(): void {
    this.loading = true;
    this.doctorService.searchDoctors(this.keyword, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.totalPages = res.totalPages || 1;
        this.doctors = this.currentPage === 1 ? res.data : [...this.doctors, ...res.data];
        this.cdr.detectChanges(); // Ensure UI updates
      },
      error: (err) => {
        console.error('Error fetching doctors:', err);
        this.loading = false;
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

  openModal(doctor: Doctor): void {
    this.modalContent = {
      title: doctor.name.toUpperCase(),
      content: doctor.description || 'Không có mô tả.',
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
      this.fetchDoctors();
    }
  }

  goToService(doctorId: string): void {
    this.router.navigate(['booking', 'by-doctor', doctorId]);
  }

  getDoctorImage(doctor: Doctor): string {
    return (
      doctor.image ||
      (doctor.gender === 'Nam'
        ? '/images/default-male-doctor.jpg'
        : '/images/default-female-doctor.jpg')
    );
  }
}