import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faXmark, faCircleInfo, faRotate } from '@fortawesome/free-solid-svg-icons';
import { PatientService } from '../../../../../../../shared/services/appointment/patient.service';
import { Patient } from '../../../../../../../models/responses/appointment/patient.model';
import { PageResponse } from '../../../../../../../models/responses/page-response.model';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '../../../../../../shared/components/pagination/pagination.component';
import { PageSizeSelectorComponent } from '../../../../../../shared/components/page-size-selector/page-size-selector.component';
import { PatientDetailComponent } from '../detail/patient-detail.component';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    PaginationComponent,
    PageSizeSelectorComponent,
    PatientDetailComponent
  ]
})
export class PatientListComponent implements OnInit {
    userId: string = '';
    patients: Patient[] = [];
    keyword: string = '';
    currentPage: number = 1;
    pageSize: number = 10;
    pageSizeOptions: number[] = [5, 10, 20, 50, 100];
    totalPages: number = 1;
    totalElements: number = 0;
    loading: boolean = false;

    showDetailModal: boolean = false;
    selectedPatient: Patient | null = null;

    faMagnifyingGlass = faMagnifyingGlass;
    faXmark = faXmark;
    faCircleInfo = faCircleInfo;
    faRotate = faRotate;

    constructor(
        private route: ActivatedRoute,
        private patientService: PatientService,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.userId = this.route.snapshot.paramMap.get('userId') || '';
        this.loadPatients();
    }

    loadPatients(page: number = 1): void {
        this.loading = true;
        this.patientService.searchByZaloUid(
            this.userId,
            this.keyword,
            page,
            this.pageSize
        ).subscribe({
            next: (res: PageResponse<Patient>) => {
                this.patients = res.data;
                this.totalPages = res.totalPages;
                this.totalElements = res.totalElements;
                this.currentPage = page;
                this.loading = false;
            },
            error: (error) => {
                console.error('Lỗi khi tải danh sách bệnh nhân:', error);
                this.loading = false;
                this.toastr.error('Không thể tải danh sách bệnh nhân');
            }
        });
    }

    handleSearch(): void {
        this.currentPage = 1;
        this.loadPatients();
    }

    refreshList(): void {
        this.keyword = '';
        this.currentPage = 1;
        this.loadPatients();
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.loadPatients(page);
    }

    onPageSizeChange(newSize: number): void {
        this.pageSize = newSize;
        this.currentPage = 1;
        this.loadPatients();
    }

    showPatientDetail(patient: Patient): void {
        this.selectedPatient = patient;
        this.showDetailModal = true;
    }

    closeDetailModal(): void {
        this.showDetailModal = false;
        this.selectedPatient = null;
    }
} 