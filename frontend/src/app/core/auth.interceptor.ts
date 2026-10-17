import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { API_URL } from './api.config';
import { AuthService } from './auth.service';

/** Anexa o Bearer token e trata 401/403/5xx globalmente. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const snack = inject(MatSnackBar);
  const token = auth.token();

  const requisicao = token && req.url.startsWith(API_URL)
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(requisicao).pipe(
    catchError((err: HttpErrorResponse) => {
      const ehRotaDeAuth = req.url.includes('/auth/');
      if (err.status === 401 && !ehRotaDeAuth) {
        snack.open('Sessão expirada. Faça login novamente.', 'OK', { duration: 4000 });
        auth.logout();
      } else if (err.status === 403) {
        snack.open('Você não tem permissão para essa ação.', 'OK', { duration: 4000 });
      } else if (err.status >= 500 || err.status === 0) {
        snack.open('Erro no servidor. Tente novamente em instantes.', 'OK', { duration: 4000 });
      }
      return throwError(() => err);
    }),
  );
};
