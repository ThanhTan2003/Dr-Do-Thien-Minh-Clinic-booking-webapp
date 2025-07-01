// authentication.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationRequest } from '../../../models/requests/identity/authentication.request';
import { IntrospectRequest } from '../../../models/requests/identity/introspect.request';
import { LogOutRequest } from '../../../models/requests/identity/logout.request';
import { RefreshRequest } from '../../../models/requests/identity/refresh.request';
import { AuthenticationResponse } from '../../../models/responses/identity/authentication.response';
import { IntrospectResponse } from '../../../models/responses/identity/introspect.response';
import { HttpService } from '../../../../core/services/http.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    constructor(private http: HttpService) { }

    private readonly API_URL = '/api/v1/identity/auth';

    logIn(request: AuthenticationRequest): Observable<AuthenticationResponse> {
        return this.http.post<AuthenticationResponse>(`${this.API_URL}/log-in`, request);
    }

    loginCustomer(request: AuthenticationRequest): Observable<AuthenticationResponse> {
        return this.http.post<AuthenticationResponse>(`${this.API_URL}/customer/log-in`, request);
    }

    introspect(request: IntrospectRequest): Observable<IntrospectResponse> {
        return this.http.post<IntrospectResponse>(`${this.API_URL}/introspect`, request);
    }

    logOut(request: LogOutRequest): Observable<void> {
        return this.http.post<void>(`${this.API_URL}/log-out`, request);
    }

    refresh(request: RefreshRequest): Observable<AuthenticationResponse> {
        return this.http.post<AuthenticationResponse>(`${this.API_URL}/refresh`, request);
    }

    customerRefresh(request: RefreshRequest): Observable<AuthenticationResponse> {
        return this.http.post<AuthenticationResponse>(`${this.API_URL}/customer/refresh`, request);
    }
}