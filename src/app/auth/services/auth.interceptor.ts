import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const jwt = this.authService.getJWT();
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    const isRefreshUrl = request.url.startsWith(
      `${environment.apiUrl}/auth/refresh`
    );
    const isRegisterUrl = request.url.startsWith(
      `${environment.apiUrl}/auth/register`
    );
    if (jwt && isApiUrl && !isRefreshUrl && !isRegisterUrl) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${jwt}` },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (!request.url.includes('/auth') && error.status === 401)
          return this.handleError(request, next);
        return throwError(error);
      })
    );
  }
  private handleError(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.authService.getRefresh();

      if (refreshToken)
        return this.authService.refreshToken(refreshToken).pipe(
          switchMap((response) => {
            this.isRefreshing = false;

            this.authService.saveJWT(response.jwtToken);
            this.refreshTokenSubject.next(response.jwtToken);

            return next.handle(
              request.clone({
                setHeaders: { Authorization: `Bearer ${response.jwtToken}` },
              })
            );
          }),
          catchError((error) => {
            this.isRefreshing = false;
            this.authService.logout();
            return throwError(error);
          })
        );
    }
    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => {
        return next.handle(
          request.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          })
        );
      })
    );
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
