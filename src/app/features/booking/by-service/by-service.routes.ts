import { Routes } from '@angular/router';

export const byServiceRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/service-category/service-category.component').then(
        (m) => m.ServiceCategoryComponent
      ),
    children: [
      {
        path: ':serviceCategoryId',
        loadComponent: () =>
          import('./components/service/service.component').then(
            (m) => m.ServiceComponent
          ),
        children: [
          {
            path: ':serviceId',
            loadComponent: () =>
              import('./components/doctor-service/doctor-service.component').then(
                (m) => m.DoctorServiceComponent
              ),
            children: [
              {
                path: ':doctorServiceId',
                loadComponent: () =>
                  import('../compoments/schedule/schedule.component').then(
                    (m) => m.ScheduleComponent
                  ),
                children: [
                  {
                    path: ':doctorScheduleId/:date',
                    loadComponent: () =>
                      import('../compoments/patient/patient.component').then(
                        (m) => m.PatientComponent
                      ),
                    children: [
                      {
                        path: 'create',
                        loadComponent: () =>
                          import('../compoments/patient/create-patient.component').then(
                            (m) => m.CreatePatientComponent
                          )
                      },
                      {
                        path: ':patientId',
                        loadComponent: () =>
                          import('../compoments/confirm/confirm.component').then(
                            (m) => m.ConfirmComponent
                          ),
                        children: [
                          {
                            path: ':appointmentId',
                            loadComponent: () =>
                              import('../compoments/result/result.component').then(
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
];
