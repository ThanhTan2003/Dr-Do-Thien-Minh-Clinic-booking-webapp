import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { USER_ROLES } from '../core/constants/role.constant';

export const byServiceV2Routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./service-category/service-category.component').then(
        (m) => m.ServiceCategoryComponent
      ),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: USER_ROLES },
    children: [
      {
        path: ':serviceCategoryId',
        loadComponent: () =>
          import('./service/service.component').then(
            (m) => m.ServiceComponent
          ),
        children: [
          {
            path: ':serviceId',
            loadComponent: () =>
              import('./schedule/schedule.component').then(
                (m) => m.ScheduleComponent
              ),
            children: [
              {
                path: ':timeFrameId/:date',
                loadComponent: () =>
                  import('./patient/patient.component').then(
                    (m) => m.PatientComponent
                  ),
                children: [
                  {
                    path: 'create',
                    loadComponent: () =>
                      import('../compoments/patient/create/create-patient.component').then(
                        (m) => m.CreatePatientComponent
                      )
                  },
                  {
                    path: ':patientId',
                    children: [
                      {
                        path: 'update',
                        loadComponent: () =>
                          import('../compoments/patient/update/update-patient.component').then(
                            (m) => m.UpdatePatientComponent
                          )
                      },
                      {
                        path: '',
                        loadComponent: () =>
                          import('./confirm/confirm.component').then(
                            (m) => m.ConfirmComponent
                          ),
                        children: [
                          {
                            path: ':appointmentId',
                            loadComponent: () =>
                              import('./result/result.component').then(
                                (m) => m.BookingResultComponent
                              )
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]
