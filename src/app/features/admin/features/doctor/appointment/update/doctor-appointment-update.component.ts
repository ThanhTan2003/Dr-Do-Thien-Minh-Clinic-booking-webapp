import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faInfoCircle, faIdCard, faCalendarCheck, faPenToSquare, faPlus, faRotate, faMagnifyingGlass, faTags, faStickyNote, faHistory } from '@fortawesome/free-solid-svg-icons';
import { Appointment } from '../../../../../models/responses/appointment/appointment.model';
import { AppointmentService } from '../../../../../shared/services/appointment/appointment.service';
import { ExamResultRequest } from '../../../../../models/requests/appointment/exam-result.request';
import { AdminModalConfirmComponent } from '../../../../shared/components/modal-confirm/admin-modal-confirm.component';
import { AdminModalConfirmDeleteComponent } from '../../../../shared/components/modal-confirm-delete/admin-modal-confirm-delete.component';
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe';
import { FormatDateTimePipe } from '../../../../../shared/pipes/format-datetime.pipe';
import { FormatPhonePipe } from '../../../../../shared/pipes/format-phone.pipe';
import { ToastrService } from 'ngx-toastr';

// Import các component con
import { UpdateTagsComponent } from './tags/update-tags.component';
import { UpdateNotesComponent } from './notes/update-notes.component';
import { UpdateHistoryComponent } from './history/update-history.component';
import { AddTagForPatientComponent } from './tags/add-tag/add-tag-for-patient.component';
import { AddNoteComponent } from './notes/add-note/add-note.component';

// Import services
import { PatientTagService } from '../../../../../shared/services/patient/patient-tag.service';
import { PatientNoteService } from '../../../../../shared/services/patient/patient-note.service';
import { PatientNoteResponse } from '../../../../../models/responses/patient/patient-note.response';

// Import utility functions
import { getStatusClassForForm, getUpdatableStatuses } from '../../../../../shared/util/status.util';

@Component({
  selector: 'app-doctor-appointment-update',
  templateUrl: './doctor-appointment-update.component.html',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    FontAwesomeModule, 
    AdminModalConfirmComponent, 
    AdminModalConfirmDeleteComponent,
    FormatDatePipe, 
    FormatDateTimePipe, 
    FormatPhonePipe,
    UpdateTagsComponent,
    UpdateNotesComponent,
    UpdateHistoryComponent,
    AddTagForPatientComponent,
    AddNoteComponent
  ]
})
export class DoctorAppointmentUpdateComponent implements OnInit {
  @Input() appointmentId: string = '';
  @Input() isDoctor: boolean = false;
  @Input() isDetail: boolean = false;
  @Output() close = new EventEmitter<boolean>(); // true nếu cập nhật thành công

  // ViewChild để truy cập component con
  @ViewChild(UpdateTagsComponent) updateTagsComponent!: UpdateTagsComponent;
  @ViewChild(UpdateNotesComponent) updateNotesComponent!: UpdateNotesComponent;

  faXmark = faXmark;
  faInfoCircle = faInfoCircle;
  faIdCard = faIdCard;
  faCalendarCheck = faCalendarCheck;
  faPenToSquare = faPenToSquare;
  faPlus = faPlus;
  faMagnifyingGlass = faMagnifyingGlass;
  faRotate = faRotate;
  faTags = faTags;
  faStickyNote = faStickyNote;
  faHistory = faHistory;

  appointment: Appointment | null = null;

  loading: boolean = false;
  showConfirm: boolean = false;
  confirmLoading: boolean = false;
  error: string = '';

  // Tab system
  activeTab: string = 'tags';
  tabs = [
    {
      id: 'tags',
      label: 'NHÓM ĐỐI TƯỢNG',
      icon: this.faTags,
    },
    {
      id: 'notes',
      label: 'GHI CHÚ',
      icon: this.faStickyNote,
    },
    {
      id: 'history',
      label: 'LỊCH SỬ KHÁM',
      icon: this.faHistory,
    }
  ];

  // Form fields
  result: ExamResultRequest = {
    price:'',
    status: '',
    doctorMessage: '',
    result: '',
    note: '',
    reExaminationDate: ''
  };

  // Sử dụng utility function để lấy danh sách trạng thái có thể cập nhật
  statuses: string[] = [];

  // Modal states
  showAddTagModal: boolean = false;
  showAddNoteModal: boolean = false;
  showConfirmDeleteTag: boolean = false;
  showConfirmDeleteNote: boolean = false;
  tagToDelete: string | null = null;
  noteToDelete: PatientNoteResponse | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private patientTagService: PatientTagService,
    private patientNoteService: PatientNoteService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.appointmentId) {
      this.loadStatuses()
      this.loadAppointment();
    }
  }

  loadStatuses(): void {
    this.loading = true;
    if(this.isDoctor)
    {
      this.appointmentService.getExamStatusList().subscribe({
        next: (response: string[]) => {
          this.statuses = response;
        
          this.loading = false;
        },
        error: (error) => {
          const msg = error.error?.message || 'Không thể tải thông tin lịch hẹn.';
          this.toastr.error(msg, 'Lỗi');
          this.loading = false;
        }
      });
    }
    else
    {
      this.appointmentService.getAppointmentStatuses().subscribe({
        next: (response: string[]) => {
          this.statuses = response;
        
          this.loading = false;
        },
        error: (error) => {
          const msg = error.error?.message || 'Không thể tải thông tin lịch hẹn.';
          this.toastr.error(msg, 'Lỗi');
          this.loading = false;
        }
      });
    }
  }

  loadAppointment(): void {
    this.loading = true;
    this.appointmentService.getById(this.appointmentId).subscribe({
      next: (response: Appointment) => {
        this.appointment = response;
        // Gán giá trị mặc định cho form nếu có

        this.result.status = response.status ? `${response.status}` : '';
        this.result.price = response.price ? `${response.price}`: '';
        this.result.result = response.result ? `${response.result}`: '';
        this.result.doctorMessage = response.doctorMessage ? `${response.doctorMessage}` : '';
        this.result.note = response.note ? `${response.note}` : '';
        this.result.reExaminationDate = response.reExaminationDate ? `${response.reExaminationDate}` : '';
        console.log(this.result);
        this.loading = false;
      },
      error: (error) => {
        const msg = error.error?.message || 'Không thể tải thông tin lịch hẹn.';
        this.toastr.error(msg, 'Lỗi');
        this.loading = false;
      }
    });
  }

  closeModal(): void {
    this.close.emit(false);
  }

  openConfirm(): void {
    this.showConfirm = true;
  }

  onConfirmUpdate(confirmed: boolean): void {
    this.showConfirm = false;
    if (confirmed) {
      this.updateExamResult();
    }
  }

  updateExamResult(): void {
    if (!this.appointmentId) return;
    this.confirmLoading = true;
    this.appointmentService.updateExamResult(this.appointmentId, this.result).subscribe({
      next: () => {
        this.confirmLoading = false;
        this.close.emit(true); // Đóng modal và báo thành công
      },
      error: (error) => {
        const msg = error.error?.message || 'Cập nhật kết quả khám thất bại!';
        this.toastr.error(msg, 'Lỗi');
        this.confirmLoading = false;
      }
    });
  }

  // Tab methods
  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  isActiveTab(tabId: string): boolean {
    return this.activeTab === tabId;
  }

  // Sử dụng utility function thay vì local mapping
  getStatusClass(status: string): string {
    return getStatusClassForForm(status);
  }

  // Tag modal handlers
  onOpenAddTagModal(): void {
    this.showAddTagModal = true;
  }

  onTagAdded(): void {
    this.showAddTagModal = false;
    if (this.updateTagsComponent) {
      this.updateTagsComponent.refreshData();
    }
  }

  onOpenDeleteTagModal(tag: string): void {
    this.tagToDelete = tag;
    this.showConfirmDeleteTag = true;
  }

  closeConfirmDeleteTag(): void {
    this.showConfirmDeleteTag = false;
    this.tagToDelete = null;
  }

  deleteTag(): void {
    if (!this.tagToDelete || !this.appointment?.patientId) {
      console.warn('Không có tag nào được chọn để xoá.');
      return;
    }
  
    console.log('Bắt đầu xoá tag với tên:', this.tagToDelete);
  
    this.patientTagService.removeTag(this.appointment.patientId, this.tagToDelete).subscribe({
      next: (res) => {
        console.log('Xóa thành công. Response:', res);
        this.toastr.success('Xóa nhóm đối tượng thành công!');
        this.showConfirmDeleteTag = false;
        this.tagToDelete = null;
        if (this.updateTagsComponent) {
          this.updateTagsComponent.refreshData();
        }
      },
      error: (error) => {
        this.showConfirmDeleteTag = false;
        console.error('Lỗi khi xoá tag:', error);
  
        if (error.status === 500 && error.error?.message) {
          this.toastr.error(error.error.message, 'Lỗi');
          console.log('Lỗi 500 với message:', error.error.message);
        } else {
          this.toastr.error('Không thể xóa nhóm đối tượng', 'Lỗi');
          console.log('Lỗi khác:', error.status);
        }
      }
    });
  }

  // Note modal handlers
  onOpenAddNoteModal(): void {
    this.showAddNoteModal = true;
  }

  onNoteAdded(): void {
    this.showAddNoteModal = false;
    if (this.updateNotesComponent) {
      this.updateNotesComponent.refreshData();
    }
  }

  onOpenDeleteNoteModal(note: PatientNoteResponse): void {
    this.noteToDelete = note;
    this.showConfirmDeleteNote = true;
  }

  closeConfirmDeleteNote(): void {
    this.showConfirmDeleteNote = false;
    this.noteToDelete = null;
  }

  deleteNote(): void {
    if (!this.noteToDelete) {
      console.warn('Không có ghi chú nào được chọn để xoá.');
      return;
    }
  
    console.log('Bắt đầu xoá ghi chú với ID:', this.noteToDelete.id);
  
    this.patientNoteService.deleteNote(this.noteToDelete.id).subscribe({
      next: (res) => {
        console.log('Xóa thành công. Response:', res);
        this.toastr.success('Xóa ghi chú thành công!');
        this.showConfirmDeleteNote = false;
        this.noteToDelete = null;
        if (this.updateNotesComponent) {
          this.updateNotesComponent.refreshData();
        }
      },
      error: (error) => {
        this.showConfirmDeleteNote = false;
        console.error('Lỗi khi xoá ghi chú:', error);
  
        if (error.status === 500 && error.error?.message) {
          this.toastr.error(error.error.message, 'Lỗi');
          console.log('Lỗi 500 với message:', error.error.message);
        } else {
          this.toastr.error('Không thể xóa ghi chú', 'Lỗi');
          console.log('Lỗi khác:', error.status);
        }
      }
    });
  }
}
