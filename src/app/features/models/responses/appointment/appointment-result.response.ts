export interface AppointmentResultResponse {
    price: string;
    appointmentDate: string;  // LocalDate sẽ được chuyển thành kiểu string trong TypeScript
    serviceId: string;
    serviceName: string;
    doctorMessage: string;
    note: string;
  }
  