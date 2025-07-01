import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { USER_ROLES } from '../core/constants/role.constant';

export const patientProfileRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/patient/patient.component').then(m => m.PatientProfileComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: USER_ROLES },
    children: [
      {
        path: 'create',
        loadComponent: () => import('../compoments/patient/create/create-patient.component').then(m => m.CreatePatientComponent)
      },
      {
        path: ':patientId',
        children: [
          {
            path: 'update',
            loadComponent: () => import('../compoments/patient/update/update-patient.component').then(m => m.UpdatePatientComponent)
          },
          {
            path: '',
            loadComponent: () => import('./components/appointment/patient-appointment.component').then(m => m.PatientAppointmentComponent),
            children: [
              {
                path: ':appointmentId',
                loadComponent: () => import('./components/appointment/patient-appointment-detail.component').then(m => m.PatientAppointmentDetailComponent)
              }
            ]
          }
        ]
      }
    ]
  }
];
