import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { HttpService } from '../../../../core/services/http.service';
import { AppointmentStatusCount } from '../../../models/responses/appointment/appointment-status-count.model';

@Injectable({
    providedIn: 'root'
})
export class AppointmentStatisticsService {
    constructor(private http: HttpService) { }

    private readonly API_URL = '/api/v1/appointment/main/statistics';

    /**
   * Thống kê tất cả
   */
    getStatisticsAll(): Observable<AppointmentStatusCount> {
        return this.http.get<AppointmentStatusCount>(`${this.API_URL}/all`);
    }

    /**
     * Thống kê theo ngày khám
     */
    getStatisticsByDate(date: string): Observable<AppointmentStatusCount> {
        return this.http.get<AppointmentStatusCount>(
            `${this.API_URL}/by-date/${date}`
        );
    }

    /**
     * Thống kê theo bác sĩ
     */
    getStatisticsByDoctor(doctorId: string): Observable<AppointmentStatusCount> {
        return this.http.get<AppointmentStatusCount>(
            `${this.API_URL}/by-doctor/${doctorId}`
        );
    }

    /**
     * Thống kê theo bác sĩ và ngày
     */
    getStatisticsByDoctorAndDate(doctorId: string, date: string): Observable<AppointmentStatusCount> {
        return this.http.get<AppointmentStatusCount>(
            `${this.API_URL}/by-doctor-date/${doctorId}/${date}`
        );
    }

    /**
     * Thống kê theo bệnh nhân
     */
        getStatisticsByPatient(patientId: string): Observable<AppointmentStatusCount> {
        return this.http.get<AppointmentStatusCount>(
            `${this.API_URL}/by-patient/${patientId}`
        );
    }

    /**
     * Thống kê theo Zalo user
     */
    getStatisticsByZaloUid(zaloUid: string): Observable<AppointmentStatusCount> {
        return this.http.get<AppointmentStatusCount>(
            `${this.API_URL}/by-zalo-user/${zaloUid}`
        );
    }

}