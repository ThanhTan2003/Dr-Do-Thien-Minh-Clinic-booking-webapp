import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretDown, faMagnifyingGlass, faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import { AppointmentService } from '../../../../shared/services/appointment/appointment.service';
import { Appointment } from '../../../../models/responses/appointment/appointment.model';
import { PageResponse } from '../../../../models/responses/page-response.model';
import { ModalErrorComponent } from '../../../../shared/components/modal-error.component';

@Component({
  selector: 'app-patient-appointment',
  templateUrl: './patient-appointment.component.html',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, FontAwesomeModule, RouterModule, ModalErrorComponent]
})
export class PatientAppointmentComponent implements OnInit {
  appointments: Appointment[] = [];
  statuses: string[] = [];
  selectStatus: string = '';
  totalPages: number = 1;
  currentPage: number = 1;
  pageSize: number = 5;
  keyword: string = '';
  isSearch: boolean = false;
  timeoutRef: any;
  patientId: string = '';
  appointmentId: string = '';
  showErrorModal: boolean = false;
  errorTitle: string = '';
  errorMessage: string = '';

  // Icons
  faCaretDown = faCaretDown;
  faMagnifyingGlass = faMagnifyingGlass;
  faArrowLeft = faArrowLeft;
  faPlus = faPlus;

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.patientId = this.route.snapshot.params['patientId'];
    this.fetchAppointments();
    this.fetchStatuses();
    window.scrollTo(0, 0);
  }

  fetchAppointments() {
    this.appointmentService
      .getByPatientId(
        this.patientId,
        this.selectStatus,
        this.keyword,
        this.currentPage,
        this.pageSize
      )
      .subscribe({
        next: (data: PageResponse<Appointment>) => {
          this.totalPages = data.totalPages || 1;
          if (this.currentPage === 1) {
            this.appointments = data.data || [];
          } else {
            this.appointments = [...this.appointments, ...(data.data || [])];
          }
        },
        error: (error: any) => console.error('Error fetching data:', error)
      });
  }

  fetchStatuses() {
    this.appointmentService.getAppointmentStatuses().subscribe({
      next: (data: string[]) => {
        this.statuses = data;
      },
      error: (error: any) => console.error('Error fetching statuses:', error)
    });
  }

  handleSearchChange(event: any) {
    const value = event.target.value;
    this.keyword = value;
    clearTimeout(this.timeoutRef);
    this.timeoutRef = setTimeout(() => {
      this.isSearch = !this.isSearch;
      this.currentPage = 1;
      this.fetchAppointments();
    }, 500);
  }

  getStatusColorClass(status: string): string {
    switch (status) {
      case 'Chờ xác nhận':
        return 'text-yellow-600';
      case 'Đã xác nhận':
        return 'text-green-600';
      case 'Đã huỷ':
        return 'text-red-600';
      case 'Chờ khám':
        return 'text-gray-600';
      case 'Đã khám':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  }

  onStatusChange(event: any) {
    this.selectStatus = event.target.value;
    this.currentPage = 1;
    this.fetchAppointments();
  }

  loadMore() {
    this.currentPage++;
    this.fetchAppointments();
  }

  goBack() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  onCancelAppointment(appointment: Appointment) {
    this.errorTitle = 'Không hủy lịch';
    this.errorMessage = 'Phòng khám hiện chưa cho phép thực hiện hủy lịch hẹn trên ứng dụng. Bạn vui lòng liên hệ phòng khám qua Zalo OA để được hỗ trợ. Trân trọng!';
    this.showErrorModal = true;
  }

  onCloseErrorModal() {
    this.showErrorModal = false;
  }
} 