import { Doctor } from './doctor.model';

export interface DoctorLeaveResponse {
    id: string;
    doctorId: string;
    leaveStartDate: string;  // Date in string format (ISO)
    leaveEndDate: string;    // Date in string format (ISO)
    reason: string;
    numberOfAppointments: number;
    doctorResponse: Doctor;
}
  