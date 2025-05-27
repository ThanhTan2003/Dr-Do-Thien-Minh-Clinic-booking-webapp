import { Routes } from '@angular/router';
import { RoleGuard } from '../../auth/guards/role.guard';
import { ADMIN_ROLES } from '../../core/constants/role.constant';

export const accountRoutes: Routes = [
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
        loadComponent: () => import('./list-crud/list-account-crud.component').then(m => m.ListAccountCrudComponent),
        canActivate: [RoleGuard],
        data: { roles: ADMIN_ROLES }
      },
      {
        path: ':accountId',
        loadComponent: () => import('./detail/detail-account.component').then(m => m.DetailAccountComponent),
        canActivate: [RoleGuard],
        data: { roles: ADMIN_ROLES }
      }
    ]
  }
]; 