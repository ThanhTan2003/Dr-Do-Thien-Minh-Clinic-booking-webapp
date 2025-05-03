import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class ScheduleComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}
}
