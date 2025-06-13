import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faXmark, faCircleInfo, faRotate } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-history-appointment',
  templateUrl: './history-appointment.component.html',
  standalone: true,
  imports: [FontAwesomeModule]
})
export class HistoryAppointmentComponent {
    faMagnifyingGlass = faMagnifyingGlass;
    faXmark = faXmark;
    faCircleInfo = faCircleInfo;
    faRotate = faRotate;
} 