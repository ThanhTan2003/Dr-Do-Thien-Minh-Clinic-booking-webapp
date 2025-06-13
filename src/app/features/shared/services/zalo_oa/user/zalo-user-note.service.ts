import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../../core/services/http.service';
import { ZaloUserNoteResponse } from '../../../../models/responses/zalo_oa/user/zalo-user-note.response';

@Injectable({
  providedIn: 'root'
})
export class ZaloUserNoteService {
  private readonly API_URL = '/api/v1/zalo-oa/zalo-user-note';

  constructor(private http: HttpService) {}

  /**
   * Lấy tất cả ghi chú của người dùng theo userId
   */
  getAllNotesByUserId(userId: string): Observable<ZaloUserNoteResponse[]> {
    return this.http.get<ZaloUserNoteResponse[]>(`${this.API_URL}/zalo-user/${userId}`);
  }
}
