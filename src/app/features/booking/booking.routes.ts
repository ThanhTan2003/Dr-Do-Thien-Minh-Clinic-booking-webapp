import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { RoleGuard } from './auth/guards/role.guard';
import { USER_ROLES } from './core/constants/role.constant';

export const bookingRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./booking.component').then(m => m.BookingComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: USER_ROLES },
    children: [
      {
        path: '',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
        canActivate: [RoleGuard],
        data: { roles: USER_ROLES }
      },
      {
        path: 'by-doctor',
        loadChildren: () => import('./by-doctor/by-doctor.routes').then(m => m.byDoctorRoutes),
        canActivate: [RoleGuard],
        data: { roles: USER_ROLES }
      },
      {
        path: 'by-service',
        loadChildren: () => import('./by-service-v2/by-service.routes').then(m => m.byServiceV2Routes),
        canActivate: [RoleGuard],
        data: { roles: USER_ROLES }
      },
      {
        path: 'patient-profile',
        loadChildren: () => import('./patient-profile/patient-profile.routes').then(m => m.patientProfileRoutes),
        canActivate: [RoleGuard],
        data: { roles: USER_ROLES }
      }
    ]
  }
];