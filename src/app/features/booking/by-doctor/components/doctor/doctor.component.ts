import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor.model';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class DoctorComponent{
  
}
