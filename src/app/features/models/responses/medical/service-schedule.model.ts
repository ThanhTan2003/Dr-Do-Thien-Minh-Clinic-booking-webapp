import { TimeFrame } from '../appointment/time-frame.model';
import { Service } from './service.model';

export interface ServiceSchedule {
  id: string;
  serviceId: string;
  timeFrameId: string;
  dayOfWeek: string;
  maxPatients: number;
  status: boolean;
  statusName: string;
  serviceResponse: Service;
  timeFrameResponse: TimeFrame;
}
