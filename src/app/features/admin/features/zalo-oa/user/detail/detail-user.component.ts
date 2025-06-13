import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { PatientListComponent } from './patient/list/patient-list.component';
import { TagInformationComponent } from './tag-information/tag-information.component';
import { ZaloInformationComponent } from './zalo-information/zalo-information.component';
import { HistoryAppointmentComponent } from './history-appointment/history-appointment.component';
import { NoteComponent } from './note/note.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    PatientListComponent, 
    TagInformationComponent, 
    ZaloInformationComponent, 
    HistoryAppointmentComponent,
     NoteComponent, 
     FontAwesomeModule]
})
export class DetailUserComponent {
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
    this.router.navigate(['/admin/zalo-oa/nguoi-dung']);
  }
} 