import { Patient } from '../patient/patient.model';
import { DoctorSchedule } from '../doctor/doctor-schedule.model';
import { DoctorService } from '../doctor/doctor-service.model';
import { ServiceAppointment } from './service-appointment.model';

export interface Appointment {
  id: string;
  zaloUid: string;
  patientId: string;
  serviceId: string;
  doctorServiceId: string;
  doctorScheduleId: string;
  bookingTime: string;
  appointmentDate: string;
  appointmentDateName: string;
  status: string;
  patientName: string;

  patientMessage: string;
  doctorMessage: string;
  result: string;
  note: string;
  reExaminationDate: string;
  appointmentType: string;

  serviceName: string;
  doctorName: string;
  price: string;

  serviceAppointmentResponse: ServiceAppointment;
  patientResponse: Patient;
  doctorScheduleResponse: DoctorSchedule;
  doctorServiceResponse: DoctorService;
}