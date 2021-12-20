import { Injectable } from '@angular/core';
import { RxStompService, StompHeaders } from '@stomp/ng2-stompjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor(private rxStompService: RxStompService) {}

  logout(): void {
    this.rxStompService.deactivate();
    window.sessionStorage.clear();
  }

  public saveJWT(token: string): void {
    window.sessionStorage.removeItem(environment.JWT_KEY);
    window.sessionStorage.setItem(environment.JWT_KEY, token);
    // this.rxStompService.publish({
    //   destination: '/api/refresh-connected',
    //   body: undefined,
    // });
    this.rxStompService.activate();
    this.rxStompService.serverHeaders$.pipe(
      tap(async (headers: StompHeaders) => {
        if (!headers.hasOwnProperty('user-name')) {
          this.rxStompService.stompClient.forceDisconnect();
        }
      })
    );
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
