import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IBasicUser } from '../auth/models/auth.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  users: IBasicUser[] = [];

  constructor(private httpClient: HttpClient) {}

  getUsers(): Observable<IBasicUser[]> {
    return this.users.length
      ? of(this.users)
      : this.httpClient.get<IBasicUser[]>(`${environment.apiUrl}/user`, {
          ...httpOptions,
        });
  }
}
