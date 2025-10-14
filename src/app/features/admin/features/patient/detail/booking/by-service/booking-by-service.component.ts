import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faStethoscope, 
  faCalendarAlt, 
  faCheckCircle,
  faArrowRight,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

// Models
import { Service } from '../../../../../../models/responses/medical/service.model';
import { ServiceCategory } from '../../../../../../models/responses/medical/service-category.model';
import { TimeFrame } from '../../../../../../models/responses/appointment/time-frame.model';
import { Patient } from '../../../../../../models/responses/patient/patient.model';
import { ServiceAppointmentRequest } from '../../../../../../models/requests/appointment/service-appointment.request';

// Services
import { ServiceService } from '../../../../../../shared/services/medical/service.service';
import { ServiceCategoryService } from '../../../../../../shared/services/medical/service-category.service';
import { TimeFrameService } from '../../../../../../shared/services/appointment/time-frame.service';
import { PatientService } from '../../../../../../shared/services/patient/patient.service';
import { AppointmentActionService } from '../../../../../../shared/services/appointment/appointment-action.service';

// Components
import { SelectServiceComponent } from './select-service/select-service.component';
import { SelectDateComponent } from './select-date/select-date.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { AdminModalConfirmComponent } from '../../../../../shared/components/modal-confirm/admin-modal-confirm.component';

@Component({
  selector: 'app-booking-by-service',
  templateUrl: './booking-by-service.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    SelectServiceComponent,
    SelectDateComponent,
    ConfirmComponent,
    AdminModalConfirmComponent
  ]
})
export class BookingByServiceComponent implements OnInit, OnDestroy {
  // Patient info
  patientId: string = '';
  patient: Patient | null = null;

  // Step data
  selectedServiceCategory: ServiceCategory | null = null;
  selectedService: Service | null = null;
  selectedDate: string = '';
  selectedTimeFrame: TimeFrame | null = null;

  // Modal states
  showSelectServiceModal = false;
  showSelectDateModal = false;
  showConfirmModal = false;
  showFinalConfirmModal = false;

  // Step control
  currentStep = 1;
  completedSteps: number[] = [];

  // Icons
  faStethoscope = faStethoscope;
  faCalendarAlt = faCalendarAlt;
  faCheckCircle = faCheckCircle;
  faArrowRight = faArrowRight;
  faInfoCircle = faInfoCircle;

  // Loading states
  loading = false;
  creatingAppointment = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private serviceService: ServiceService,
    private serviceCategoryService: ServiceCategoryService,
    private timeFrameService: TimeFrameService,
    private patientService: PatientService,
    private appointmentActionService: AppointmentActionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Get patientId from route params
    const patientId = this.route.parent?.parent?.snapshot.paramMap.get('patientId');
    if (patientId) {
      this.patientId = patientId;
      this.loadPatientInfo();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPatientInfo(): void {
    this.loading = true;
    this.patientService.getByIdByCustomer(this.patientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (patient: Patient) => {
          this.patient = patient;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading patient:', error);
          this.toastr.error('Không thể tải thông tin bệnh nhân');
          this.loading = false;
        }
      });
  }

  // Step 1: Select Service
  openSelectServiceModal(): void {
    this.showSelectServiceModal = true;
  }

  onServiceSelected(data: { serviceCategory: ServiceCategory, service: Service }): void {
    this.selectedServiceCategory = data.serviceCategory;
    this.selectedService = data.service;
    this.completeStep(1);
    this.resetStepsFrom(2);
    this.showSelectServiceModal = false;
  }

  onSelectServiceModalClose(): void {
    this.showSelectServiceModal = false;
  }

  // Step 2: Select Date and Time
  openSelectDateModal(): void {
    if (!this.selectedService) {
      this.toastr.warning('Vui lòng chọn dịch vụ trước');
      return;
    }
    this.showSelectDateModal = true;
  }

  onDateTimeSelected(data: { date: string, timeFrame: TimeFrame }): void {
    this.selectedDate = data.date;
    this.selectedTimeFrame = data.timeFrame;
    this.completeStep(2);
    this.showSelectDateModal = false;
  }

  onSelectDateModalClose(): void {
    this.showSelectDateModal = false;
  }

  // Step 3: Confirm
  openConfirmModal(): void {
    if (!this.selectedService || !this.selectedDate || !this.selectedTimeFrame) {
      this.toastr.warning('Vui lòng hoàn thành tất cả các bước trước');
      return;
    }
    this.showConfirmModal = true;
  }

  onConfirmModalClose(): void {
    this.showConfirmModal = false;
  }

  onFinalConfirm(): void {
    this.showConfirmModal = false;
    this.showFinalConfirmModal = true;
  }

  onFinalConfirmModalClose(): void {
    this.showFinalConfirmModal = false;
  }

  // Create appointment
  createAppointment(): void {
    if (!this.selectedService || !this.selectedDate || !this.selectedTimeFrame) {
      this.toastr.error('Thiếu thông tin đặt lịch');
      return;
    }

    const request: ServiceAppointmentRequest = {
      patientId: this.patientId,
      serviceId: this.selectedService.id,
      timeFrameId: this.selectedTimeFrame.id,
      appointmentDate: this.selectedDate,
      patientMessage: ''
    };

    this.creatingAppointment = true;
    this.appointmentActionService.createBookingServiceByAdmin(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (appointment: any) => {
          this.toastr.success('Đặt lịch khám thành công!');
          this.resetAllSteps();
          this.showFinalConfirmModal = false;
          this.creatingAppointment = false;
        },
        error: (error: any) => {
          console.error('Error creating appointment:', error);
          this.toastr.error(error?.error?.message || 'Đã xảy ra lỗi khi đặt lịch khám');
          this.creatingAppointment = false;
          this.showFinalConfirmModal = false;
        }
      });
  }

  // Step management
  completeStep(step: number): void {
    if (!this.completedSteps.includes(step)) {
      this.completedSteps.push(step);
    }
    this.currentStep = step + 1;
  }

  resetStepsFrom(step: number): void {
    // Reset data from specified step onwards
    switch (step) {
      case 2:
        this.selectedDate = '';
        this.selectedTimeFrame = null;
        break;
      case 3:
        // No additional data to reset
        break;
    }

    // Remove completed steps from specified step onwards
    this.completedSteps = this.completedSteps.filter(s => s < step);
    this.currentStep = step;
  }

  resetAllSteps(): void {
    this.selectedServiceCategory = null;
    this.selectedService = null;
    this.selectedDate = '';
    this.selectedTimeFrame = null;
    this.completedSteps = [];
    this.currentStep = 1;
  }

  isStepCompleted(step: number): boolean {
    return this.completedSteps.includes(step);
  }

  canAccessStep(step: number): boolean {
    return step <= this.currentStep;
  }

  // Handle step clicks (for going back)
  onStepClick(step: number): void {
    if (step < this.currentStep) {
      this.resetStepsFrom(step + 1);
    }
  }
} 