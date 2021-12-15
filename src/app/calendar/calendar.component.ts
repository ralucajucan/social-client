import { Component, Output, EventEmitter } from '@angular/core';
const DAY_MS = 60 * 60 * 24 * 1000;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  dates: Array<Date>;
  months = [
    'Ianuarie',
    'Februarie',
    'Martie',
    'Aprilie',
    'Mai',
    'Iunie',
    'Iulie',
    'August',
    'Septembrie',
    'Octombrie',
    'Noiembrie',
    'Decembrie',
  ];
  days = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri ', 'Sâmbătă', 'Duminică'];
  date = new Date();
  @Output() selected = new EventEmitter();

  constructor() {
    this.dates = this.getCalendarDays(this.date);
  }

  getAllDays() {
    const calStartTime = this.getCalendarStartDay(this.date).getTime();
    return this.range(0, 41).map(
      (num) => new Date(calStartTime + DAY_MS * num)
    );
  }

  setMonth(inc: number) {
    const [year, month] = [this.date.getFullYear(), this.date.getMonth()];
    this.date = new Date(year, month + inc, 1);
    this.dates = this.getCalendarDays(this.date);
  }

  isSameMonth(date: Date) {
    return date.getMonth() === this.date.getMonth();
  }

  private getCalendarStartDay(date: Date): Date {
    const [year, month] = [date.getFullYear(), date.getMonth()];
    const firstDayOfMonth = new Date(year, month, 1).getTime();
    const firstDayOfCalendar = this.range(1, 7)
      .map((num) => new Date(firstDayOfMonth - DAY_MS * num))
      .find((dt) => dt.getDay() === 1);
    return firstDayOfCalendar || date;
  }

  private getCalendarDays(date: Date) {
    const calendarStartTime = this.getCalendarStartDay(date).getTime();

    return this.range(0, 41).map(
      (num) => new Date(calendarStartTime + DAY_MS * num)
    );
  }

  private range(start: number, end: number, length = end - start + 1) {
    return Array.from({ length }, (_, i) => start + i);
  }
}
