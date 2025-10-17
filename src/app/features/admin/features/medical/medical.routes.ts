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
    path: 'phong-kham',
    loadComponent: () => import('./clinic/detail/clinic-detail.component').then(m => m.ClinicDetailComponent),
    canActivate: [RoleGuard],
    data: { roles: ADMIN_STAFF_ROLES }
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
          const user = await firstValueFrom(authService.getAccountInfo());
          if (user && user.roleResponse.id === Role.ADMIN) {
            return true;
          } else if (user && user.roleResponse.id === Role.STAFF) {
            return router.navigate(['/admin/y-te/nhom-dich-vu/xem']);
          }
        } catch {
          return false;
        }
        return false;
      }
    },
    children: [
      {
        path: ':serviceTypeId',
        loadComponent: () => import('./service-type/detail/detail-service-type.component').then(m => m.DetailServiceTypeComponent),
        canActivate: [RoleGuard],
        data: { roles: ADMIN_STAFF_ROLES }
      }
    ]
  },
  {
    path: 'nhom-dich-vu/xem',
    loadComponent: () => import('./service-type/list-view/list-service-type-view.component').then(m => m.ListServiceTypeViewComponent),
    canActivate: [RoleGuard],
    data: { roles: STAFF_ROLES }
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
          const user = await firstValueFrom(authService.getAccountInfo());
          if (user && user.roleResponse.id === Role.ADMIN) {
            return true;
          } else if (user && user.roleResponse.id === Role.STAFF) {
            return router.navigate(['/admin/y-te/dich-vu/xem']);
          }
        } catch {
          return false;
        }
        return false;
      }
    },
    children: [
      {
        path: ':serviceId',
        loadComponent: () => import('./medical-service/edit/edit-service.component').then(m => m.EditServiceComponent),
        canActivate: [RoleGuard],
        data: { roles: ADMIN_ROLES },
        children: [
          {
            path: 'kham-benh',
            loadComponent: () => import('./medical-service/edit/list-doctor/list-doctor.component').then(m => m.MedicalServiceListDoctorComponent),
            canActivate: [RoleGuard],
            data: { roles: ADMIN_ROLES }
          },
          {
            path: 'lich-nhan-kham',
            loadComponent: () => import('./medical-service/edit/list-schedule/list-schedule.component').then(m => m.MedicalServiceListScheduleComponent),
            canActivate: [RoleGuard],
            data: { roles: ADMIN_ROLES }
          },
          {
            path: 'lich-su',
            loadComponent: () => import('./medical-service/edit/appointment-history/appointment-history.component').then(m => m.MedicalServiceAppointmentHistoryComponent),
            canActivate: [RoleGuard],
            data: { roles: ADMIN_ROLES }
          }
        ]
      }
    ]
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