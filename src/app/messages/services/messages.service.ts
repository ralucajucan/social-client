import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IMessage, RemoveAttachment, SendDTO } from '../models/messages.model';
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

  upload(file: File, toEmail: string): Observable<Upload> {
    const data = new FormData();
    data.append('file', file);
    data.append('toEmail', toEmail);
    return this.httpClient
      .post(`${environment.apiUrl}/message/upload`, data, {
        reportProgress: true,
        observe: 'events',
        responseType: 'text',
      })
      .pipe(upload());
  }
  download(id: string, filename: string): Observable<any> {
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

  removeAttachment(
    id: string,
    messageId?: number
  ): Observable<RemoveAttachment> {
    return this.httpClient
      .delete(`${environment.apiUrl}/message/attachment`, {
        params: new HttpParams().set('id', id),
      })
      .pipe(
        map(() => ({
          attachmentId: id,
          messageId: messageId,
        }))
      );
  }

  editMessage(message: SendDTO, id: number): Observable<IMessage> {
    return this.httpClient.post<IMessage>(
      `${environment.apiUrl}/message/edit`,
      message,
      { params: new HttpParams().set('id', id) }
    );
  }

  removeMessage(email: string, id: number): Observable<IMessage> {
    return this.httpClient.delete<IMessage>(`${environment.apiUrl}/message`, {
      params: new HttpParams().set('id', id).append('contactEmail', email),
    });
  }
}
