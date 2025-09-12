import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Location } from '@angular/common';
import { Subject, forkJoin, from, takeUntil } from 'rxjs';

import { Patient } from '../../../models/responses/patient/patient.model';
import { DoctorService as DoctorServiceModel } from '../../../models/responses/doctor/doctor-service.model';
import { DoctorSchedule } from '../../../models/responses/doctor/doctor-schedule.model';
import { AppointmentRequest } from '../../../models/requests/appointment/appointment.request';

import { AppointmentActionService } from '../../../shared/services/appointment/appointment-action.service';
import { PatientService } from '../../../shared/services/patient/patient.service';
import { DoctorServiceService } from '../../../shared/services/doctor/doctor-service.service';
import { DoctorScheduleService } from '../../../shared/services/doctor/doctor-schedule.service';

import { ModalConfirmComponent } from '../../../shared/components/modal-confirm.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { ModalLoadingComponent } from '../../../shared/components/modal-loading.component';

import {formatDate, formatPhone, formatInsuranceId, formatNationalId} from '../../../shared/util/format.util'

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    DatePipe,
    RouterOutlet,
    ModalConfirmComponent,
    FontAwesomeModule,
    ModalLoadingComponent
  ],
  templateUrl: './confirm.component.html'
})
export class ConfirmComponent implements OnInit, OnDestroy {
  // Data để bind vào template
  patient: Patient | null = null;
  doctorService: DoctorServiceModel | null = null;
  doctorSchedule: DoctorSchedule | null = null;

  // Điều khiển modal confirm
  isConfirmModalOpen = false;

  // Lấy params
  private patientId!: string;
  private doctorServiceId!: string;
  private doctorScheduleId!: string;
  appointmentDate!: string;

  private destroy$ = new Subject<void>();

  faArrowLeft = faArrowLeft;
  faCircleInfo = faCircleInfo;

  loadingData = true;
  loadingCreate = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private appointmentActionService: AppointmentActionService,
    private patientService: PatientService,
    private doctorServiceService: DoctorServiceService,
    private doctorScheduleService: DoctorScheduleService,
    private toastr: ToastrService
  ) { }

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

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loadingData = true;

    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        // Xác định các cấp cha
        const current = this.route.snapshot.paramMap; // ConfirmComponent
        const parent = this.route.parent?.snapshot.paramMap; // :patientId
        const grandParent = this.route.parent?.parent?.snapshot.paramMap; // :doctorScheduleId, :date
        const greatGrandParent = this.route.parent?.parent?.parent?.snapshot.paramMap; // :doctorServiceId

        this.patientId = parent?.get('patientId') || '';
        this.doctorScheduleId = grandParent?.get('doctorScheduleId') || '';
        this.appointmentDate = grandParent?.get('date') || '';
        this.doctorServiceId = greatGrandParent?.get('doctorServiceId') || '';

        // Log kiểm tra
        console.log('patientId', this.patientId);
        console.log('doctorScheduleId', this.doctorScheduleId);
        console.log('appointmentDate', this.appointmentDate);
        console.log('doctorServiceId', this.doctorServiceId);

        // Gọi API như cũ
        forkJoin({
          patient: this.patientService.getByIdByCustomer(this.patientId),
          doctorService: this.doctorServiceService.getById(this.doctorServiceId),
          doctorSchedule: this.doctorScheduleService.getById(this.doctorScheduleId)
        })
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: ({ patient, doctorService, doctorSchedule }) => {
              this.patient = patient;
              this.doctorService = doctorService;
              this.doctorSchedule = doctorSchedule;
              this.loadingData = false;
            },
            error: (error) => {
              console.error('Error fetching data:', error);
              this.toastr.error('Đã xảy ra lỗi khi tải dữ liệu');
              this.loadingData = false;
            }
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Quay về trang trước
  goBack(): void {
    this.location.back();
  }

  // Mở modal xác nhận
  openConfirm(): void {
    this.isConfirmModalOpen = true;
  }

  // Thực hiện tạo appointment sau khi user confirm
  handleConfirm(): void {
    this.isConfirmModalOpen = false;

    // Kiểm tra dữ liệu đầu vào
    if (!this.patientId || !this.doctorServiceId || !this.doctorScheduleId || !this.appointmentDate) {
      this.toastr.error('Thiếu thông tin đặt lịch, vui lòng thử lại.');
      return;
    }

    // Nếu chắc chắn là yyyy-MM-dd thì không cần xử lý lại
    const formattedDate = this.appointmentDate;

    const request: AppointmentRequest = {
      patientId: this.patientId,
      doctorServiceId: this.doctorServiceId,
      doctorScheduleId: this.doctorScheduleId,
      appointmentDate: formattedDate,
    };

    console.log('Gửi yêu cầu tạo appointment:', request);

    this.loadingCreate = true;
    this.appointmentActionService.createByCustomer(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: appointment => {
          console.log('Đặt lịch thành công!');
          this.loadingCreate = false;
          this.router.navigate([appointment.id], { relativeTo: this.route });
        },
        error: err => {
          console.error('Lỗi khi tạo lịch:', err);
          this.loadingCreate = false;
          this.toastr.error(err?.error?.message || 'Đã xảy ra lỗi khi tạo lịch hẹn');
        }
      });
  }
}
