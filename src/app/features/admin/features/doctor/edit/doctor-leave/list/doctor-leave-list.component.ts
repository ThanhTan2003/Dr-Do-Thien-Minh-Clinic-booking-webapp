import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DoctorLeave } from '../../../../../../shared/services/doctor/doctor-leave.service';
import { DoctorLeaveResponse } from '../../../../../../models/responses/doctor/doctor-leave.model';
import { PageResponse } from '../../../../../../models/responses/page-response.model';
import { PageSizeSelectorComponent } from '../../../../../shared/components/page-size-selector/page-size-selector.component';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { AdminModalConfirmDeleteComponent } from '../../../../../shared/components/modal-confirm-delete/admin-modal-confirm-delete.component';
import { AdminModalConfirmComponent } from '../../../../../shared/components/modal-confirm/admin-modal-confirm.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faPenToSquare, faTrash, faRotate } from '@fortawesome/free-solid-svg-icons';
import { CreateDoctorLeaveComponent } from '../create/create-doctor-leave.component';
import { getVietnameseDayName, formatDateToString } from '../../../../../../shared/util/date.util';

@Component({
  selector: 'app-doctor-leave-list',
  templateUrl: './doctor-leave-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PageSizeSelectorComponent,
    PaginationComponent,
    AdminModalConfirmDeleteComponent,
    AdminModalConfirmComponent,
    FontAwesomeModule,
    CreateDoctorLeaveComponent
  ]
})
export class DoctorLeaveListComponent implements OnInit {
  faPlus = faPlus;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faRotate = faRotate;

  doctorLeaves: DoctorLeaveResponse[] = [];
  loading: boolean = false;
  doctorId: string = '';
  // Pagination
  totalPages: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  totalElements: number = 0;

  // Modal
  showDeleteModal: boolean = false;
  showCreateModal: boolean = false;
  showConfirmCreateModal: boolean = false;
  selectedDoctorLeave: DoctorLeaveResponse | null = null;
  createFormData: any = null;

  constructor(
    private doctorLeaveService: DoctorLeave,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.doctorId = this.route.parent?.snapshot.paramMap?.get('doctorId') || '';
    this.loadDoctorLeaves();
  }

  loadDoctorLeaves(): void {
    this.doctorLeaves = [];
    this.loading = true;
    this.doctorLeaveService.getDoctorLeavesByDoctor(
      this.doctorId,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (res: PageResponse<DoctorLeaveResponse>) => {
        this.doctorLeaves = res.data;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error loading doctor leaves:', err);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadDoctorLeaves();
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.loadDoctorLeaves();
  }

  handleRefresh(): void {
    this.currentPage = 1;
    this.loadDoctorLeaves();
  }

  openDeleteModal(doctorLeave: DoctorLeaveResponse): void {
    this.selectedDoctorLeave = doctorLeave;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.selectedDoctorLeave) {
      this.doctorLeaveService.deleteDoctorLeave(this.selectedDoctorLeave.id).subscribe({
        next: () => {
          this.showDeleteModal = false;
          this.selectedDoctorLeave = null;
          this.loadDoctorLeaves();
        },
        error: (err) => {
          console.error('Error deleting doctor leave:', err);
          this.showDeleteModal = false;
          this.selectedDoctorLeave = null;
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.selectedDoctorLeave = null;
  }

  goToProcess(doctorLeaveId: string): void {
    this.router.navigate(['../nghi-phep', doctorLeaveId], { relativeTo: this.route });
  }

  // Thêm mới
  openCreateModal(): void {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.createFormData = null;
  }

  onCreateDoctorLeave(formData: any): void {
    this.createFormData = formData;
    this.showConfirmCreateModal = true;
  }

  confirmCreate(): void {
    if (this.createFormData) {
      const payload = {
        ...this.createFormData,
        doctorId: this.doctorId
      };
      this.doctorLeaveService.createDoctorLeave(payload).subscribe({
        next: () => {
          
          this.showCreateModal = false;
          this.showConfirmCreateModal = false;
          this.createFormData = null;
          this.loadDoctorLeaves();
        },
        error: (err) => {
          console.error('Error creating doctor leave:', err);
          this.showConfirmCreateModal = false;
        }
      });
    }
  }

  cancelCreate(): void {
    this.showConfirmCreateModal = false;
    this.createFormData = null;
  }

  isFutureOrToday(leaveStartDate: string, leaveEndDate: string): boolean {
    const today = new Date();
    const start = new Date(leaveStartDate);
    const end = new Date(leaveEndDate);
    return start >= today || end >= today;
  }

  formatDate(dateString: string): string {
    return formatDateToString(new Date(dateString));
  }

  getVietnameseDayName(date: string): string {
    const dateObj = new Date(date);
    return getVietnameseDayName(dateObj);
  }
}