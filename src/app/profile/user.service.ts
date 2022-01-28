import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IPageRequest, IFullUser } from '../admin/admin.model';
import {
  INewPassword,
  IEditSelected,
  IEditResponse,
} from '../auth/models/auth.model';
import { UserPageState } from '../store/app.state';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  getUserPage(request: IPageRequest): Observable<UserPageState> {
    return this.httpClient.get<UserPageState>(`${environment.apiUrl}/user`, {
      ...httpOptions,
      params: new HttpParams()
        .set('page', request.page)
        .append('count', request.count),
    });
  }

  changePassword(request: INewPassword, id: number) {
    return this.httpClient.post(
      `${environment.apiUrl}/user/password`,
      { ...request, id },
      httpOptions
    );
  }

  changeSelected(
    request: IEditSelected,
    id: number
  ): Observable<IEditResponse> {
    const response: IEditResponse = {
      selected: request.selected,
      change: request.change,
      id: id,
    };
    return this.httpClient
      .post(`${environment.apiUrl}/user/edit`, { ...request, id }, httpOptions)
      .pipe(map((value) => response));
  }
}
