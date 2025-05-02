import { Routes } from '@angular/router';

export const bookingRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./booking.component').then(m => m.BookingComponent),
    children: [
      {
        path: 'by-doctor',
        loadComponent: () => import('./by-doctor/by-doctor.component').then(m => m.ByDoctorComponent)
      },
      {
        path: 'by-service',
        loadComponent: () => import('./by-service/by-service.component').then(m => m.ByServiceComponent)
      },
      {
        path: 'patient-profile',
        loadComponent: () => import('./patient-profile/patient-profile.component').then(m => m.PatientProfileComponent)
      },
      {
        path: '',
        redirectTo: 'by-doctor',
        pathMatch: 'full'
      }
    ]
  }
];
