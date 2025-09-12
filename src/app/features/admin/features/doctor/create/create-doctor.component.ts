import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorService } from '../../../../shared/services/doctor/doctor.service';
import { DoctorRequest } from '../../../../models/requests/doctor/doctor.request';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleInfo, faUserPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-doctor',
  templateUrl: './create-doctor.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule
  ],
})
export class CreateDoctorComponent implements OnInit {
  @Output() doctorCreated = new EventEmitter<void>();

  formData: DoctorRequest = {
    name: '',
    zaloUid: '',
    phone: '',
    gender: 'Nam',
    description: '',
    status: true,
    image: ''
  };

  faCircleInfo = faCircleInfo;
  faUserPlus = faUserPlus;
  faXmark = faXmark;

  constructor(
    private doctorService: DoctorService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  

  handleSubmit(): void {
    const requiredFields: (keyof DoctorRequest)[] = [
      'name',
      'phone',
      'gender',
      'description'
    ];

    for (const field of requiredFields) {
      if (!this.formData[field]) {
        this.toastr.error('Vui lòng nhập đầy đủ thông tin!', 'Thông báo');
        return;
      }
    }

    this.doctorService.create(this.formData).subscribe({
      next: () => {
        this.toastr.success('Thêm bác sĩ thành công!');
        this.doctorCreated.emit();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Đã xảy ra lỗi. Vui lòng thử lại!');
      },
    });
  }

  goBack(): void {
    this.doctorCreated.emit();
  }
} 