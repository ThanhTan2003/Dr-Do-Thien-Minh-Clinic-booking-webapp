export interface DoctorLeaveRequest {
    doctorId: string;
    leaveStartDate: string;  // Date in string format (ISO)
    leaveEndDate: string;    // Date in string format (ISO)
    reason: string;
  }
  