import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class PatientComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}
}
