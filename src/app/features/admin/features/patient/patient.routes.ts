import { Routes } from '@angular/router';
import { RoleGuard } from '../../auth/guards/role.guard';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { Role } from '../../core/enums/role.enum';
import { ADMIN_ROLES, STAFF_ROLES, ADMIN_STAFF_ROLES } from '../../core/constants/role.constant';
import { firstValueFrom } from 'rxjs';

export const patientRoutes: Routes = [
  {
    path: '',
    redirectTo: 'danh-sach',
    pathMatch: 'full'
  },
  {
    path: 'danh-sach',
    loadComponent: () => import('./list-crud/list-patient-crud.component').then(m => m.ListPatientCrudComponent),
    canActivate: [RoleGuard],
    data: { roles: ADMIN_ROLES },
    resolve: {
      role: async () => {
        const authService = inject(AuthService);
        const router = inject(Router);
        try {
          const user = await firstValueFrom(authService.getUserInfo());
          if (user && user.roleId === Role.ADMIN) {
            return true;
          } else if (user && user.roleId === Role.STAFF) {
            return router.navigate(['/admin/benh-nhan/danh-sach/xem']);
          }
        } catch {
          return false;
        }
        return false;
      }
    }
  },
  {
    path: 'danh-sach/xem',
    loadComponent: () => import('./list-view/list-patient-view.component').then(m => m.ListPatientViewComponent),
    canActivate: [RoleGuard],
    data: { roles: STAFF_ROLES }
  },
  {
    path: 'danh-sach/:patientId',
    loadComponent: () => import('./detail/detail-patient.component').then(m => m.DetailPatientComponent),
    canActivate: [RoleGuard],
    data: { roles: ADMIN_STAFF_ROLES }
  },
  {
    path: 'lich-hen',
    loadComponent: () => import('./list-view/list-patient-view.component').then(m => m.ListPatientViewComponent),
    canActivate: [RoleGuard],
    data: { roles: ADMIN_STAFF_ROLES }
  }
]; 