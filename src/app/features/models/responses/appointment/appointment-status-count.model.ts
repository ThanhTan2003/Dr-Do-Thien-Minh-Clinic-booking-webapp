export interface AppointmentStatusCount {
    totalAppointments: number;
    pendingConfirmationCount: number;
    waitingForExamCount: number;
    examinedCount: number;
    cancelledCount: number;
} 