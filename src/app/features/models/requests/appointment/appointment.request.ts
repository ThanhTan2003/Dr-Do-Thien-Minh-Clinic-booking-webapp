export interface AppointmentRequest {
    patientId: string;
    doctorServiceId: string;
    doctorScheduleId: string;
    appointmentDate: string; // yyyy-MM-dd
    patientMessage?: string;
    patientName?: string;
    note?: String;
  }
  