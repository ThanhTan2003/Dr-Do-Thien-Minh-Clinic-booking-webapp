import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faXmark, faCircleInfo, faRotate } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  standalone: true,
  imports: [FontAwesomeModule]
})
export class PatientListComponent {
    faMagnifyingGlass = faMagnifyingGlass;
    faXmark = faXmark;
    faCircleInfo = faCircleInfo;
    faRotate = faRotate;
} 