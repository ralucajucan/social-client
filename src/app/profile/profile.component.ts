import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../store/app.state';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  email: Observable<string>;
  firstName: Observable<string>;
  lastName: Observable<string>;
  birthDate: Observable<string>;
  biography: Observable<string>;

  constructor(private store: Store<AppState>) {
    this.email = this.store.pipe(select((state) => state.auth.email)) || '';
    this.firstName =
      this.store.pipe(select((state) => state.auth.firstName)) || '';
    this.lastName =
      this.store.pipe(select((state) => state.auth.lastName)) || '';
    this.birthDate =
      this.store.pipe(select((state) => state.auth.birthDate)) || '';
    this.biography =
      this.store.pipe(select((state) => state.auth.biography)) || '';
  }

  ngOnInit() {}
}
