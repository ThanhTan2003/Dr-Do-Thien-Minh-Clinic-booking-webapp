import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'booking',
    loadComponent: () => import('./features/booking/booking.component').then(m => m.BookingComponent),
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent),
  },
  {
    path: '',
    redirectTo: 'booking',
    pathMatch: 'full'
  }
];
