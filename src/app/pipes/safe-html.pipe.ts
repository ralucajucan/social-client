import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any, name?: any): any {
    const objectURL = 'data:image/jpeg;base64,' + value;

    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }
}
