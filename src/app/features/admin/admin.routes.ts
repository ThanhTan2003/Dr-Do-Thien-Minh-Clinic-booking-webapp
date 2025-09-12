import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { RoleGuard } from './auth/guards/role.guard';
import { ADMIN_ROLES, ALL_ROLES, STAFF_ROLES, MARKETING_ROLES, ADMIN_STAFF_ROLES, ADMIN_MARKETING_ROLES } from './core/constants/role.constant';

export const adminRoutes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./auth/components/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: '',
        loadComponent: () => import('./layouts/layout.component')
            .then(m => m.LayoutComponent),
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'lich-hen',
                pathMatch: 'full'
            },
            // {
            //     path: 'trang-chu',
            //     loadChildren: () => import('./features/home/home.routes').then(m => m.homeRoutes),
            //     canActivate: [RoleGuard],
            //     data: { roles: ALL_ROLES }
            // },
            {
                path: 'lich-hen',
                loadChildren: () => import('./features/appointment/appointment.routes').then(m => m.appointmentRoutes),
                canActivate: [RoleGuard],
                data: { roles: ALL_ROLES }
            },
            {
                path: 'bac-si',
                loadChildren: () => import('./features/doctor/doctor.routes').then(m => m.doctorRoutes),
                canActivate: [RoleGuard],
                data: { roles: ADMIN_STAFF_ROLES }
            },
            {
                path: 'y-te',
                loadChildren: () => import('./features/medical/medical.routes').then(m => m.medicalRoutes),
                canActivate: [RoleGuard],
                data: { roles: ADMIN_STAFF_ROLES }
            },
            {
                path: 'benh-nhan',
                loadChildren: () => import('./features/patient/patient.routes').then(m => m.patientRoutes),
                canActivate: [RoleGuard],
                data: { roles: ADMIN_STAFF_ROLES }
            },
            {
                path: 'zalo-oa',
                loadChildren: () => import('./features/zalo-oa/zalo-oa.routes').then(m => m.zaloOARoutes),
                canActivate: [RoleGuard],
                data: { roles: ADMIN_MARKETING_ROLES }
            },
            {
                path: 'tai-khoan',
                loadChildren: () => import('./features/account/account.routes').then(m => m.accountRoutes),
                canActivate: [RoleGuard],
                data: { roles: ADMIN_ROLES }
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];