import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-by-doctor',
  templateUrl: './by-doctor.component.html',
  standalone: true,
  imports: [CommonModule, RouterOutlet]
})
export class ByDoctorComponent {
} 