import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { userPageLoadStart } from '../store/actions/user.actions';
import { AppState } from '../store/app.state';
import { IFullUser } from './admin.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  clickedUser: IFullUser | null = null;
  displayedColumns: string[] = [
    'id',
    'avatar',
    'email',
    'createdAt',
    'updatedAt',
    'enabled',
    'locked',
    'firstName',
    'lastName',
    'birthDate',
  ];
  users$: Observable<IFullUser[]>;
  totalPages$: Observable<number>;
  totalElements$: Observable<number>;
  pageEvent: PageEvent = new PageEvent();

  constructor(private store: Store<AppState>) {
    this.store.dispatch(
      userPageLoadStart({
        request: { page: 0, count: 10 },
      })
    );
    this.users$ = this.store.pipe(select((state) => state.userPage.users));
    this.totalPages$ = this.store.pipe(
      select((state) => state.userPage.totalPages)
    );
    this.totalElements$ = this.store.pipe(
      select((state) => state.userPage.totalElements)
    );
  }

  getPage(pageEvent: PageEvent) {
    this.store.dispatch(
      userPageLoadStart({
        request: { page: pageEvent.pageIndex, count: pageEvent.pageSize },
      })
    );
  }

  selectUser(row: IFullUser) {
    this.clickedUser = row;
  }
}
