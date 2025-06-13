import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoctorScheduleService } from '../../../../../shared/services/doctor/doctor-schedule.service';
import { TimeFrameService } from '../../../../../shared/services/appointment/time-frame.service';
import { DoctorScheduleStatus } from '../../../../../models/responses/doctor/doctor-schedule-status.model';
import { TimeFrame } from '../../../../../models/responses/appointment/time-frame.model';
import { DoctorSchedule } from '../../../../../models/responses/doctor/doctor-schedule.model';
import { DoctorScheduleRequest } from '../../../../../models/requests/doctor/doctor-schedule.request';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminModalConfirmComponent } from '../../../../shared/components/modal-confirm/admin-modal-confirm.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen, faCalendarDays, faChartSimple} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-doctor-schedule',
  templateUrl: './edit-doctor-schedule.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminModalConfirmComponent,
    FontAwesomeModule
  ]
})
export class EditDoctorScheduleComponent implements OnInit {
  doctorId: string | null = null;

  // FontAwesome
  faPen = faPen;
  faCalendarDays = faCalendarDays;
  faChartSimple = faChartSimple;
  // Tabs ngày trong tuần
  daysOfWeek = [
    { key: 'MONDAY', label: 'Thứ hai' },
    { key: 'TUESDAY', label: 'Thứ ba' },
    { key: 'WEDNESDAY', label: 'Thứ tư' },
    { key: 'THURSDAY', label: 'Thứ năm' },
    { key: 'FRIDAY', label: 'Thứ sáu' },
    { key: 'SATURDAY', label: 'Thứ bảy' },
    { key: 'SUNDAY', label: 'Chủ nhật' }
  ];
  selectedDay: string = 'MONDAY';

  // Dữ liệu
  statuses: DoctorScheduleStatus[] = [];
  sessions: string[] = [];
  timeFrames: TimeFrame[] = [];
  schedules: DoctorSchedule[] = [];
  selectedSession: string = '';

  // Dữ liệu để binding 2 chiều cho từng dòng
  editableRows: {
    [timeFrameId: string]: {
      maxPatients: number;
      status: boolean;
    }
  } = {};

  // Modal xác nhận
  showConfirmModal: boolean = false;
  confirmTitle: string = '';
  confirmContent: string = '';
  scheduleToUpdate: { timeFrame: TimeFrame, data: any } | null = null;

  constructor(
    private route: ActivatedRoute,
    private doctorScheduleService: DoctorScheduleService,
    private timeFrameService: TimeFrameService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    console.log('Component Doctor Schedule initialized');
    this.route.paramMap.subscribe(params => {
      const current = this.route.snapshot.paramMap;                 // DoctorServiceComponent
        const level1 = this.route.parent?.snapshot.paramMap;          // DanhSachBacSiComponent chứa :doctorId
        const level2 = this.route.parent?.parent?.snapshot.paramMap;  // Nếu có, ví dụ cấp trên nữa

        this.doctorId = current?.get('doctorId') || '';
        console.log('doctorId', this.doctorId);
      if (this.doctorId) {
        this.loadInitData();
      }
    });
  }

  loadInitData() {
    this.doctorScheduleService.getStatuses().subscribe((res: DoctorScheduleStatus[]) => this.statuses = res);
    this.timeFrameService.getAllSessions().subscribe((res: string[]) => {
      this.sessions = res;
      if (res.length > 0) {
        this.selectedSession = res[0]; // Chọn buổi đầu tiên mặc định
      }
    });
    this.timeFrameService.getAllActiveTimeFrames().subscribe((res: TimeFrame[]) => {
      this.timeFrames = res;
      this.loadSchedules();
    });
  }

  loadSchedules() {
    if (!this.doctorId) return;
    this.doctorScheduleService.getSchedules(this.doctorId, this.selectedDay)
      .subscribe((res: DoctorSchedule[]) => {
        this.schedules = res;
        this.initEditableRows();
      });
  }

  onSelectDay(day: string) {
    this.selectedDay = day;
    this.loadSchedules();
  }

  onSelectSession(session: string) {
    this.selectedSession = session;
  }

  // Lấy schedule theo timeFrameId
  getScheduleByTimeFrame(timeFrameId: string): DoctorSchedule | null {
    return this.schedules.find(s => s.timeFrameId === timeFrameId) || null;
  }

  // Khởi tạo editableRows cho binding 2 chiều
  initEditableRows() {
    this.editableRows = {};
    for (const tf of this.timeFrames) {
      const schedule = this.getScheduleByTimeFrame(tf.id);
      this.editableRows[tf.id] = {
        maxPatients: schedule ? schedule.maxPatients : 0,
        status: schedule ? schedule.status : false
      };
    }
  }

  onUpdateSchedule(timeFrame: TimeFrame) {
    this.confirmTitle = 'Xác nhận cập nhật';
    this.confirmContent = 'Bạn có chắc chắn muốn cập nhật lịch làm việc này?';
    this.showConfirmModal = true;
    this.scheduleToUpdate = {
      timeFrame: timeFrame,
      data: {
        maxPatients: this.editableRows[timeFrame.id].maxPatients,
        status: this.editableRows[timeFrame.id].status
      }
    };
  }

  onConfirmUpdate() {
    if (!this.scheduleToUpdate || !this.doctorId) return;

    const req: DoctorScheduleRequest = {
      doctorId: this.doctorId,
      timeFrameId: this.scheduleToUpdate.timeFrame.id,
      dayOfWeek: this.selectedDay,
      maxPatients: this.scheduleToUpdate.data.maxPatients,
      status: this.scheduleToUpdate.data.status
    };

    this.doctorScheduleService.createOrUpdateBatch([req]).subscribe({
      next: () => {
        this.toastr.success('Cập nhật lịch làm việc thành công');
        this.showConfirmModal = false;
        this.loadSchedules();
      },
      error: () => {
        this.toastr.error('Cập nhật lịch làm việc thất bại');
        this.showConfirmModal = false;
      }
    });
  }

  onCancelUpdate() {
    this.showConfirmModal = false;
    this.scheduleToUpdate = null;
  }

  // Lấy danh sách timeFrame theo session
  getTimeFramesBySession(session: string): TimeFrame[] {
    return this.timeFrames.filter(tf => tf.session === session);
  }
} 