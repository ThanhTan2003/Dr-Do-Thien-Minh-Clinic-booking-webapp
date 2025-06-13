import { Patient } from './patient.model';
import { DoctorSchedule } from '../doctor/doctor-schedule.model';
import { DoctorService } from '../doctor/doctor-service.model';

export interface Appointment {
  id: string;
  zaloUid: string;
  patientId: string;
  doctorServiceId: string;
  doctorScheduleId: string;
  bookingTime: string;
  appointmentDate: string;
  appointmentDateName: string;
  status: string;
  patientMessage: string;
  patientName: string;
  note: String;
  patientResponse: Patient;
  doctorScheduleResponse: DoctorSchedule;
  doctorServiceResponse: DoctorService;
}
