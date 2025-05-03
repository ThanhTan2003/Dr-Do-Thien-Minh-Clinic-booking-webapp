import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService as DoctorDataService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor.model';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface MedicalService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

@Component({
  selector: 'app-doctor-service',
  templateUrl: './doctor-service.component.html',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule]
})
export class DoctorServiceComponent implements OnInit {
  doctor: Doctor | null = null;
  services: MedicalService[] = [];
  loading = false;
  error: string | null = null;
  selectedService: MedicalService | null = null;

  constructor(
    private doctorService: DoctorDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const doctorId = this.route.snapshot.paramMap.get('doctorId');
    if (doctorId) {
      this.loadDoctorAndServices(doctorId);
    }
  }

  loadDoctorAndServices(doctorId: string): void {
    this.loading = true;
    this.doctorService.getDoctorById(doctorId).subscribe({
      next: (doctor: Doctor) => {
        this.doctor = doctor;
        // TODO: Load services from API
        this.services = [
          {
            id: '1',
            name: 'Khám tổng quát',
            description: 'Khám sức khỏe tổng quát, kiểm tra các chỉ số cơ bản',
            price: 500000,
            duration: 30
          },
          {
            id: '2',
            name: 'Tư vấn chuyên sâu',
            description: 'Tư vấn và điều trị chuyên sâu về các vấn đề sức khỏe',
            price: 1000000,
            duration: 60
          },
          {
            id: '3',
            name: 'Khám định kỳ',
            description: 'Khám sức khỏe định kỳ hàng năm',
            price: 800000,
            duration: 45
          }
        ];
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = 'Không thể tải thông tin bác sĩ. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  selectService(service: MedicalService): void {
    this.selectedService = service;
  }

  confirmService(): void {
    if (this.selectedService) {
      this.router.navigate([this.selectedService.id], { relativeTo: this.route });
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  formatDuration(duration: number): string {
    return `${duration} phút`;
  }
}
