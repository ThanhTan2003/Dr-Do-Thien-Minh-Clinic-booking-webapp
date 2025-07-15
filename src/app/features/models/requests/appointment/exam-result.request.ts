export interface ExamResultRequest {
    price: string;
    status: string;
    result: string;
    doctorMessage: string;
    note: string;
    reExaminationDate: string;  // LocalDate sẽ được chuyển thành kiểu string trong TypeScript
}
  