import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const JWT_KEY = 'auth-jwt';
const REFRESH_KEY = 'auth-refresh';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor() {}

  logout(): void {
    window.sessionStorage.clear();
  }

  public saveJWT(token: string): void {
    window.sessionStorage.removeItem(JWT_KEY);
    window.sessionStorage.setItem(JWT_KEY, token);
  }

  public getJWT(): string | null {
    return window.sessionStorage.getItem(JWT_KEY);
  }

  public saveRefresh(token: string): void {
    window.sessionStorage.removeItem(REFRESH_KEY);
    window.sessionStorage.setItem(REFRESH_KEY, token);
  }

  public getRefresh(): string | null {
    return window.sessionStorage.getItem(REFRESH_KEY);
  }
}
