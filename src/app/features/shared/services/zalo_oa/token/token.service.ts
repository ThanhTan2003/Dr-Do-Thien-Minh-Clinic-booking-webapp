import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../../core/services/http.service';
import { TokenResponse } from '../../../../models/responses/zalo_oa/token/token-response.model';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private http: HttpService) {}

  private readonly API_URL = '/api/v1/zalo-oa/token';

  /**
   * Lấy access token
   */
  getAccessToken(): Observable<TokenResponse> {
    return this.http.get<TokenResponse>(this.API_URL);
  }

  /**
   * Tạo mới token
   */
  generateToken(): Observable<TokenResponse> {
    return this.http.get<TokenResponse>(`${this.API_URL}/generate-token`);
  }

  /**
   * Tạo token bằng authorization code
   */
  generateTokenByAuthorizationCode(authorizationCode: string): Observable<TokenResponse> {
    return this.http.get<TokenResponse>(`${this.API_URL}/generate-token/authorization-code?authorizationCode=${authorizationCode}`);
  }

  /**
   * Làm mới token
   */
  refreshToken(): Observable<TokenResponse> {
    return this.http.get<TokenResponse>(`${this.API_URL}/refresh_token`);
  }
}