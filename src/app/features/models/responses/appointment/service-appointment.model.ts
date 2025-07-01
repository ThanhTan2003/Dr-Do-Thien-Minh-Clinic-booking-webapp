import { Service } from "../medical/service.model";
import { TimeFrame } from "./time-frame.model";

export interface ServiceAppointment {
    id: string;
    serviceResponse: Service;
    timeFrameResponse: TimeFrame;
}
  