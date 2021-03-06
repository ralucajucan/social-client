import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IAuth, IJwt, ILogin, IRegister, IUser } from '../models/auth.model';
import { environment } from 'src/environments/environment';
import { RxStompService, StompHeaders } from '@stomp/ng2-stompjs';
import { myRxStompConfig } from 'src/app/my-rx-stomp.config';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private rxStompService: RxStompService
  ) {}

  login(loginData: ILogin): Observable<IUser> {
    return this.httpClient
      .post<IAuth>(`${environment.apiUrl}/auth`, loginData, httpOptions)
      .pipe(
        map(({ jwtToken, refreshToken, ...user }) => {
          this.saveJWT(jwtToken);
          this.saveRefresh(refreshToken);
          return user;
        })
      );
  }

  logout(): void {
    this.rxStompService.deactivate();
    window.sessionStorage.clear();
  }

  register(registerData: IRegister): Observable<IRegister> {
    return this.httpClient.post<IRegister>(
      `${environment.apiUrl}/auth/register`,
      registerData,
      httpOptions
    );
  }

  saveJWT(token: string) {
    window.sessionStorage.removeItem(environment.JWT_KEY);
    window.sessionStorage.setItem(environment.JWT_KEY, token);
    this.rxStompService.configure(myRxStompConfig);
    this.rxStompService.activate();
  }

  getJWT(): string | null {
    return window.sessionStorage.getItem(environment.JWT_KEY);
  }

  public saveRefresh(token: string): void {
    window.sessionStorage.removeItem(environment.REFRESH_KEY);
    window.sessionStorage.setItem(environment.REFRESH_KEY, token);
  }

  getRefresh(): string | undefined {
    return window.sessionStorage.getItem(environment.REFRESH_KEY) || undefined;
  }

  refreshToken(refreshToken?: string): Observable<IJwt> {
    if (!refreshToken) {
      refreshToken = this.getRefresh();
    }
    return this.httpClient.get<IJwt>(`${environment.apiUrl}/auth/refresh`, {
      params: new HttpParams().set('token', refreshToken || ''),
    });
  }

  requestEmail(email: string): Observable<any> {
    return this.httpClient
      .get(`${environment.apiUrl}/auth/register/reset`, {
        ...httpOptions,
        params: new HttpParams().set('email', email || ''),
      })
      .pipe(map((value) => !!value));
  }

  requestPassword(email: string): Observable<any> {
    return this.httpClient
      .get(`${environment.apiUrl}/auth/reset-password`, {
        ...httpOptions,
        params: new HttpParams().set('email', email || ''),
      })
      .pipe(map((value) => !!value));
  }

  activateFromEmail(token: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/auth/register/confirm`, {
      responseType: 'text',
      params: new HttpParams().set('token', token || ''),
    });
  }
}
