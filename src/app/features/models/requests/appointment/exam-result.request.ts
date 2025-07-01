export interface ExamResultRequest {
    status: string;
    doctorMessage: string;
    note: string;
    reExaminationDate: string;  // LocalDate sẽ được chuyển thành kiểu string trong TypeScript
}
  