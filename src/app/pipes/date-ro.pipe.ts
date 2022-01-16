import { Pipe, PipeTransform } from '@angular/core';

enum monthsTranslate {
  January = 'Ianuarie',
  February = 'Februarie',
  March = 'Martie',
  April = 'Aprilie',
  May = 'Mai',
  June = 'Iunie',
  July = 'Iulie',
  August = 'August',
  September = 'Septembrie',
  October = 'Octombrie',
  November = 'Noiembrie',
  December = 'Decembrie',
}

@Pipe({
  name: 'dateRo',
})
export class DateRoPipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) return '';
    const month: string = value.split(' ')[0];
    const monthRo: string =
      monthsTranslate[month as keyof typeof monthsTranslate];
    return value.replace(month, monthRo);
  }
}
