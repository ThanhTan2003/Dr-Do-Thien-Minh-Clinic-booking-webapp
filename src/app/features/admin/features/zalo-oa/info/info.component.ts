import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faComments, faSave } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-zalo-oa-info',
  templateUrl: './info.component.html',
  standalone: true,
  imports: [FontAwesomeModule]
})
export class ZaloOAInfoComponent {
  faComments = faComments;
  faSave = faSave;

} 