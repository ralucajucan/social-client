import { Pipe, PipeTransform } from '@angular/core';
import { IContact } from '../models/messages.model';

@Pipe({ name: 'emailBase' })
export class EmailBase implements PipeTransform {
  transform(email: string, users: IContact[]): string {
    return users.filter((user) => user.email === email).pop()?.name || '';
  }
}
