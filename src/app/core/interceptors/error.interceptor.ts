import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
        notificationService.error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else if (error.status === 403) {
        notificationService.error('Anda tidak memiliki akses ke resource ini.');
        router.navigate(['/']);
      } else if (error.status === 404) {
        notificationService.error('Resource tidak ditemukan.');
      } else if (error.status === 500) {
        notificationService.error('Terjadi kesalahan pada server. Silakan coba lagi.');
      } else if (error.error?.message) {
        notificationService.error(error.error.message);
      }

      return throwError(() => error);
    })
  );
};