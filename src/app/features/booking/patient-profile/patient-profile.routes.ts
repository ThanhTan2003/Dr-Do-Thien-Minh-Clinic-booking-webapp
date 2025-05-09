import { Routes } from '@angular/router';

export const patientProfileRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/patient/patient.component').then(m => m.PatientProfileComponent),
    children: [
      {
        path: 'create',
        loadComponent: () => import('../compoments/patient/create-patient.component').then(m => m.CreatePatientComponent)
      },
      {
        path: ':patientId',
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
];
