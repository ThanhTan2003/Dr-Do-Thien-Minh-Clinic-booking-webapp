import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../core/services/http.service';
import { AuthenticationResponse } from '../../../models/responses/identity/authentication.response';
import { AuthenticationRequest } from '../../../models/requests/identity/authentication.request';
import { RefreshRequest } from '../../../models/requests/identity/refresh.request';
import { LogOutRequest } from '../../../models/requests/identity/logout.request';
import { IntrospectRequest } from '../../../models/requests/identity/introspect.request';
import { IntrospectResponse } from '../../../models/responses/identity/introspect.response';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly API_URL = '/api/v1/identity/auth';

  constructor(private http: HttpService) {}

  /**
   * Đăng nhập tài khoản (Admin/User)
   */
  login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.API_URL}/log-in`, request);
  }

  /**
   * Đăng nhập tài khoản khách hàng
   */
  loginCustomer(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.API_URL}/customer/log-in`, request);
  }

  /**
   * Gửi yêu cầu introspect token
   */
  introspect(request: IntrospectRequest): Observable<IntrospectResponse> {
    return this.http.post<IntrospectResponse>(`${this.API_URL}/introspect`, request);
  }

  /**
   * Đăng xuất
   */
  logout(request: LogOutRequest): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/log-out`, request);
  }

  /**
   * Refresh token (Admin/User)
   */
  refreshToken(request: RefreshRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.API_URL}/refresh`, request);
  }

  /**
   * Refresh token cho khách hàng
   */
  customerRefresh(request: RefreshRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.API_URL}/customer/refresh`, request);
  }
}
