import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faUserMd, 
  faStethoscope, 
  faCalendarAlt, 
  faCheckCircle,
  faArrowRight,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

// Models
import { Doctor } from '../../../../../../models/responses/doctor/doctor.model';
import { DoctorService as DoctorServiceModel } from '../../../../../../models/responses/doctor/doctor-service.model';
import { DoctorSchedule } from '../../../../../../models/responses/doctor/doctor-schedule.model';
import { Patient } from '../../../../../../models/responses/patient/patient.model';
import { AppointmentRequest } from '../../../../../../models/requests/appointment/appointment.request';

// Services
import { DoctorService } from '../../../../../../shared/services/doctor/doctor.service';
import { DoctorServiceService } from '../../../../../../shared/services/doctor/doctor-service.service';
import { DoctorScheduleService } from '../../../../../../shared/services/doctor/doctor-schedule.service';
import { PatientService } from '../../../../../../shared/services/patient/patient.service';
import { AppointmentActionService } from '../../../../../../shared/services/appointment/appointment-action.service';

// Components
import { SelectDoctorComponent } from './select-doctor/select-doctor.component';
import { SelectDoctorServiceComponent } from './select-doctor-service/select-doctor-service.component';
import { SelectDateComponent } from './select-date/select-date.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { AdminModalConfirmComponent } from '../../../../../shared/components/modal-confirm/admin-modal-confirm.component';

@Component({
  selector: 'app-booking-by-doctor',
  templateUrl: './booking-by-doctor.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    SelectDoctorComponent,
    SelectDoctorServiceComponent,
    SelectDateComponent,
    ConfirmComponent,
    AdminModalConfirmComponent
  ]
})
export class BookingByDoctorComponent implements OnInit, OnDestroy {
  // Patient info
  patientId: string = '';
  patient: Patient | null = null;

  // Step data
  selectedDoctor: Doctor | null = null;
  selectedDoctorService: DoctorServiceModel | null = null;
  selectedDate: string = '';
  selectedDoctorSchedule: DoctorSchedule | null = null;

  // Modal states
  showSelectDoctorModal = false;
  showSelectServiceModal = false;
  showSelectDateModal = false;
  showSelectTimeModal = false;
  showConfirmModal = false;
  showFinalConfirmModal = false;

  // Step control
  currentStep = 1;
  completedSteps: number[] = [];

  // Icons
  faUserMd = faUserMd;
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
    private doctorService: DoctorService,
    private doctorServiceService: DoctorServiceService,
    private doctorScheduleService: DoctorScheduleService,
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

  // Step 1: Select Doctor
  openSelectDoctorModal(): void {
    this.showSelectDoctorModal = true;
  }

  onDoctorSelected(doctor: Doctor): void {
    this.selectedDoctor = doctor;
    this.completeStep(1);
    this.resetStepsFrom(2);
    this.showSelectDoctorModal = false;
  }

  onSelectDoctorModalClose(): void {
    this.showSelectDoctorModal = false;
  }

  // Step 2: Select Doctor Service
  openSelectServiceModal(): void {
    if (!this.selectedDoctor) {
      this.toastr.warning('Vui lòng chọn bác sĩ trước');
      return;
    }
    this.showSelectServiceModal = true;
  }

  onDoctorServiceSelected(doctorService: DoctorServiceModel): void {
    this.selectedDoctorService = doctorService;
    this.completeStep(2);
    this.resetStepsFrom(3);
    this.showSelectServiceModal = false;
  }

  onSelectServiceModalClose(): void {
    this.showSelectServiceModal = false;
  }

  // Step 3: Select Date
  openSelectDateModal(): void {
    if (!this.selectedDoctor || !this.selectedDoctorService) {
      this.toastr.warning('Vui lòng hoàn thành các bước trước');
      return;
    }
    this.showSelectDateModal = true;
  }

  onDateSelected(data: { date: string, doctorSchedule: DoctorSchedule }): void {
    this.selectedDate = data.date;
    this.selectedDoctorSchedule = data.doctorSchedule;
    this.completeStep(3);
    this.showSelectDateModal = false;
  }

  onSelectDateModalClose(): void {
    this.showSelectDateModal = false;
  }

  // Step 4: Confirm
  openConfirmModal(): void {
    if (!this.selectedDoctor || !this.selectedDoctorService || !this.selectedDate || !this.selectedDoctorSchedule) {
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
    if (!this.selectedDoctor || !this.selectedDoctorService || !this.selectedDate || !this.selectedDoctorSchedule) {
      this.toastr.error('Thiếu thông tin đặt lịch');
      return;
    }

    const request: AppointmentRequest = {
      patientId: this.patientId,
      doctorServiceId: this.selectedDoctorService.id,
      doctorScheduleId: this.selectedDoctorSchedule.id,
      appointmentDate: this.selectedDate
    };

    this.creatingAppointment = true;
    this.appointmentActionService.createByAdmin(request)
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
        this.selectedDoctorService = null;
        this.selectedDate = '';
        this.selectedDoctorSchedule = null;
        break;
      case 3:
        this.selectedDate = '';
        this.selectedDoctorSchedule = null;
        break;
      case 4:
        // No additional data to reset
        break;
    }

    // Remove completed steps from specified step onwards
    this.completedSteps = this.completedSteps.filter(s => s < step);
    this.currentStep = step;
  }

  resetAllSteps(): void {
    this.selectedDoctor = null;
    this.selectedDoctorService = null;
    this.selectedDate = '';
    this.selectedDoctorSchedule = null;
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