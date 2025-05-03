import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class ConfirmComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}
}
