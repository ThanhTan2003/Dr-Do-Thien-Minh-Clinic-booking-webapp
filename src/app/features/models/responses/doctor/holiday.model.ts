export interface HolidayResponse {
    id: string;
    holidayName: string;
    startDate: string;  // Date in string format (ISO)
    endDate: string;    // Date in string format (ISO)
    numberOfAppointments: number;
  }
  