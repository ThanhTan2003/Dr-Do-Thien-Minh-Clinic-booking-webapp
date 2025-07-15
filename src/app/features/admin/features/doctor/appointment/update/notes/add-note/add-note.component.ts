import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientNoteService } from '../../../../../../../shared/services/patient/patient-note.service';
import { PatientNoteRequest } from '../../../../../../../models/requests/patient/patient-note.request';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule
  ],
})
export class AddNoteComponent implements OnInit {
  @Input() patientId: string = '';
  @Output() noteAdded = new EventEmitter<void>();

  formData: PatientNoteRequest = {
    patientId: '',
    content: ''
  };

  faPlus = faPlus;
  faXmark = faXmark;

  constructor(
    private patientNoteService: PatientNoteService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.formData.patientId = this.patientId;
  }

  handleSubmit(): void {
    if (!this.formData.content || this.formData.content.trim() === '') {
      this.toastr.error('Vui lòng nhập nội dung ghi chú!', 'Thông báo');
      return;
    }

    this.patientNoteService.createNote(this.formData).subscribe({
      next: () => {
        this.toastr.success('Thêm ghi chú thành công!');
        this.noteAdded.emit();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Đã xảy ra lỗi. Vui lòng thử lại!');
      },
    });
  }

  goBack(): void {
    this.noteAdded.emit();
  }
}
