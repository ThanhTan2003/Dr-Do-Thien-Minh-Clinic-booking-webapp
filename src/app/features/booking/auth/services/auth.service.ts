import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthenticationService } from '../../../shared/services/identity/authentication.service';
import { AuthenticationRequest } from '../../../models/requests/identity/authentication.request';
import { AuthenticationResponse } from '../../../models/responses/identity/authentication.response';
import { LocalStorageService } from '../../../../core/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private localStorageService: LocalStorageService,
  ) {}

  login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.authService.loginCustomer(request).pipe(
      tap(response => {
        if (response.authenticated) {
          this.localStorageService.setAccessToken(response.accessToken);
          this.localStorageService.setRefreshToken(response.refreshToken);
        }
      })
    );
  }

  logout(): void {
    const token = this.localStorageService.getAccessToken();
    if (token) {
      this.authService.logout({ token }).subscribe(() => {
        this.clearAuthData();
        this.router.navigate(['/booking/login']);
      });
    } else {
      this.clearAuthData();
      this.router.navigate(['/booking/login']);
    }
  }

  private clearAuthData(): void {
    this.localStorageService.removeAccessToken();
    this.localStorageService.removeRefreshToken();
  }

  isAuthenticated(): boolean {
    return !!this.localStorageService.getAccessToken();
  }

  refreshToken(): Observable<AuthenticationResponse> {
    const refreshToken = this.localStorageService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token');
    }
    return this.authService.customerRefresh({ token: refreshToken }).pipe(
      tap(response => {
        if (response.authenticated) {
          this.localStorageService.setAccessToken(response.accessToken);
          this.localStorageService.setRefreshToken(response.refreshToken);
        }
      })
    );
  }
} 