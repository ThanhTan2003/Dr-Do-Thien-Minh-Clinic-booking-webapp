import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResponse } from '../../../models/responses/page-response.model';
import { HttpService } from '../../../../core/services/http.service';
import { HolidayRequest } from '../../../models/requests/doctor/holiday-request';
import { HolidayResponse } from '../../../models/responses/doctor/holiday.model';

import { Appointment } from '../../../models/responses/appointment/appointment.model';

@Injectable({
    providedIn: 'root'
})

export class Holiday {
    constructor(private http: HttpService) { }

    private readonly API_URL = '/api/v1/appointment/holiday';

    /**
     * Tạo ngày nghỉ mới
     */
    createHoliday(payload: HolidayRequest): Observable<HolidayResponse> {
        return this.http.post<HolidayResponse>(`${this.API_URL}`, payload);
    }

    /**
     * Xoá ngày nghỉ
     */
    deleteHoliday(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

    /**
     * Lấy tất cả ngày nghỉ (phân trang + tìm kiếm)
     */
    getAllHolidays(keyword: string = '', page: number = 1, size: number = 10): Observable<PageResponse<HolidayResponse>> {
        return this.http.get<PageResponse<HolidayResponse>>(
            `${this.API_URL}?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`
        );
    }

    /**
     * Lấy danh sách ngày nghỉ sắp tới
     */
    getUpcomingHolidays(): Observable<Date[]> {
        return this.http.get<Date[]>(`${this.API_URL}/upcoming`);
    }

}