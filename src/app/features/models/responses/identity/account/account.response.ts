import { Doctor } from "../../doctor/doctor.model";
import { RoleResponse } from "./role.response";
import { StatusResponse } from "./status.response";

export interface AccountResponse {
    id: string;
    userName: string;
    accountName: string;
    lastAccessTime: string;
    doctorId: string;
    roleResponse: RoleResponse;
    statusResponse: StatusResponse;
    doctorResponse: Doctor;
}