import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../../../models/responses/appointment/appointment.model';
import { AppointmentRequest } from '../../../models/requests/appointment/appointment.request';
import { PageResponse } from '../../../models/responses/page-response.model';
import { HttpService } from '../../../../core/services/http.service';
import { ExamResultRequest } from '../../../models/requests/appointment/exam-result.request';
import { ServiceAppointmentRequest } from '../../../models/requests/appointment/service-appointment.request';
import { AppointmentResultResponse } from '../../../models/responses/appointment/appointment-result.response';

@Injectable({
    providedIn: 'root'
})

export class AppointmentActionService {
    constructor(private http: HttpService) { }

    private readonly API_URL = '/api/v1/appointment/action';

    /**
     * Tạo lịch hẹn mới
     */
    create(request: AppointmentRequest): Observable<Appointment> {
        return this.http.post<Appointment>(this.API_URL, request);
    }

    createByCustomer(request: AppointmentRequest): Observable<Appointment> {
        return this.http.post<Appointment>(`${this.API_URL}/customer`, request);
    }

    createBookingServiceByCustomer(request: ServiceAppointmentRequest): Observable<Appointment> {
        return this.http.post<Appointment>(`${this.API_URL}/customer/booking-service`, request);
    }

    /**
       * Xác nhận lịch hẹn
       */
    confirmAppointment(id: string, request: ExamResultRequest): Observable<Appointment> {
        return this.http.patch<Appointment>(`${this.API_URL}/confirm/${id}`, request);
    }

    /**
     * Huỷ lịch hẹn
     */
    cancelAppointment(id: string, request: ExamResultRequest): Observable<Appointment> {
        return this.http.patch<Appointment>(`${this.API_URL}/cancel/${id}`, request);
    }

    /**
     * Xác nhận đã khám
     */
    markAppointmentAsDone(id: string, request: ExamResultRequest): Observable<Appointment> {
        return this.http.patch<Appointment>(`${this.API_URL}/mark-done/${id}`, request);
    }

    /**
     * Cập nhật lịch hẹn
     */
    updateById(id: string, request: ExamResultRequest): Observable<Appointment> {
        return this.http.put<Appointment>(`${this.API_URL}/${id}`, request);
    }

    /**
     * Xoá lịch hẹn
     */
    deleteAppointment(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

}