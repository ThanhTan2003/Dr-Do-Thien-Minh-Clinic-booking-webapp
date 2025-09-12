import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { AdminModalConfirmDeleteComponent } from '../../../../shared/components/modal-confirm-delete/admin-modal-confirm-delete.component';
import { CreateDoctorScheduleComponent } from './create/create-doctor-schedule.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen, faCalendarDays, faChartSimple, faTrash, faSave, faPlus} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-doctor-schedule',
  templateUrl: './edit-doctor-schedule.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminModalConfirmComponent,
    AdminModalConfirmDeleteComponent,
    CreateDoctorScheduleComponent,
    FontAwesomeModule
  ]
})
export class EditDoctorScheduleComponent implements OnInit {
  doctorId: string | null = null;

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
  schedules: DoctorSchedule[] = [];
  selectedSession: string = '';
  selectedStatus: string = ''; // Thêm filter theo trạng thái

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
  scheduleToUpdate: { schedule: DoctorSchedule, data: any } | null = null;

  // Modal xác nhận xóa
  showDeleteModal: boolean = false;
  deleteTitle: string = '';
  deleteContent: string = '';
  scheduleToDelete: DoctorSchedule | null = null;

  // Modal tạo mới lịch khám
  showCreateModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorScheduleService: DoctorScheduleService,
    private timeFrameService: TimeFrameService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Component Doctor Schedule initialized');
    
    // Đọc query params để khôi phục trạng thái
    this.route.queryParams.subscribe(params => {
      const newDay = params['day'] || 'MONDAY';
      const newSession = params['session'] || '';
      const newStatus = params['status'] || '';

      // Cập nhật các giá trị nếu chúng thay đổi
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
      const current = this.route.snapshot.paramMap;                 // DoctorServiceComponent
        const level1 = this.route.parent?.snapshot.paramMap;          // DanhSachBacSiComponent chứa :doctorId
        const level2 = this.route.parent?.parent?.snapshot.paramMap;  // Nếu có, ví dụ cấp trên nữa

        this.doctorId = this.route.parent?.snapshot.paramMap?.get('doctorId') || '';
        console.log('doctorId', this.doctorId);
      if (this.doctorId) {
        this.loadInitData();
      }
    });
  }

  loadInitData() {
    this.doctorScheduleService.getStatuses().subscribe((res: DoctorScheduleStatus[]) => this.statuses = res);
    this.timeFrameService.getAllSessions().subscribe((res: string[]) => {
      this.sessions = ['Tất cả', ...res]; // Thêm option "Tất cả" vào đầu danh sách
      if (res.length > 0 && !this.selectedSession) {
        this.selectedSession = 'Tất cả'; // Chọn "Tất cả" làm mặc định
        this.updateQueryParams();
      }
    });
    this.loadSchedules();
  }

  loadSchedules() {
    if (!this.doctorId) return;
    
    // Chuẩn bị parameters cho API call
    let status: boolean | undefined = undefined;
    if (this.selectedStatus && this.selectedStatus !== '') {
      status = this.selectedStatus === 'true';
    }

    // Nếu chọn "Tất cả" thì không truyền session parameter
    const sessionParam = this.selectedSession === 'Tất cả' ? undefined : this.selectedSession;

    this.doctorScheduleService.getDoctorSchedules(
      this.doctorId,
      this.selectedDay,
      sessionParam,
      status
    ).subscribe((res: DoctorSchedule[]) => {
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

  // Khởi tạo editableRows cho binding 2 chiều
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

  // Theo dõi thay đổi cho từng dòng
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

  onUpdateSchedule(schedule: DoctorSchedule) {
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

    const req: DoctorScheduleRequest = {
      id: this.scheduleToUpdate.schedule.id,
      doctorId: this.scheduleToUpdate.schedule.doctorId,
      maxPatients: this.scheduleToUpdate.data.maxPatients,
      status: this.scheduleToUpdate.data.status
    };

    this.doctorScheduleService.updateBatch([req]).subscribe({
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

  // Xử lý xóa schedule
  onDeleteSchedule(schedule: DoctorSchedule) {
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

    this.doctorScheduleService.delete(this.scheduleToDelete.id).subscribe({
      next: (res) => {
        console.log('Xóa thành công. Response:', res);
        this.toastr.success('Xóa lịch làm việc thành công', 'Thông báo');
        this.showDeleteModal = false;
        this.scheduleToDelete = null;
        this.loadSchedules();
        console.log('Gọi detectChanges() sau thành công xoá');
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.showDeleteModal = false;
        this.scheduleToDelete = null;
        console.error('Lỗi khi xoá lịch làm việc:', error);

        if (error.status === 500 && error.error?.message) {
          this.toastr.error(error.error.message, 'Lỗi');
          console.log('Lỗi 500 với message:', error.error.message);
        } else {
          this.toastr.error('Không thể xóa lịch làm việc', 'Lỗi');
          console.log('Lỗi khác:', error.status);
        }

        console.log('Gọi detectChanges() sau khi lỗi xảy ra');
        this.cdr.detectChanges();
      }
    });
  }

  onCancelDelete() {
    this.showDeleteModal = false;
    this.scheduleToDelete = null;
  }

  // Cập nhật tất cả các thay đổi
  onUpdateAll() {
    if (this.changedScheduleIds.size === 0) {
      this.toastr.warning('Không có thay đổi nào để cập nhật');
      return;
    }

    const requests: DoctorScheduleRequest[] = [];
    
    for (const scheduleId of this.changedScheduleIds) {
      const editableRow = this.editableRows[scheduleId];
      const schedule = this.schedules.find(s => s.id === scheduleId);
      
      if (editableRow && schedule) {
        requests.push({
          id: scheduleId,
          doctorId: schedule.doctorId,
          maxPatients: editableRow.maxPatients,
          status: editableRow.status
        });
      }
    }

    if (requests.length === 0) return;

    this.doctorScheduleService.updateBatch(requests).subscribe({
      next: () => {
        this.toastr.success(`Cập nhật thành công ${requests.length} lịch làm việc`);
        this.loadSchedules();
      },
      error: () => {
        this.toastr.error('Cập nhật lịch làm việc thất bại');
      }
    });
  }

  // Lấy danh sách schedules theo session
  getSchedulesBySession(session: string): DoctorSchedule[] {
    if (session === 'Tất cả') {
      return this.schedules; // Trả về tất cả schedules nếu chọn "Tất cả"
    }
    return this.schedules.filter(schedule => schedule.timeFrameResponse.session === session);
  }

  // Lấy danh sách các session có trong schedules hiện tại (để hiển thị trong UI)
  getAvailableSessions(): string[] {
    // Luôn hiển thị tất cả các buổi từ sessions gốc, không phụ thuộc vào schedules hiện tại
    return this.sessions;
  }

  // Đếm số lượng lịch khám theo session
  getScheduleCountBySession(session: string): number {
    if (session === 'Tất cả') {
      return this.schedules.length;
    }
    return this.schedules.filter(schedule => schedule.timeFrameResponse.session === session).length;
  }

  // Lấy màu sắc cho từng buổi
  getSessionColor(session: string): string {
    const colors: { [key: string]: string } = {
      'Sáng': 'bg-orange-100 text-orange-800',
      'Chiều': 'bg-blue-100 text-blue-800', 
      'Tối': 'bg-purple-100 text-purple-800',
      'Đêm': 'bg-indigo-100 text-indigo-800'
    };
    return colors[session] || 'bg-gray-100 text-gray-800';
  }

  // Lấy màu sắc cho dòng bảng theo buổi (khi chọn "Tất cả")
  getRowSessionColor(session: string): string {
    // const colors: { [key: string]: string } = {
    //   'Sáng': 'bg-orange-50',
    //   'Chiều': 'bg-blue-50', 
    //   'Tối': 'bg-purple-50',
    //   'Đêm': 'bg-indigo-50'
    // };
    // return colors[session] || 'bg-gray-50';
    return '';
  }

  // Hiển thị modal tạo mới
  onCreateSchedule(): void {
    this.showCreateModal = true;
  }

  // Xử lý khi tạo lịch khám thành công
  onScheduleCreated(): void {
    this.showCreateModal = false;
    this.loadSchedules(); // Refresh lại danh sách
  }

  // Cập nhật query params tương tự như list-doctor-crud
  updateQueryParams() {
    const queryParams: any = {
      day: this.selectedDay
    };

    // Chỉ thêm session nếu có giá trị
    if (this.selectedSession && this.selectedSession.trim() !== '') {
      queryParams.session = this.selectedSession;
    }

    // Chỉ thêm status nếu có giá trị
    if (this.selectedStatus && this.selectedStatus.trim() !== '') {
      queryParams.status = this.selectedStatus;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }
} 