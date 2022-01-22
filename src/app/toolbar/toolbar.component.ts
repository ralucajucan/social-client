import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { INotification } from '../messages/models/messages.model';
import { logout } from '../store/actions/auth.actions';
import { clearNotifications } from '../store/actions/ws.actions';
import { AppState } from '../store/app.state';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  name$: Observable<string>;
  notification$: Observable<INotification[]>;
  isAdmin$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private router: Router
  ) {
    this.name$ =
      this.store.pipe(
        select((state) => state.auth.firstName + ' ' + state.auth.lastName)
      ) || '';
    this.notification$ =
      this.store.pipe(select((state) => state.ws.notification)) || '';
    this.isAdmin$ = this.store.pipe(
      select((state) => state.auth.role === 'ADMIN')
    );
  }

  ngOnInit() {}

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.store.dispatch(logout());
  }

  goToMessage(notification: INotification) {}

  clearNotifications() {
    this.store.dispatch(clearNotifications());
  }
}
