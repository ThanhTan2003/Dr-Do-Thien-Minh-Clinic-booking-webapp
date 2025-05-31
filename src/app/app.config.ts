import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { AuthInterceptor } from './interceptor/interceptor';

console.log('[app.config.ts] Đang đăng ký AuthInterceptor');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-top-center', // top-center
      timeOut: 5000, // autoClose={5000}
      progressBar: true, // hideProgressBar={false}
      newestOnTop: false, // newestOnTop={false}
      tapToDismiss: false, // closeOnClick={false}
      closeButton: true, // Hiển thị nút đóng
      enableHtml: true, // Cho phép HTML
      toastClass: 'ngx-toastr colored-toast', // Tùy chỉnh giao diện
    }),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    
  ]
};
