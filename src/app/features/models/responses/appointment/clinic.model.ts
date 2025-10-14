export interface Clinic {
  id: string;
  clinicName: string;
  address: string;
  description: string;
  supportPhone: string;

  // Cho phép đặt lịch khám theo bác sĩ
  allowBookingByDoctor?: boolean;

  // Cho phép đặt lịch khám theo dịch vụ
  allowBookingByService?: boolean;

  // Gửi thông báo cho bác sĩ khi đặt lịch
  sendNotificationToDoctorOnBooking?: boolean;

  // Gửi thông báo cho quản trị viên Zalo OA khi đặt lịch
  sendNotificationToZaloOAAdminOnBooking?: boolean;

  // Gửi thông báo cho bệnh nhân khi đặt lịch thành công
  sendNotificationToPatientOnBooking?: boolean;

  // Gửi thông báo cho bệnh nhân khi lịch hẹn được xác nhận
  sendNotificationOnConfirmed?: boolean;

  // Gửi nhắc bệnh nhân trước 1 ngày khám
  sendReminderBefore1Day?: boolean;

  // Gửi cảm ơn sau khi bệnh nhân khám xong
  sendThanksAfterVisit?: boolean;
}
