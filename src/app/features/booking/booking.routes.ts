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
        loadChildren: () => import('./patient-profile/patient-profile.routes').then(m => m.patientProfileRoutes)
      },
      {
        path: '',
        redirectTo: 'by-doctor',
        pathMatch: 'full'
      }
    ]
  }
];