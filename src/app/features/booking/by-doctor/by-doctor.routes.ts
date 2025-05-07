import { Routes } from '@angular/router';

export const byDoctorRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/doctor/doctor.component').then(m => m.DoctorComponent),
    children: [
      {
        path: ':doctorId',
        loadComponent: () => import('./components/doctor-service/doctor-service.component').then(m => m.DoctorServiceComponent),
        children: [
          {
            path: ':doctorServiceId',
            loadComponent: () => import('../compoments/schedule/schedule.component').then(m => m.ScheduleComponent),
            children: [
              {
                path: ':doctorScheduleId/:date',
                loadComponent: () => import('../compoments/patient/patient.component').then(m => m.PatientComponent),
                children: [
                  {
                    path: 'create',
                    loadComponent: () => import('../compoments/patient/create-patient.component').then(m => m.CreatePatientComponent)
                  },
                  {
                    path: ':patientId',
                    loadComponent: () => import('../compoments/confirm/confirm.component').then(m => m.ConfirmComponent),
                    children: [
                      {
                        path: ':appointmentId',
                        loadComponent: () => import('../compoments/result/result.component').then(m => m.BookingResultComponent)
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