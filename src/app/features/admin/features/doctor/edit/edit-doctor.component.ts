import { Component, OnInit } from '@angular/core';
import { EditDoctorInfoComponent } from './edit-doctor-info/edit-doctor-info.component';
import { EditDoctorServiceComponent } from './edit-doctor-service/edit-doctor-service.component';
import { EditDoctorScheduleComponent } from './edit-doctor-schedule/edit-doctor-schedule.component';
import { Location } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faCaretDown, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ScrollPositionService } from '../scroll-position.service';

@Component({
  selector: 'app-edit-doctor',
  standalone: true, // Đánh dấu component là standalone
  imports: [
    // Import các component con để sử dụng trong template
    EditDoctorInfoComponent,
    EditDoctorServiceComponent,
    EditDoctorScheduleComponent,
    FontAwesomeModule
  ],
  templateUrl: './edit-doctor.component.html'
})
export class EditDoctorComponent implements OnInit {
  faArrowLeft = faArrowLeft;
  private parentScrollKey = 'list-doctor-crud';

  constructor(
    private location: Location,
    private scrollService: ScrollPositionService
  ) {}

  ngOnInit(): void {
    // Khi vào chi tiết, scroll về đầu trang
    console.log("edit-doctor.component ngOnInit....................");
    setTimeout(() => {
      console.log("edit-doctor.component ngOnInit setTimeout....................");
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 0);
  }

  goBack(): void {
    this.location.back();
    // Đợi router-outlet render lại, rồi scroll về vị trí cũ
    setTimeout(() => {
      console.log("edit-doctor.component goBack setTimeout....................");
      console.log(this.scrollService.getPosition(this.parentScrollKey));
      window.scrollTo({ top: this.scrollService.getPosition(this.parentScrollKey), behavior: 'auto' });
    }, 100);
  }
  ngDestroy(): void {
    console.log("edit-doctor.component ngDestroy....................");
  }
}