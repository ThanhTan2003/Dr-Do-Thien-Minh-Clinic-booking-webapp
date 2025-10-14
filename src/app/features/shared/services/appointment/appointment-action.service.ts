import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../../../models/responses/appointment/appointment.model';
import { AppointmentRequest } from '../../../models/requests/appointment/appointment.request';
import { PageResponse } from '../../../models/responses/page-response.model';
import { HttpService } from '../../../../core/services/http.service';
import { ExamResultRequest } from '../../../models/requests/appointment/exam-result.request';
import { ServiceAppointmentRequest } from '../../../models/requests/appointment/service-appointment.request';
import { AppointmentResultResponse } from '../../../models/responses/appointment/appointment-result.response';
import { AssignDoctorRequest } from '../../../models/requests/appointment/assign-doctor-request';
import { SuggestedDoctor } from '../../../models/responses/appointment/suggested-doctor.model';

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

    createByAdmin(request: AppointmentRequest): Observable<Appointment> {
        return this.http.post<Appointment>(`${this.API_URL}/admin`, request);
    }

    createBookingServiceByCustomer(request: ServiceAppointmentRequest): Observable<Appointment> {
        return this.http.post<Appointment>(`${this.API_URL}/customer/booking-service`, request);
    }

    createBookingServiceByAdmin(request: ServiceAppointmentRequest): Observable<Appointment> {
        return this.http.post<Appointment>(`${this.API_URL}/admin/booking-service`, request);
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


    /**
     * 3.1 Lấy danh sách gợi ý bác sĩ cho lịch hẹn theo dịch vụ
     */
    getSuggestedDoctors(
        appointmentId: string,
        keyword = '',
        page = 1,
        size = 10
    ): Observable<PageResponse<SuggestedDoctor>> {
        const qs = new URLSearchParams();
        if (keyword) qs.set('keyword', keyword);
        qs.set('page', String(page));
        qs.set('size', String(size));

        return this.http.get<PageResponse<SuggestedDoctor>>(
            `${this.API_URL}/${appointmentId}/suggested-doctors?${qs.toString()}`
        );
    }

    /**
     * 3.2 Chỉ định bác sĩ khám
     */
    assignDoctor(
        appointmentId: string,
        request: AssignDoctorRequest
    ): Observable<Appointment> {
        return this.http.post<Appointment>(
            `${this.API_URL}/${appointmentId}/assign-doctor`,
            request
        );
    }

    /**
     * 3.3 Chuyển đổi khám theo bác sĩ -> khám theo dịch vụ
     */
    convertToServiceAppointment(
        appointmentId: string,
        request: ServiceAppointmentRequest
    ): Observable<Appointment> {
        return this.http.put<Appointment>(
            `${this.API_URL}/${appointmentId}/convert`,
            request
        );
    }

    /**
    * 4.1 Lấy danh sách gợi ý thay thế bác sĩ cho lịch hẹn (dựa vào bác sĩ hiện tại)
    */
    getSuggestedDoctorsByDoctor(
        appointmentId: string,
        keyword = '',
        page = 1,
        size = 10
    ): Observable<PageResponse<SuggestedDoctor>> {
        let url = `${this.API_URL}/${appointmentId}/doctor/suggested-doctors?keyword=${keyword}&page=${page}&size=${size}`;
        return this.http.get<PageResponse<SuggestedDoctor>>(url);
    }

    /**
    * 4.2 Chỉ định bác sĩ thay thế cho lịch hẹn
    */
    assignDoctorByDoctor(
        appointmentId: string,
        request: AssignDoctorRequest
    ): Observable<Appointment> {
        return this.http.post<Appointment>(
            `${this.API_URL}/${appointmentId}/doctor/assign-doctor`,
            request
        );
    }


}