import { Routes } from '@angular/router';
import { RoleGuard } from '../../auth/guards/role.guard';
import { ADMIN_ROLES } from '../../core/constants/role.constant';

export const appointmentRoutes: Routes = [
  {
    path: '',
    redirectTo: 'danh-sach',
    pathMatch: 'full'
  },
  {
    path: 'danh-sach',
    children: [
      {
        path: '',
        loadComponent: () => import('./list-crud/appointment-list-crud.component').then(m => m.AppointmentListCrudComponent),
        canActivate: [RoleGuard],
        data: { roles: ADMIN_ROLES }
      },
    ]
  }
]; 