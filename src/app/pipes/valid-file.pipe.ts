import { Pipe, PipeTransform } from '@angular/core';
import { IFile } from '../messages/models/messages.model';

@Pipe({
  name: 'validFile',
})
export class ValidFilePipe implements PipeTransform {
  transform(file: IFile, type?: string): boolean {
    if (type === 'image') {
      return file.file && !!file.name.match(/.(jpg|jpeg|png|gif)$/i);
    }

    return !!file.file;
  }
}
