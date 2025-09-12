export interface DoctorScheduleRequest {
  id?: string;
  doctorId: string;
  timeFrameId?: string;
  startTime?: string;
  dayOfWeek?: string;
  maxPatients: number;
  status: boolean;
}
  