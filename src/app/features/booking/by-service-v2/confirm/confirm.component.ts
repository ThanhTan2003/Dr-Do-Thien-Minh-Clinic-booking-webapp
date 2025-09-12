import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Location } from '@angular/common';
import { Subject, forkJoin, from, takeUntil } from 'rxjs';

import { Patient } from '../../../models/responses/patient/patient.model';
import { Service } from '../../../models/responses/medical/service.model';
import { TimeFrame } from '../../../models/responses/appointment/time-frame.model';
import { ServiceAppointmentRequest } from '../../../models/requests/appointment/service-appointment.request';

import { AppointmentActionService } from '../../../shared/services/appointment/appointment-action.service';
import { PatientService } from '../../../shared/services/patient/patient.service';
import { ServiceService } from '../../../shared/services/medical/service.service';
import { TimeFrameService } from '../../../shared/services/appointment/time-frame.service';

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
    ModalLoadingComponent,
    FormsModule
  ],
  templateUrl: './confirm.component.html'
})
export class ConfirmComponent implements OnInit, OnDestroy {
  // Data để bind vào template
  patient: Patient | null = null;
  service: Service | null = null;
  timeFrame: TimeFrame | null = null;
  patientMessage: string = '';

  // Điều khiển modal confirm
  isConfirmModalOpen = false;

  // Lấy params
  private patientId!: string;
  private serviceId!: string;
  private timeFrameId!: string;
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
    private serviceService: ServiceService,
    private timeFrameService: TimeFrameService,
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
    // Cuộn lên đầu trang
    window.scrollTo(0, 0);

    console.log('ngOnInit ConfirmComponent-----------------------------------------------------------');

    this.loadingData = true;

    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const current = this.route.snapshot.paramMap; // ConfirmComponent
        const parent = this.route.parent?.snapshot.paramMap; // :patientId
        const grandParent = this.route.parent?.parent?.snapshot.paramMap; // :timeFrameId, :date
        const greatGrandParent = this.route.parent?.parent?.parent?.snapshot.paramMap; // :serviceId

        this.patientId = parent?.get('patientId') || '';
        console.log('patientId', this.patientId);

        this.timeFrameId = grandParent?.get('timeFrameId') || '';
        console.log('timeFrameId', this.timeFrameId);

        this.appointmentDate = grandParent?.get('date') || '';
        console.log('appointmentDate', this.appointmentDate);

        this.serviceId = greatGrandParent?.get('serviceId') || '';
        console.log('serviceId', this.serviceId);

        // Gọi song song 3 API để lấy data
        forkJoin({
          patient: this.patientService.getByIdByCustomer(this.patientId),
          service: this.serviceService.getById(this.serviceId),
          timeFrame: this.timeFrameService.getById(this.timeFrameId)
        })
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: ({ patient, service, timeFrame }) => {
              this.patient = patient;
              console.log("lay ket qua patient: ", patient);
              this.service = service;
              this.timeFrame = timeFrame;
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
    if (!this.patientId || !this.serviceId || !this.timeFrameId || !this.appointmentDate) {
      this.toastr.error('Thiếu thông tin đặt lịch, vui lòng thử lại.');
      return;
    }

    // Nếu chắc chắn là yyyy-MM-dd thì không cần xử lý lại
    const formattedDate = this.appointmentDate;

    const request: ServiceAppointmentRequest = {
      patientId: this.patientId,
      serviceId: this.serviceId,
      timeFrameId: this.timeFrameId,
      appointmentDate: formattedDate,
      patientMessage: this.patientMessage,
    };

    console.log('Gửi yêu cầu tạo appointment:', request);

    this.loadingCreate = true;
    this.appointmentActionService.createBookingServiceByCustomer(request)
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
