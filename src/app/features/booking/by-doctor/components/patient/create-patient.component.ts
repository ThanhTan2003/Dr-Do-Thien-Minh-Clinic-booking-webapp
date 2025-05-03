import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class CreatePatientComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}
}
