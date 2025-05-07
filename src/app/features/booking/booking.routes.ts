import { Routes } from '@angular/router';

export const bookingRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./booking.component').then(m => m.BookingComponent),
    children: [
      {
        path: 'by-doctor',
        loadChildren: () => import('./by-doctor/by-doctor.routes').then(m => m.byDoctorRoutes)
      },
      {
        path: 'by-service',
        loadChildren: () => import('./by-service/by-service.routes').then(m => m.byServiceRoutes)
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