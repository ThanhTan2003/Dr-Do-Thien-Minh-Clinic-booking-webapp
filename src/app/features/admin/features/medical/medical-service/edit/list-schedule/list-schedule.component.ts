import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceScheduleService } from '../../../../../../shared/services/medical/service-schedule.service';
import { TimeFrameService } from '../../../../../../shared/services/appointment/time-frame.service';
import { DoctorScheduleStatus } from '../../../../../../models/responses/doctor/doctor-schedule-status.model';
import { ServiceSchedule } from '../../../../../../models/responses/medical/service-schedule.model';
import { ServiceScheduleRequest } from '../../../../../../models/requests/medical/service-schedule-request';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminModalConfirmComponent } from '../../../../../shared/components/modal-confirm/admin-modal-confirm.component';
import { AdminModalConfirmDeleteComponent } from '../../../../../shared/components/modal-confirm-delete/admin-modal-confirm-delete.component';
import { CreateServiceScheduleComponent } from './create/create-service-schedule.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen, faCalendarDays, faChartSimple, faTrash, faSave, faPlus} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-medical-service-list-schedule',
  templateUrl: './list-schedule.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminModalConfirmComponent,
    AdminModalConfirmDeleteComponent,
    CreateServiceScheduleComponent,
    FontAwesomeModule
  ]
})
export class MedicalServiceListScheduleComponent implements OnInit {
  serviceId: string | null = null;

  // FontAwesome
  faPen = faPen;
  faCalendarDays = faCalendarDays;
  faChartSimple = faChartSimple;
  faTrash = faTrash;
  faSave = faSave;
  faPlus = faPlus;
  
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
  schedules: ServiceSchedule[] = [];
  selectedSession: string = '';
  selectedStatus: string = '';

  // Dữ liệu để binding 2 chiều cho từng dòng
  editableRows: {
    [scheduleId: string]: {
      maxPatients: number;
      status: boolean;
      originalMaxPatients: number;
      originalStatus: boolean;
      hasChanges: boolean;
    }
  } = {};

  // Theo dõi các thay đổi
  changedScheduleIds: Set<string> = new Set();

  // Modal xác nhận
  showConfirmModal: boolean = false;
  confirmTitle: string = '';
  confirmContent: string = '';
  scheduleToUpdate: { schedule: ServiceSchedule, data: any } | null = null;

  // Modal xác nhận xóa
  showDeleteModal: boolean = false;
  deleteTitle: string = '';
  deleteContent: string = '';
  scheduleToDelete: ServiceSchedule | null = null;

  // Modal tạo mới lịch khám
  showCreateModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceScheduleService: ServiceScheduleService,
    private timeFrameService: TimeFrameService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Component Service Schedule initialized');
    
    // Đọc query params để khôi phục trạng thái
    this.route.queryParams.subscribe(params => {
      const newDay = params['day'] || 'MONDAY';
      const newSession = params['session'] || '';
      const newStatus = params['status'] || '';

      if (newDay !== this.selectedDay) {
        this.selectedDay = newDay;
      }
      if (newSession !== this.selectedSession && newSession !== '') {
        this.selectedSession = newSession;
      }
      if (newStatus !== this.selectedStatus) {
        this.selectedStatus = newStatus;
      }
    });

    this.route.paramMap.subscribe(params => {
      this.serviceId = this.route.parent?.snapshot.paramMap?.get('serviceId') || '';
      console.log('serviceId', this.serviceId);
      if (this.serviceId) {
        this.loadInitData();
      }
    });
  }

  loadInitData() {
    this.serviceScheduleService.getStatuses().subscribe((res: DoctorScheduleStatus[]) => this.statuses = res);
    this.timeFrameService.getAllSessions().subscribe((res: string[]) => {
      this.sessions = ['Tất cả', ...res];
      if (res.length > 0 && !this.selectedSession) {
        this.selectedSession = 'Tất cả';
        this.updateQueryParams();
      }
    });
    this.loadSchedules();
  }

  loadSchedules() {
    if (!this.serviceId) return;
    
    let status: boolean | undefined = undefined;
    if (this.selectedStatus && this.selectedStatus !== '') {
      status = this.selectedStatus === 'true';
    }

    const sessionParam = this.selectedSession === 'Tất cả' ? undefined : this.selectedSession;

    this.serviceScheduleService.getServiceSchedules(
      this.serviceId,
      this.selectedDay,
      sessionParam,
      status
    ).subscribe((res: ServiceSchedule[]) => {
      this.schedules = res;
      this.initEditableRows();
    });
  }

  onSelectDay(day: string) {
    this.selectedDay = day;
    this.updateQueryParams();
    this.loadSchedules();
  }

  onSelectSession(session: string) {
    this.selectedSession = session;
    this.updateQueryParams();
    this.loadSchedules();
  }

  onSelectStatus(status: string) {
    this.selectedStatus = status;
    this.updateQueryParams();
    this.loadSchedules();
  }

  initEditableRows() {
    this.editableRows = {};
    this.changedScheduleIds.clear();
    
    for (const schedule of this.schedules) {
      this.editableRows[schedule.id] = {
        maxPatients: schedule.maxPatients,
        status: schedule.status,
        originalMaxPatients: schedule.maxPatients,
        originalStatus: schedule.status,
        hasChanges: false
      };
    }
  }

  onFieldChange(scheduleId: string) {
    const editableRow = this.editableRows[scheduleId];
    if (!editableRow) return;

    const hasChanges = editableRow.maxPatients !== editableRow.originalMaxPatients || 
                      editableRow.status !== editableRow.originalStatus;
    
    editableRow.hasChanges = hasChanges;
    
    if (hasChanges) {
      this.changedScheduleIds.add(scheduleId);
    } else {
      this.changedScheduleIds.delete(scheduleId);
    }
  }

  onUpdateSchedule(schedule: ServiceSchedule) {
    this.confirmTitle = 'Xác nhận cập nhật';
    this.confirmContent = 'Bạn có chắc chắn muốn cập nhật lịch làm việc này?';
    this.showConfirmModal = true;
    this.scheduleToUpdate = {
      schedule: schedule,
      data: {
        maxPatients: this.editableRows[schedule.id].maxPatients,
        status: this.editableRows[schedule.id].status
      }
    };
  }

  onConfirmUpdate() {
    if (!this.scheduleToUpdate) return;

    const req: ServiceScheduleRequest = {
      id: this.scheduleToUpdate.schedule.id,
      serviceId: this.scheduleToUpdate.schedule.serviceId,
      maxPatients: this.scheduleToUpdate.data.maxPatients,
      status: this.scheduleToUpdate.data.status
    };

    this.serviceScheduleService.updateBatch([req]).subscribe({
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

  onDeleteSchedule(schedule: ServiceSchedule) {
    this.deleteTitle = 'Xác nhận xóa';
    this.deleteContent = `Bạn có chắc chắn muốn xóa lịch khám "${schedule.timeFrameResponse.name}" không?`;
    this.showDeleteModal = true;
    this.scheduleToDelete = schedule;
  }

  onConfirmDelete(): void {
    if (!this.scheduleToDelete) {
      console.warn('Không có lịch làm việc được chọn để xoá.');
      return;
    }

    console.log('Bắt đầu xoá lịch làm việc với ID:', this.scheduleToDelete.id);

    this.serviceScheduleService.delete(this.scheduleToDelete.id).subscribe({
      next: (res) => {
        console.log('Xóa thành công. Response:', res);
        this.toastr.success('Xóa lịch làm việc thành công', 'Thông báo');
        this.showDeleteModal = false;
        this.scheduleToDelete = null;
        this.loadSchedules();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.showDeleteModal = false;
        this.scheduleToDelete = null;
        console.error('Lỗi khi xoá lịch làm việc:', error);

        if (error.status === 500 && error.error?.message) {
          this.toastr.error(error.error.message, 'Lỗi');
        } else {
          this.toastr.error('Không thể xóa lịch làm việc', 'Lỗi');
        }

        this.cdr.detectChanges();
      }
    });
  }

  onCancelDelete() {
    this.showDeleteModal = false;
    this.scheduleToDelete = null;
  }

  onUpdateAll() {
    if (this.changedScheduleIds.size === 0) {
      this.toastr.warning('Không có thay đổi nào để cập nhật');
      return;
    }

    const requests: ServiceScheduleRequest[] = [];
    
    for (const scheduleId of this.changedScheduleIds) {
      const editableRow = this.editableRows[scheduleId];
      const schedule = this.schedules.find(s => s.id === scheduleId);
      
      if (editableRow && schedule) {
        requests.push({
          id: scheduleId,
          serviceId: schedule.serviceId,
          maxPatients: editableRow.maxPatients,
          status: editableRow.status
        });
      }
    }

    if (requests.length === 0) return;

    this.serviceScheduleService.updateBatch(requests).subscribe({
      next: () => {
        this.toastr.success(`Cập nhật thành công ${requests.length} lịch làm việc`);
        this.loadSchedules();
      },
      error: () => {
        this.toastr.error('Cập nhật lịch làm việc thất bại');
      }
    });
  }

  getSchedulesBySession(session: string): ServiceSchedule[] {
    if (session === 'Tất cả') {
      return this.schedules;
    }
    return this.schedules.filter(schedule => schedule.timeFrameResponse.session === session);
  }

  getAvailableSessions(): string[] {
    return this.sessions;
  }

  getScheduleCountBySession(session: string): number {
    if (session === 'Tất cả') {
      return this.schedules.length;
    }
    return this.schedules.filter(schedule => schedule.timeFrameResponse.session === session).length;
  }

  getSessionColor(session: string): string {
    const colors: { [key: string]: string } = {
      'Sáng': 'bg-orange-100 text-orange-800',
      'Chiều': 'bg-blue-100 text-blue-800', 
      'Tối': 'bg-purple-100 text-purple-800',
      'Đêm': 'bg-indigo-100 text-indigo-800'
    };
    return colors[session] || 'bg-gray-100 text-gray-800';
  }

  getRowSessionColor(session: string): string {
    return '';
  }

  onCreateSchedule(): void {
    this.showCreateModal = true;
  }

  onScheduleCreated(): void {
    this.showCreateModal = false;
    this.loadSchedules();
  }

  updateQueryParams() {
    const queryParams: any = {
      day: this.selectedDay
    };

    if (this.selectedSession && this.selectedSession.trim() !== '') {
      queryParams.session = this.selectedSession;
    }

    if (this.selectedStatus && this.selectedStatus.trim() !== '') {
      queryParams.status = this.selectedStatus;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }
}
