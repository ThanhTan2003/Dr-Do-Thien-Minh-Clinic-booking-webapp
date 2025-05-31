import { Routes } from '@angular/router';
import { RoleGuard } from '../../auth/guards/role.guard';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { Role } from '../../core/enums/role.enum';
import { ADMIN_ROLES, STAFF_ROLES, ADMIN_STAFF_ROLES } from '../../core/constants/role.constant';
import { firstValueFrom } from 'rxjs';

export const medicalRoutes: Routes = [
  {
    path: '',
    redirectTo: 'phong-kham',
    pathMatch: 'full'
  },
  {
    path: 'nhom-dich-vu',
    loadComponent: () => import('./service-type/list-crud/list-service-type-crud.component').then(m => m.ListServiceTypeCrudComponent),
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
            return router.navigate(['/admin/y-te/nhom-dich-vu/xem']);
          }
        } catch {
          return false;
        }
        return false;
      }
    }
  },
  {
    path: 'nhom-dich-vu/xem',
    loadComponent: () => import('./service-type/list-view/list-service-type-view.component').then(m => m.ListServiceTypeViewComponent),
    canActivate: [RoleGuard],
    data: { roles: STAFF_ROLES }
  },
  {
    path: 'nhom-dich-vu/:serviceTypeId',
    loadComponent: () => import('./service-type/detail/detail-service-type.component').then(m => m.DetailServiceTypeComponent),
    canActivate: [RoleGuard],
    data: { roles: ADMIN_STAFF_ROLES }
  },
  {
    path: 'dich-vu',
    loadComponent: () => import('./medical-service/list-crud/list-medical-service-crud.component').then(m => m.ListMedicalServiceCrudComponent),
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
            return router.navigate(['/admin/y-te/dich-vu/xem']);
          }
        } catch {
          return false;
        }
        return false;
      }
    }
  },
  {
    path: 'dich-vu/xem',
    loadComponent: () => import('./medical-service/list-view/list-medical-service-view.component').then(m => m.ListMedicalServiceViewComponent),
    canActivate: [RoleGuard],
    data: { roles: STAFF_ROLES }
  },
  {
    path: 'dich-vu/:serviceId',
    loadComponent: () => import('./medical-service/detail/detail-medical-service.component').then(m => m.DetailMedicalServiceComponent),
    canActivate: [RoleGuard],
    data: { roles: ADMIN_STAFF_ROLES }
  },
  {
    path: 'phong-kham',
    loadComponent: () => import('./clinic/detail/clinic-detail.component').then(m => m.ClinicDetailComponent),
    canActivate: [RoleGuard],
    data: { roles: ADMIN_STAFF_ROLES }
  }
];