import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { logout } from '../store/actions/auth.actions';
import { AppState } from '../store/app.state';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  name: Observable<string>;
  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private router: Router
  ) {
    this.name =
      this.store.pipe(
        select((state) => state.auth.firstName + ' ' + state.auth.lastName)
      ) || '';
  }

  ngOnInit() {}

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.store.dispatch(logout());
  }
}
