import { APP_INITIALIZER } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';

export function appInitializer(
  authService: AuthService,
  sessionService: SessionService
) {
  return () => {
    const refreshToken = sessionService.getRefresh();
    if (refreshToken)
      authService.refreshToken(refreshToken).subscribe(
        (response) => {
          sessionService.saveJWT(response.token);
        },
        (error) => authService.logout(error)
      );
  };
}

export const appInitializerProviders = {
  provide: APP_INITIALIZER,
  useFactory: appInitializer,
  multi: true,
  deps: [AuthService, SessionService],
};
