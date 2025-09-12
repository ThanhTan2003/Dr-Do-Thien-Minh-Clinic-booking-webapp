import { Doctor } from './doctor.model';
import { Service } from '../medical/service.model';

export interface DoctorService {
  id: string;
  doctorId: string;
  serviceId: string;
  serviceFee: string;
  status: boolean;
  statusName: string;
  numberOfExaminations: number;
  doctorResponse: Doctor;
  serviceResponse: Service;
}
