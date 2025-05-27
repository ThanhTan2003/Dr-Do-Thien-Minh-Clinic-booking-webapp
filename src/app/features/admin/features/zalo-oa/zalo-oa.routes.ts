import { Routes } from '@angular/router';
import { RoleGuard } from '../../auth/guards/role.guard';
import { ADMIN_MARKETING_ROLES } from '../../core/constants/role.constant';

export const zaloOARoutes: Routes = [
  {
    path: '',
    redirectTo: 'nguoi-dung',
    pathMatch: 'full'
  },
  {
    path: 'nguoi-dung',
    loadComponent: () => import('./user/list/list-user.component').then(m => m.ListUserComponent),
    canActivate: [RoleGuard],
    data: { roles: ADMIN_MARKETING_ROLES }
  },
  {
    path: 'nhom-nguoi-dung',
    loadComponent: () => import('./group/list/list-group.component').then(m => m.ListGroupComponent),
    canActivate: [RoleGuard],
    data: { roles: ADMIN_MARKETING_ROLES }
  },
  {
    path: 'thong-bao',
    loadComponent: () => import('./notification/notification.component').then(m => m.ListNotificationComponent),
    canActivate: [RoleGuard],
    data: { roles: ADMIN_MARKETING_ROLES }
  }
]; 