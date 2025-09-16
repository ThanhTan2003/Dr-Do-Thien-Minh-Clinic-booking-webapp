import { AdvisoryStatus } from './advisory-status.model';
import { DoctorService } from '../doctor/doctor-service.model';

export interface SuggestedDoctor {
  timeFrameId: string;
  advisoryStatusResponses: AdvisoryStatus[];
  doctorServiceResponse: DoctorService;
}
