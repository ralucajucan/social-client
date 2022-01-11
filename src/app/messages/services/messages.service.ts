import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { download } from '../utils/download';
import { upload, Upload } from '../utils/upload';

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

  getConversation(user: string, page: number): Observable<any> {
    return this.httpClient.get(
      `${environment.apiUrl}/message/conv?user=${user}&page=${page}`,
      httpOptions
    );
  }

  upload(file: File): Observable<Upload> {
    const data = new FormData();
    data.append('file', file);
    return this.httpClient
      .post(`${environment.apiUrl}/message/upload`, data, {
        reportProgress: true,
        observe: 'events',
        responseType: 'text',
      })
      .pipe(upload());
  }
  download(id: string, filename: string): Observable<any> {
    console.log(id);
    return this.httpClient
      .get(`${environment.apiUrl}/message/download/${id}`, {
        reportProgress: true,
        observe: 'events',
        responseType: 'blob',
      })
      .pipe(
        download((blob) => {
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(blob);
          a.href = objectUrl;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(objectUrl);
        })
      );
  }
}
