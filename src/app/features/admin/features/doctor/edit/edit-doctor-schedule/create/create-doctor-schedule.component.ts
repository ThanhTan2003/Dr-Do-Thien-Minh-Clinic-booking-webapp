import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorScheduleService } from '../../../../../../shared/services/doctor/doctor-schedule.service';
import { DoctorScheduleStatus } from '../../../../../../models/responses/doctor/doctor-schedule-status.model';
import { DoctorScheduleRequest } from '../../../../../../models/requests/doctor/doctor-schedule.request';
import { AdminModalConfirmComponent } from '../../../../../shared/components/modal-confirm/admin-modal-confirm.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faXmark, faTrash, faCalendarPlus } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

interface ScheduleItem {
  id: string;
  startTime: string;
  maxPatients: number;
  status: boolean;
}

@Component({
  selector: 'app-create-doctor-schedule',
  templateUrl: './create-doctor-schedule.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminModalConfirmComponent,
    FontAwesomeModule
  ]
})
export class CreateDoctorScheduleComponent implements OnInit {
  @Input() statuses: DoctorScheduleStatus[] = [];
  @Input() doctorId: string = '';
  @Input() dayOfWeek: string = '';
  @Output() scheduleCreated = new EventEmitter<void>();

  // FontAwesome icons
  faPlus = faPlus;
  faXmark = faXmark;
  faTrash = faTrash;
  faCalendarPlus = faCalendarPlus;

  // Dữ liệu
  selectedStartTime: string = '';
  scheduleItems: ScheduleItem[] = [];

  // Modal xác nhận
  showConfirmModal: boolean = false;
  confirmTitle: string = '';
  confirmContent: string = '';
  
  constructor(
    private doctorScheduleService: DoctorScheduleService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Không cần load API
  }

  addSchedule(): void {
    if (!this.selectedStartTime) {
      this.toastr.warning('Vui lòng nhập giờ khám');
      return;
    }

    // Validate và format định dạng giờ (HH:MM)
    const timePattern = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timePattern.test(this.selectedStartTime)) {
      this.toastr.error('Định dạng giờ không hợp lệ. Vui lòng nhập theo định dạng HH:MM (ví dụ: 08:30)');
      return;
    }

    // Format thời gian về định dạng HH:MM (đảm bảo 2 chữ số cho giờ)
    const timeParts = this.selectedStartTime.split(':');
    const formattedTime = timeParts[0].padStart(2, '0') + ':' + timeParts[1].padStart(2, '0');
    this.selectedStartTime = formattedTime;

    // Kiểm tra xem đã thêm giờ khám này chưa (sử dụng formattedTime)
    const exists = this.scheduleItems.some(item => item.startTime === formattedTime);
    if (exists) {
      this.toastr.warning('Giờ khám này đã được thêm');
      return;
    }

    const newItem: ScheduleItem = {
      id: this.generateId(),
      startTime: formattedTime, // Sử dụng thời gian đã format
      maxPatients: 1, // Giá trị mặc định
      status: true // Mặc định là hoạt động
    };
    
    this.scheduleItems.push(newItem);
    this.selectedStartTime = ''; // Reset selection
  }

  removeScheduleItem(itemId: string): void {
    this.scheduleItems = this.scheduleItems.filter(item => item.id !== itemId);
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  getStatusDescription(status: boolean): string {
    const statusObj = this.statuses.find(s => s.status === status);
    return statusObj ? statusObj.description : '';
  }

  onSubmit(): void {
    if (this.scheduleItems.length === 0) {
      this.toastr.warning('Vui lòng thêm ít nhất một khung giờ');
      return;
    }

    // Validate số lượng tối đa
    for (const item of this.scheduleItems) {
      if (item.maxPatients < 0) {
        this.toastr.error('Số lượng tối đa phải >= 0');
        return;
      }
    }

    // Hiển thị modal xác nhận
    this.confirmTitle = 'Xác nhận thêm lịch khám';
    this.confirmContent = `Bạn có chắc chắn muốn thêm ${this.scheduleItems.length} lịch khám mới không?`;
    this.showConfirmModal = true;
  }

  onConfirmSubmit(): void {
    const requests: DoctorScheduleRequest[] = this.scheduleItems.map(item => ({
      doctorId: this.doctorId,
      startTime: item.startTime,
      dayOfWeek: this.dayOfWeek,
      maxPatients: item.maxPatients,
      status: item.status
    }));

    this.doctorScheduleService.createOrUpdateBatch(requests).subscribe({
      next: () => {
        this.toastr.success(`Thêm thành công ${requests.length} lịch khám`);
        this.showConfirmModal = false;
        this.scheduleCreated.emit();
      },
      error: (error) => {
        this.showConfirmModal = false;
        console.error('Error creating schedules:', error);
        if (error.status === 500 && error.error?.message) {
          this.toastr.error(error.error.message, 'Lỗi');
        } else {
          this.toastr.error('Không thể thêm lịch khám', 'Lỗi');
        }
      }
    });
  }

  onCancelSubmit(): void {
    this.showConfirmModal = false;
  }

  onCancel(): void {
    this.scheduleCreated.emit();
  }

  // Lấy màu sắc dựa trên giờ khám (để phân biệt buổi)
  getTimeColor(startTime: string): string {
    const hour = parseInt(startTime.split(':')[0]);
    
    if (hour >= 6 && hour < 12) {
      return 'bg-orange-100 text-orange-800'; // Sáng
    } else if (hour >= 12 && hour < 18) {
      return 'bg-blue-100 text-blue-800'; // Chiều
    } else if (hour >= 18 && hour < 22) {
      return 'bg-purple-100 text-purple-800'; // Tối
    } else {
      return 'bg-indigo-100 text-indigo-800'; // Đêm/Khuya
    }
  }

  // Lấy tên buổi dựa trên giờ khám
  getSessionName(startTime: string): string {
    const hour = parseInt(startTime.split(':')[0]);
    
    if (hour >= 6 && hour < 12) {
      return 'Sáng';
    } else if (hour >= 12 && hour < 18) {
      return 'Chiều';
    } else if (hour >= 18 && hour < 22) {
      return 'Tối';
    } else {
      return 'Đêm';
    }
  }
}
