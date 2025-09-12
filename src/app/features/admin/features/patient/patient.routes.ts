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
    },
    children: [
      {
        path: ':patientId/:userId',
        loadComponent: () => import('./detail/patient-detail.component').then(m => m.PatientDetailComponent),
        canActivate: [RoleGuard],
        data: { roles: ADMIN_ROLES },
        children: [
          {
            path: 'thong-tin-zalo',
            loadComponent: () => import('./detail/zalo-information/patient-zalo-information.component').then(m => m.patientZaloInformationComponent),
            canActivate: [RoleGuard],
            data: { roles: ADMIN_ROLES }
          },
          {
            path: 'nhom-doi-tuong',
            loadComponent: () => import('./detail/tag/patient-tag.component').then(m => m.PatientTagComponent),
            canActivate: [RoleGuard],
            data: { roles: ADMIN_ROLES }
          },
          {
            path: 'ghi-chu',
            loadComponent: () => import('./detail/note/patient-note.component').then(m => m.PatientNoteComponent),
            canActivate: [RoleGuard],
            data: { roles: ADMIN_ROLES }
          },
          {
            path: 'lich-su-kham-benh',
            loadComponent: () => import('./detail/history-appointment/patient-history-appointment.component').then(m => m.PatientHistoryAppointmentComponent),
            canActivate: [RoleGuard],
            data: { roles: ADMIN_ROLES }
          }
        ]
      }
    ]
  },
  {
    path: 'lich-hen',
    loadComponent: () => import('./list-view/list-patient-view.component').then(m => m.ListPatientViewComponent),
    canActivate: [RoleGuard],
    data: { roles: ADMIN_STAFF_ROLES }
  }
]; 