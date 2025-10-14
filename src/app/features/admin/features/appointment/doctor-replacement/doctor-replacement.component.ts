import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentActionService } from '../../../../shared/services/appointment/appointment-action.service';
import { SuggestedDoctor } from '../../../../models/responses/appointment/suggested-doctor.model';
import { AssignDoctorRequest } from '../../../../models/requests/appointment/assign-doctor-request';
import { Appointment } from '../../../../models/responses/appointment/appointment.model';
import { PageResponse } from '../../../../models/responses/page-response.model';
import { PageSizeSelectorComponent } from '../../../shared/components/page-size-selector/page-size-selector.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { AdminModalConfirmComponent } from '../../../shared/components/modal-confirm/admin-modal-confirm.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faCircleQuestion,
  faMagnifyingGlass,
  faRotate,
  faUserMd,
  faXmark,
  faCheck,
  faExchangeAlt
} from '@fortawesome/free-solid-svg-icons';
import { getDoctorSuggestionStatusClass } from '../../../../shared/util/status.util';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-doctor-replacement',
  templateUrl: './doctor-replacement.component.html',
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
export class DoctorReplacementComponent implements OnInit {
  @Input() appointment: Appointment | null = null;
  @Output() doctorReplaced = new EventEmitter<boolean>();
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
  faExchangeAlt = faExchangeAlt;

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
    this.appointmentActionService.getSuggestedDoctorsByDoctor(
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
        console.error('Error loading suggested doctors for replacement:', error);
        this.toastr.error('Không thể tải danh sách bác sĩ thay thế', 'Lỗi');
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
    this.confirmTitle = 'Xác nhận thay đổi bác sĩ';
    this.confirmContent = `Bạn có chắc chắn muốn thay đổi bác sĩ hiện tại thành "${suggestedDoctor.doctorServiceResponse.doctorResponse.name}" cho lịch hẹn này không?`;
    this.showConfirmModal = true;
  }

  onConfirmReplace(): void {
    if (!this.selectedDoctorService || !this.appointment?.id) {
      this.toastr.error('Thông tin không hợp lệ', 'Lỗi');
      return;
    }

    const request: AssignDoctorRequest = {
      appointmentId: this.appointment.id,
      doctorServiceId: this.selectedDoctorService.id
    };

    this.appointmentActionService.assignDoctorByDoctor(this.appointment.id, request).subscribe({
      next: (updatedAppointment: Appointment) => {
        this.toastr.success('Thay đổi bác sĩ thành công', 'Thông báo');
        this.showConfirmModal = false;
        this.selectedDoctorService = null;
        this.doctorReplaced.emit(true);
      },
      error: (error) => {
        console.error('Error replacing doctor:', error);
        this.toastr.error('Không thể thay đổi bác sĩ', 'Lỗi');
        this.showConfirmModal = false;
        this.selectedDoctorService = null;
      }
    });
  }

  onCancelReplace(): void {
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
