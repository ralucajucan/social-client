import { Pipe, PipeTransform } from '@angular/core';

enum TranslateEnum {
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
  firstName = 'Prenume',
  lastName = 'Nume',
  birthDate = 'Data nașterii',
  email = 'Email',
  password = 'Parolă',
  biography = 'Biografie',
}

@Pipe({
  name: 'translateRo',
})
export class TranslateRoPipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) return '';
    const eng: string = value.split(' ')[0];
    const ro: string = TranslateEnum[eng as keyof typeof TranslateEnum];
    return value.replace(eng, ro);
  }
}
