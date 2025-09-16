import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentActionService } from '../../../../../shared/services/appointment/appointment-action.service';
import { SuggestedDoctor } from '../../../../../models/responses/appointment/suggested-doctor.model';
import { AssignDoctorRequest } from '../../../../../models/requests/appointment/assign-doctor-request';
import { Appointment } from '../../../../../models/responses/appointment/appointment.model';
import { PageResponse } from '../../../../../models/responses/page-response.model';
import { PageSizeSelectorComponent } from '../../../../shared/components/page-size-selector/page-size-selector.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { AdminModalConfirmComponent } from '../../../../shared/components/modal-confirm/admin-modal-confirm.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faCircleQuestion,
  faMagnifyingGlass,
  faRotate,
  faUserMd,
  faXmark,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { getDoctorSuggestionStatusClass } from '../../../../../shared/util/status.util';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-suggested-doctor',
  templateUrl: './suggested-doctor.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageSizeSelectorComponent,
    PaginationComponent,
    AdminModalConfirmComponent,
    FontAwesomeModule
  ]
})
export class SuggestedDoctorComponent implements OnInit {
  @Input() appointment: Appointment | null = null;
  @Output() doctorAssigned = new EventEmitter<boolean>();
  @Output() close = new EventEmitter<void>();

  suggestedDoctors: SuggestedDoctor[] = [];
  keyword: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  totalPages: number = 1;
  totalElements: number = 0;
  loading: boolean = false;

  // Modal confirmation
  showConfirmModal: boolean = false;
  confirmTitle: string = '';
  confirmContent: string = '';
  selectedDoctorService: any = null;

  // FontAwesome icons
  faCircleQuestion = faCircleQuestion;
  faMagnifyingGlass = faMagnifyingGlass;
  faRotate = faRotate;
  faUserMd = faUserMd;
  faXmark = faXmark;
  faCheck = faCheck;

  constructor(
    private appointmentActionService: AppointmentActionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadSuggestedDoctors();
  }

  loadSuggestedDoctors(): void {
    if (!this.appointment?.id) {
      console.error('Appointment ID is required');
      return;
    }

    this.loading = true;
    this.appointmentActionService.getSuggestedDoctors(
      this.appointment.id,
      this.keyword,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (response: PageResponse<SuggestedDoctor>) => {
        this.suggestedDoctors = response.data;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading suggested doctors:', error);
        this.toastr.error('Không thể tải danh sách bác sĩ', 'Lỗi');
        this.loading = false;
      }
    });
  }

  handleSearch(): void {
    this.currentPage = 1;
    this.loadSuggestedDoctors();
  }

  refreshList(): void {
    this.keyword = '';
    this.currentPage = 1;
    this.loadSuggestedDoctors();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadSuggestedDoctors();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadSuggestedDoctors();
  }

  selectDoctor(suggestedDoctor: SuggestedDoctor): void {
    this.selectedDoctorService = suggestedDoctor.doctorServiceResponse;
    this.confirmTitle = 'Xác nhận chọn bác sĩ';
    this.confirmContent = `Bạn có chắc chắn muốn chọn bác sĩ "${suggestedDoctor.doctorServiceResponse.doctorResponse.name}" cho lịch hẹn này không?`;
    this.showConfirmModal = true;
  }

  onConfirmAssign(): void {
    if (!this.selectedDoctorService || !this.appointment?.id) {
      this.toastr.error('Thông tin không hợp lệ', 'Lỗi');
      return;
    }

    const request: AssignDoctorRequest = {
      appointmentId: this.appointment.id,
      doctorServiceId: this.selectedDoctorService.id
    };

    this.appointmentActionService.assignDoctor(this.appointment.id, request).subscribe({
      next: (updatedAppointment: Appointment) => {
        this.toastr.success('Chỉ định bác sĩ thành công', 'Thông báo');
        this.showConfirmModal = false;
        this.selectedDoctorService = null;
        this.doctorAssigned.emit(true);
      },
      error: (error) => {
        console.error('Error assigning doctor:', error);
        this.toastr.error('Không thể chỉ định bác sĩ', 'Lỗi');
        this.showConfirmModal = false;
        this.selectedDoctorService = null;
      }
    });
  }

  onCancelAssign(): void {
    this.showConfirmModal = false;
    this.selectedDoctorService = null;
  }

  onClose(): void {
    this.close.emit();
  }

  getStatusClass(code: string): string {
    return getDoctorSuggestionStatusClass(code);
  }

  formatPrice(price: string): string {
    try {
      const numPrice = parseFloat(price);
      return numPrice.toLocaleString('vi-VN') + ' VND';
    } catch {
      return price + ' VND';
    }
  }
}
