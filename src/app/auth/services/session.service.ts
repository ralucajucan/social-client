import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor() {}

  logout(): void {
    window.sessionStorage.clear();
  }

  public saveJWT(token: string): void {
    window.sessionStorage.removeItem(environment.JWT_KEY);
    window.sessionStorage.setItem(environment.JWT_KEY, token);
  }

  public getJWT(): string | null {
    return window.sessionStorage.getItem(environment.JWT_KEY);
  }

  public saveRefresh(token: string): void {
    window.sessionStorage.removeItem(environment.REFRESH_KEY);
    window.sessionStorage.setItem(environment.REFRESH_KEY, token);
  }

  public getRefresh(): string | null {
    return window.sessionStorage.getItem(environment.REFRESH_KEY);
  }
}
