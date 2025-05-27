import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'booking',
    loadChildren: () => import('./features/booking/booking.routes').then(m => m.bookingRoutes)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)
  },
  {
    path: '',
    redirectTo: 'booking',
    pathMatch: 'full'
  }
];