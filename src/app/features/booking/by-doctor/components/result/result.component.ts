import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class ResultComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}
}
