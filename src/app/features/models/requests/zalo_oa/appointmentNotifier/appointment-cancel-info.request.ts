import { AppointmentInfo } from "./appointment-info.request";

export interface AppointmentCancelInfo {
    appointmentInfo: AppointmentInfo;
    reason: string;
  }