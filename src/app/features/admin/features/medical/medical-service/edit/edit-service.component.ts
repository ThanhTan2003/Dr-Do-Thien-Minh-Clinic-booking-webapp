import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { EditServiceInfoComponent } from './edit-service-info/edit-service-info.component';
import { ServiceListDoctorComponent } from './list-doctor/service-list-doctor.component';
import { ServiceAppointmentHistoryComponent } from '../appointment-history/service-appointment-history.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    EditServiceInfoComponent,
    ServiceListDoctorComponent,
    ServiceAppointmentHistoryComponent,
    FontAwesomeModule
  ]
})
export class EditServiceComponent { 
  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  faArrowLeft = faArrowLeft;

  ngAfterViewInit(): void {
    console.log("list-doctor-crud.component ngAfterViewInit....................");
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn mượt về đầu trang
  }

  goBack(): void {
    this.router.navigate(['/admin/y-te/dich-vu']);
  }
} 