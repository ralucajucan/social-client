import { Pipe, PipeTransform } from '@angular/core';
import { IContact } from '../messages/models/messages.model';

@Pipe({ name: 'emailBase' })
export class EmailBasePipe implements PipeTransform {
  transform(email: string, users: IContact[] | null): string {
    if (!users) return '';
    return users.filter((user) => user.email === email).pop()?.name || '';
  }
}
