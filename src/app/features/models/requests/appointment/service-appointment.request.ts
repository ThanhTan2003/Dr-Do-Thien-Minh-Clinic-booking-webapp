export interface ServiceAppointmentRequest {
    patientId: string;
    serviceId: string;
    timeFrameId: string;
    appointmentDate: string; // yyyy-MM-dd
    patientMessage?: string;
  }
  