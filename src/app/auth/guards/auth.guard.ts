import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AppState, AuthState } from 'src/app/store/app.state';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  admin: boolean = false;
  isAdmin$: Observable<boolean>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private store: Store<AppState>
  ) {
    this.isAdmin$ = this.store.pipe(
      select((state) => state.auth.role === 'ADMIN')
    );
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.getJWT() && this.authService.getRefresh()) {
      if (route.url[0].path === 'admin') {
        const roleSub = this.isAdmin$
          .pipe(
            take(1),
            tap((isAdmin) => {
              this.admin = isAdmin;
            })
          )
          .subscribe();
        roleSub?.unsubscribe();
        if (!this.admin) {
          this.router.navigate(['/messages']);
          return false;
        }
      }
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
