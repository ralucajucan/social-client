import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  ILogin,
  ILoginResponse,
  IRegister,
  IUser,
  JWTResponse,
} from '../models/auth.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SessionService } from './session.service';
import { SnackbarService } from 'src/app/snackbar.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private snackbarService: SnackbarService,
    private router: Router,
    private httpClient: HttpClient,
    private sessionService: SessionService
  ) {}

  login(loginData: ILogin): Observable<ILoginResponse> {
    return this.httpClient
      .post<ILoginResponse>(
        `${environment.apiUrl}/auth`,
        loginData,
        httpOptions
      )
      .pipe(
        tap(({ jwtToken, refreshToken, ...user }) => {
          this.sessionService.saveJWT(jwtToken);
          this.sessionService.saveRefresh(refreshToken);
        })
      );
  }

  logout(error?: any): void {
    this.sessionService.logout();
    this.router.navigate(['/login']);
    if (error) {
      this.snackbarService.warn(error.error);
    }
  }

  register(registerData: IRegister): Observable<IRegister> {
    return this.httpClient.post<IRegister>(
      `${environment.apiUrl}/auth/register`,
      registerData,
      httpOptions
    );
  }

  refreshToken(refreshToken: string): Observable<JWTResponse> {
    return this.httpClient.get<JWTResponse>(
      `${environment.apiUrl}/auth/refresh`,
      {
        ...httpOptions,
        params: new HttpParams().set('token', refreshToken),
      }
    );
  }
}
