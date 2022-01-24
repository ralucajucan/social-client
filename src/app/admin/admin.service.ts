import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IFullUser, IPageRequest } from './admin.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private httpClient: HttpClient) {}

  getUserPage(request: IPageRequest): Observable<IFullUser[]> {
    return this.httpClient.get<IFullUser[]>(`${environment.apiUrl}/user`, {
      ...httpOptions,
      params: new HttpParams()
        .set('page', request.page)
        .append('count', request.count),
    });
  }
}
