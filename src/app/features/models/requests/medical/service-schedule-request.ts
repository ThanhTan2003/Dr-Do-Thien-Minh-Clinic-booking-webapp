export interface ServiceScheduleRequest {
    id?: string;
    serviceId?: string;
    timeFrameId?: string;
    startTime?: string;
    dayOfWeek?: string;
    maxPatients?: number;
    status?: boolean;
  }
  