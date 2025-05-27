import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';
import { AuthenticationService } from '../../../shared/services/identity/authentication.service';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { RefreshRequest } from '../../../models/requests/identity/refresh.request';
import { AuthenticationResponse } from '../../../models/responses/identity/authentication.response';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenRefreshService implements OnDestroy {
  private refreshTokenSubscription: Subscription | null = null;
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private authService: AuthenticationService,
    private localStorageService: LocalStorageService
  ) {}

  startRefreshTokenTimer(): void {
    const refreshToken = this.localStorageService.getRefreshToken();
    if (!refreshToken) return;

    // Lấy thời gian hết hạn của access token
    const accessToken = this.localStorageService.getAccessToken();
    if (!accessToken) return;

    try {
      // Giải mã JWT để lấy thời gian hết hạn
      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
      const expiresIn = tokenPayload.exp * 1000 - Date.now();
      
      // Refresh token trước khi hết hạn 5 phút
      const refreshTime = expiresIn - 5 * 60 * 1000;
      
      if (refreshTime > 0) {
        this.refreshTokenSubscription = timer(refreshTime).subscribe(() => {
          this.refreshToken();
        });
      }
    } catch (error) {
      console.error('Error parsing token:', error);
    }
  }

  private refreshToken(): void {
    if (this.isRefreshing) return;

    this.isRefreshing = true;
    const refreshToken = this.localStorageService.getRefreshToken();
    
    if (!refreshToken) {
      this.isRefreshing = false;
      return;
    }

    const request: RefreshRequest = { token: refreshToken };

    this.authService.refresh(request).pipe(
      tap({
        next: (response: AuthenticationResponse) => {
          if (response.authenticated) {
            this.localStorageService.setAccessToken(response.accessToken);
            this.localStorageService.setRefreshToken(response.refreshToken);
            this.refreshTokenSubject.next(true);
            // Bắt đầu timer mới cho token mới
            this.startRefreshTokenTimer();
          }
        },
        error: (error) => {
          console.error('Error refreshing token:', error);
          this.refreshTokenSubject.next(false);
        },
        complete: () => {
          this.isRefreshing = false;
        }
      })
    ).subscribe();
  }

  stopRefreshTokenTimer(): void {
    if (this.refreshTokenSubscription) {
      this.refreshTokenSubscription.unsubscribe();
      this.refreshTokenSubscription = null;
    }
  }

  getRefreshTokenStatus(): Observable<boolean> {
    return this.refreshTokenSubject.asObservable();
  }

  ngOnDestroy(): void {
    this.stopRefreshTokenTimer();
  }
} 