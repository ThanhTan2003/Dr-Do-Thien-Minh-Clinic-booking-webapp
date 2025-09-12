export interface ServiceAppointmentResultRequest {
    doctorId: string,
    status :string,
    result: string;
    doctorMessage: string;
    note: string;
    reExaminationDate: string;  // LocalDate sẽ được chuyển thành kiểu string trong TypeScript
    sendNotification: boolean;
}
  