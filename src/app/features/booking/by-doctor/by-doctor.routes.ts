import { Routes } from '@angular/router';

export const byDoctorRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./by-doctor.component').then(m => m.ByDoctorComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/doctor/doctor.component').then(m => m.DoctorComponent)
      },
      {
        path: ':doctorId',
        loadComponent: () => import('./components/doctor-service/doctor-service.component').then(m => m.DoctorServiceComponent),
        children: [
          {
            path: ':doctorServiceId',
            loadComponent: () => import('./components/schedule/schedule.component').then(m => m.ScheduleComponent),
            children: [
              {
                path: ':doctorScheduleId/:date',
                loadComponent: () => import('./components/patient/patient.component').then(m => m.PatientComponent),
                children: [
                  {
                    path: 'create',
                    loadComponent: () => import('./components/patient/create-patient.component').then(m => m.CreatePatientComponent)
                  },
                  {
                    path: ':patientId',
                    loadComponent: () => import('./components/confirm/confirm.component').then(m => m.ConfirmComponent),
                    children: [
                      {
                        path: ':appointmentId',
                        loadComponent: () => import('./components/result/result.component').then(m => m.ResultComponent)
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