import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor(private router: Router, private httpClient: HttpClient) {}

  getConversation(sender: string, page: number): Observable<any> {
    return this.httpClient.get(
      `${environment.apiUrl}/message/conv?sender=${sender}&page=${page}`,
      httpOptions
    );
  }
}
