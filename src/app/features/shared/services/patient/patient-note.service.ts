import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../core/services/http.service';
import { PatientNoteRequest } from '../../../models/requests/patient/patient-note.request';
import { PatientNoteResponse } from '../../../models/responses/patient/patient-note.response';
import { PageResponse } from '../../../models/responses/page-response.model';

@Injectable({
  providedIn: 'root'
})
export class PatientNoteService {

  private readonly API_URL = '/api/v1/appointment/patient-note';

  constructor(private http: HttpService) {}

  /**
   * Tạo mới ghi chú bệnh nhân
   */
  createNote(request: PatientNoteRequest): Observable<PatientNoteResponse> {
    return this.http.post<PatientNoteResponse>(this.API_URL, request);
  }

  /**
   * Xoá ghi chú bệnh nhân theo ID
   */
  deleteNote(id: string): Observable<string> {
    return this.http.delete<string>(`${this.API_URL}/${id}`);
  }

  /**
   * Lấy ghi chú bệnh nhân theo patientId (với phân trang)
   */
  getNotesByPatientId(patientId: string, page = 1, size = 10): Observable<PageResponse<PatientNoteResponse>> {
    return this.http.get<PageResponse<PatientNoteResponse>>(
      `${this.API_URL}?patientId=${patientId}&page=${page}&size=${size}`
    );
  }
}
