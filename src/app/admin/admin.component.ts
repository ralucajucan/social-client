import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { catchError, first, take, tap } from 'rxjs/operators';
import { SnackbarService } from '../snackbar.service';
import { IFullUser } from './admin.model';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {
  readonly pageSizes: number[] = [5, 10, 25, 50, 100];
  selectedCount: number = this.pageSizes[0];
  currentPage: number = 0;
  clickedUser: IFullUser | null = null;
  maxPage: number = -1; // unknown value at start
  usersPageSubscription: Subscription;
  usersPage: IFullUser[] = [];
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

  constructor(
    private adminService: AdminService,
    private snackbarService: SnackbarService
  ) {
    this.usersPageSubscription = this.adminService
      .getUserPage({ page: this.currentPage, count: this.selectedCount })
      .pipe(first())
      .subscribe(
        (users) => (this.usersPage = users),
        (error) => this.snackbarService.error(error.error)
      );
  }

  ngOnInit() {}
  ngOnDestroy(): void {
    this.usersPageSubscription?.unsubscribe();
  }

  decrementPage() {
    this.usersPageSubscription = this.adminService
      .getUserPage({ page: this.currentPage - 1, count: this.selectedCount })
      .pipe(first())
      .subscribe(
        (users) => {
          this.currentPage--;
          if (users.length <= this.selectedCount) {
            this.maxPage = this.currentPage;
          }
          return (this.usersPage = users);
        },
        (error) => this.snackbarService.error(error.error)
      );
  }

  incrementPage() {
    this.usersPageSubscription = this.adminService
      .getUserPage({ page: this.currentPage + 1, count: this.selectedCount })
      .pipe(first())
      .subscribe(
        (users) => {
          if (users.length == 0) {
            this.maxPage = this.currentPage;
            return;
          }
          this.currentPage++;
          if (users.length <= this.selectedCount) {
            this.maxPage = this.currentPage;
          }
          return (this.usersPage = users);
        },
        (error) => this.snackbarService.error(error.error)
      );
  }

  changeCount(count: number) {
    this.usersPageSubscription = this.adminService
      .getUserPage({ page: 0, count: count })
      .pipe(first())
      .subscribe(
        (users) => {
          this.currentPage = 0;
          if (users.length == 0) {
            this.maxPage = this.currentPage;
            return;
          }
          if (users.length <= this.selectedCount) {
            this.maxPage = this.currentPage;
          }
          return (this.usersPage = users);
        },
        (error) => this.snackbarService.error(error.error)
      );
  }

  selectUser(row: IFullUser) {
    this.clickedUser = row;
  }
}
