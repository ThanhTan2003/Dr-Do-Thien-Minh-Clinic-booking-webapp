import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentSchedule } from '../../../../../shared/services/appointment/appointment-schedule.service';
import { Appointment } from '../../../../../models/responses/appointment/appointment.model';
import { PageResponse } from '../../../../../models/responses/page-response.model';
import { PageSizeSelectorComponent } from '../../../../shared/components/page-size-selector/page-size-selector.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { DoctorAppointmentUpdateComponent } from '../../appointment/update/doctor-appointment-update.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
    faCircleQuestion,
    faMagnifyingGlass,
    faRotate,
    faPenToSquare,
    faCalendarCheck, 
    faClock, 
    faStethoscope, 
    faCheckCircle, 
    faTimesCircle, 
    faUserMd, 
    faChalkboardTeacher,
    faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe';
import { BirthYearPipe } from '../../../../../shared/pipes/birth-year.pipe';
import { getStatusClassForList } from '../../../../../shared/util/status.util';
import { formatNumber } from '../../../../../shared/util/format.util';

@Component({
    selector: 'app-appointment-holiday',
    templateUrl: './appointment-holiday.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        PageSizeSelectorComponent,
        PaginationComponent,
        DoctorAppointmentUpdateComponent,
        FontAwesomeModule,
        FormatDatePipe,
        BirthYearPipe
    ]
})
export class AppointmenHolidayComponent implements OnInit {
    appointments: Appointment[] = [];
    holidayId: string = '';
    keyword: string = '';
    loading: boolean = false;

    // Pagination
    currentPage: number = 1;
    pageSize: number = 10;
    totalElements: number = 0;
    totalPages: number = 0;
    pageSizeOptions: number[] = [5, 10, 20, 50, 100];

    // Modal
    showUpdateModal: boolean = false;
    selectedAppointmentId: string | null = null;

    // FontAwesome icons
    faCircleQuestion = faCircleQuestion;
    faMagnifyingGlass = faMagnifyingGlass;
    faRotate = faRotate;
    faPenToSquare = faPenToSquare;
    faCalendarCheck = faCalendarCheck;
    faClock = faClock;
    faStethoscope = faStethoscope;
    faCheckCircle = faCheckCircle;
    faTimesCircle = faTimesCircle;
    faUserMd = faUserMd;
    faChalkboardTeacher = faChalkboardTeacher;
    faArrowLeft = faArrowLeft;

    constructor(
        private appointmentScheduleService: AppointmentSchedule,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.route.params.subscribe(params => {
            this.holidayId = params['holidayId'];
            this.loadAppointments();
        });
    }

    loadAppointments(): void {
        this.loading = true;
        this.appointmentScheduleService.searchAppointments(
            this.holidayId,
            this.keyword,
            this.currentPage,
            this.pageSize
        ).subscribe({
            next: (response: PageResponse<Appointment>) => {
                this.appointments = response.data;
                this.totalElements = response.totalElements;
                this.totalPages = response.totalPages;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading appointments:', error);
                this.loading = false;
            }
        });
    }

    handleSearch(): void {
        this.currentPage = 1;
        this.loadAppointments();
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.loadAppointments();
    }

    onPageSizeChange(size: number): void {
        this.pageSize = size;
        this.currentPage = 1;
        this.loadAppointments();
    }

    refreshList(): void {
        this.keyword = '';
        this.currentPage = 1;
        this.loadAppointments();
    }

    

    goBack(): void {
        this.router.navigate(['../'], { relativeTo: this.route });
    }

    getStatusClass(status: string): string {
        return getStatusClassForList(status);
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    }

    formatNumber(value: number | string): string {
        return formatNumber(value);
    }

    openUpdateModal(appointmentId: string) {
        this.selectedAppointmentId = appointmentId;
        this.showUpdateModal = true;
    }

    closeUpdateModal(updated: boolean) {
        this.showUpdateModal = false;
        this.selectedAppointmentId = null;
        if (updated === true) {
            this.loadAppointments();
        }
    }
} 