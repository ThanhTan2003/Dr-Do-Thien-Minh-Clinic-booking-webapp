import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../../core/services/http.service';
import { ZaloOAInfoResponse } from '../../../../models/responses/zalo_oa/zalo/zalo-oa-info.response';
import { ZaloOAQuotaResponse } from '../../../../models/responses/zalo_oa/zalo/zalo-oa-quota.response';

@Injectable({
  providedIn: 'root'
})
export class ZaloOaService {
  private readonly API_URL = '/api/v1/zalo-oa/info';

  constructor(private http: HttpService) {}

  /**
   * Lấy thông tin Zalo OA
   */
  getOAInfo(): Observable<ZaloOAInfoResponse> {
    return this.http.get<ZaloOAInfoResponse>(`${this.API_URL}/info`);
  }

  /**
   * Lấy quota của Zalo OA
   */
  getOAQuota(): Observable<ZaloOAQuotaResponse[]> {
    return this.http.get<ZaloOAQuotaResponse[]>(`${this.API_URL}/quota`);
  }
}
