import { Doctor } from './doctor.model';
import { TimeFrame } from '../appointment/time-frame.model';

export interface DoctorSchedule {
  id: string;
  doctorId: string;
  timeFrameId: string;
  dayOfWeek: string;
  maxPatients: number;
  status: boolean;
  statusName: string;
  roomName: string;
  doctorResponse: Doctor;
  timeFrameResponse: TimeFrame;
}
