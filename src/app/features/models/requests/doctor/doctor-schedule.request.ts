export interface DoctorScheduleRequest {
    doctorId: string;
    timeFrameId: string;
    dayOfWeek: string; // e.g., "MONDAY"
    maxPatients: number;
    status: boolean;
  }
  