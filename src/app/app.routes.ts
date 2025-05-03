import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'booking',
    loadChildren: () => import('./features/booking/booking.routes').then(m => m.bookingRoutes)
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent)
  },
  {
    path: '',
    redirectTo: 'booking',
    pathMatch: 'full'
  }
];