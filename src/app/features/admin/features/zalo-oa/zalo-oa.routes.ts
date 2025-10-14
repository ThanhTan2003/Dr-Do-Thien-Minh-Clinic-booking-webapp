import { Routes } from '@angular/router';
import { RoleGuard } from '../../auth/guards/role.guard';
import { ADMIN_MARKETING_ROLES } from '../../core/constants/role.constant';

export const zaloOARoutes: Routes = [
  {
    path: '',
    redirectTo: 'thong-tin',
    pathMatch: 'full'
  },
  {
    path: 'thong-tin',
    loadComponent: () => import('./info/info.component').then(m => m.ZaloOAInfoComponent),
    canActivate: [RoleGuard],
    data: { roles: ADMIN_MARKETING_ROLES }
  },
  {
    path: 'nguoi-dung',
    loadComponent: () => import('./user/list/list-user.component').then(m => m.ListUserComponent),
    canActivate: [RoleGuard],
    data: { roles: ADMIN_MARKETING_ROLES },
    children: [
      {
        path: ':userId',
        loadComponent: () => import('./user/detail/detail-user.component').then(m => m.DetailUserComponent),
        canActivate: [RoleGuard],
        data: { roles: ADMIN_MARKETING_ROLES },
        children: [
          // {
          //   path: 'nhom-doi-tuong',
          //   loadComponent: () => import('./user/detail/tag-information/tag-information.component').then(m => m.TagInformationComponent),
          //   canActivate: [RoleGuard],
          //   data: { roles: ADMIN_MARKETING_ROLES }
          // },
          {
            path: 'ghi-chu',
            loadComponent: () => import('./user/detail/note/note.component').then(m => m.NoteComponent),
            canActivate: [RoleGuard],
            data: { roles: ADMIN_MARKETING_ROLES }
          },
          {
            path: 'ho-so-kham-benh',
            loadComponent: () => import('./user/detail/patient/list/patient-list.component').then(m => m.PatientListComponent),
            canActivate: [RoleGuard],
            data: { roles: ADMIN_MARKETING_ROLES }
          },
          {
            path: 'lich-su-kham-benh',
            loadComponent: () => import('./user/detail/history-appointment/history-appointment.component').then(m => m.HistoryAppointmentComponent),
            canActivate: [RoleGuard],
            data: { roles: ADMIN_MARKETING_ROLES }
          }
        ]
      }
    ]
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