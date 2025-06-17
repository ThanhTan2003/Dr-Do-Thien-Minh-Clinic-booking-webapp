import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Location } from '@angular/common';
import { Subject, forkJoin, from, takeUntil } from 'rxjs';

import { Patient } from '../../../models/responses/patient/patient.model';
import { DoctorService as DoctorServiceModel } from '../../../models/responses/doctor/doctor-service.model';
import { DoctorSchedule } from '../../../models/responses/doctor/doctor-schedule.model';
import { AppointmentRequest } from '../../../models/requests/appointment/appointment.request';

import { AppointmentService } from '../../../shared/services/appointment/appointment.service';
import { PatientService } from '../../../shared/services/patient/patient.service';
import { DoctorServiceService } from '../../../shared/services/doctor/doctor-service.service';
import { DoctorScheduleService } from '../../../shared/services/doctor/doctor-schedule.service';

import { ModalConfirmComponent } from '../../../shared/components/modal-confirm.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    DatePipe,
    RouterOutlet,
    ModalConfirmComponent,
    FontAwesomeModule
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private doctorServiceService: DoctorServiceService,
    private doctorScheduleService: DoctorScheduleService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Cuộn lên đầu trang
    window.scrollTo(0, 0);

    console.log('ngOnInit PatientComponent-----------------------------------------------------------');

    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const current = this.route.snapshot.paramMap; // ConfirmComponent level
        const level1 = this.route.parent?.snapshot.paramMap; // PatientComponent
        const level2 = this.route.parent?.snapshot.paramMap; // ScheduleComponent
        const level3 = this.route.parent?.parent?.snapshot.paramMap; // DoctorServiceComponent

        this.patientId = current.get('patientId') || '';
        console.log('patientId', this.patientId);

        this.doctorScheduleId = level2?.get('doctorScheduleId') || '';
        console.log('doctorScheduleId', this.doctorScheduleId);

        this.appointmentDate = level2?.get('date') || '';
        console.log('appointmentDate', this.appointmentDate);

        this.doctorServiceId = level3?.get('doctorServiceId') || '';
        console.log('doctorServiceId', this.doctorServiceId);

        // Gọi song song 3 API để lấy data
        forkJoin({
          patient: this.patientService.getById(this.patientId),
          doctorService: this.doctorServiceService.getById(this.doctorServiceId),
          doctorSchedule: this.doctorScheduleService.getById(this.doctorScheduleId)
        })
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: ({ patient, doctorService, doctorSchedule }) => {
              this.patient = patient;
              this.doctorService = doctorService;
              this.doctorSchedule = doctorSchedule;
            },
            error: (error) => {
              console.error('Error fetching data:', error);
              this.toastr.error('Đã xảy ra lỗi khi tải dữ liệu');
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

    this.appointmentService.create(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: appointment => {
          console.log('Đặt lịch thành công!');
          this.router.navigate([appointment.id], { relativeTo: this.route });
        },
        error: err => {
          console.error('Lỗi khi tạo lịch:', err);
          this.toastr.error(err?.error?.message || 'Đã xảy ra lỗi khi tạo lịch hẹn');
        }
      });
  }
}
