import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { fromEvent, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { IContact } from '../../models/messages.model';

@Component({
  selector: 'app-messages-sidenav',
  templateUrl: './messages-sidenav.component.html',
  styleUrls: ['./messages-sidenav.component.scss'],
})
export class MessagesSidenavComponent implements OnInit {
  textControl = new FormControl();
  searchText$: Observable<string>;

  @Input() isConnected: boolean = false;
  @Input() users: IContact[] | null = [];
  @Output() onSelect = new EventEmitter<IContact>();
  @Output() onSearch = new EventEmitter<string>();

  constructor(private formBuilder: FormBuilder) {
    this.searchText$ = this.textControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      tap((value) => this.onSearch.emit(value))
    );
  }

  ngOnInit() {}

  selectUser(value: IContact) {
    this.onSelect.emit(value);
  }
}
