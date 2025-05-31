import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take, finalize } from 'rxjs/operators';
import { AuthService } from '../features/admin/auth/services/auth.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../core/services/local-storage.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private pendingRequests: number = 0; // Đếm số lượng request đang chờ

  constructor(
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private toastr: ToastrService
  ) {
    console.log('[AuthInterceptor] Đã khởi tạo (constructor)');
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.pendingRequests++; // Tăng số lượng request đang xử lý
    const logPrefix = `[AuthInterceptor] [${new Date().toISOString()}]`;
    console.log(`${logPrefix} Xử lý request: ${req.url}`);

    if (req.url.includes('/public') || req.url.includes('/log-in')) {
      return next.handle(req).pipe(
        finalize(() => this.pendingRequests--) // Giảm số lượng request khi hoàn thành
      );
    }

    const accessToken = this.localStorageService.getAccessToken();
    let authReq = req;
    if (accessToken) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !req.url.includes('/refresh-token')) {
          console.log(`${logPrefix} Gặp lỗi 401, thử refresh token`);
          return this.handle401Error(authReq, next, logPrefix);
        }
        console.error(`${logPrefix} Lỗi API:`, error);
        return throwError(() => error);
      }),
      finalize(() => this.pendingRequests--) // Giảm số lượng request khi hoàn thành
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler, logPrefix: string): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response) => {
          console.log(`${logPrefix} Refresh token thành công`);
          this.isRefreshing = false;
          const newAccessToken = this.localStorageService.getAccessToken();
          this.refreshTokenSubject.next(newAccessToken);
          return next.handle(req.clone({
            setHeaders: { Authorization: `Bearer ${newAccessToken}` }
          }));
        }),
        catchError((refreshError) => {
          console.error(`${logPrefix} Refresh token thất bại:`, refreshError);
          this.isRefreshing = false;
          this.refreshTokenSubject.next(null);

          // Hiển thị thông báo và trì hoãn chuyển hướng
          this.toastr.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 'Hết phiên');
          return this.delayNavigation(refreshError, logPrefix);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap((newToken) => {
          return next.handle(req.clone({
            setHeaders: { Authorization: `Bearer ${newToken}` }
          }));
        }),
        catchError((error) => {
          // Nếu request thử lại vẫn thất bại, không gọi refresh token nữa
          console.error(`${logPrefix} Thử lại thất bại sau refresh token:`, error);
          return throwError(() => error);
        })
      );
    }
  }

  private delayNavigation(refreshError: any, logPrefix: string): Observable<never> {
    // Đợi các request khác hoàn thành hoặc sau 2 giây
    const waitTime = 2000;
    const checkPendingRequests = () => new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (this.pendingRequests <= 0) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
      setTimeout(() => {
        clearInterval(interval);
        resolve();
      }, waitTime);
    });

    return new Observable<never>((observer) => {
      checkPendingRequests().then(() => {
        const url = window.location.pathname;
        if (refreshError.status === 401 || refreshError.status === 400) {
          if (url.startsWith('/admin')) {
            console.log(`${logPrefix} Chuyển hướng về /admin/login`);
            this.router.navigate(['/admin/login']);
          } else if (url.startsWith('/booking')) {
            console.log(`${logPrefix} Chuyển hướng về /booking/login`);
            this.router.navigate(['/booking/login']);
          }
        }
        observer.error(refreshError);
      });
    });
  }
}