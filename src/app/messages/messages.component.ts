import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { RxStompService } from '@stomp/ng2-stompjs';
import { RxStompState } from '@stomp/rx-stomp';
import { Observable, pipe, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  take,
  takeWhile,
  tap,
} from 'rxjs/operators';
import { AppState } from '../store/app.state';
import { IContact, IMessage, SendDTO } from './models/messages.model';
import { MessagesService } from './services/messages.service';
import { Download } from './utils/download';
import { Upload } from './utils/upload';
import * as WsActions from 'src/app/store/actions/ws.actions';

const MEDIUMBLOB_SIZE = 16777215; // storage size chosen in MySQL

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, OnDestroy {
  messageForm = this.formBuilder.group({
    text: ['', [Validators.maxLength(MEDIUMBLOB_SIZE - 1)]],
    bold: false,
    italic: false,
    strikethrough: false,
    file: null,
    attachmentIds: '',
  });
  get text() {
    return this.messageForm.get('text')?.value;
  }

  get file() {
    return this.messageForm.get('file')?.value;
  }

  set file(_file: File | null) {
    this.messageForm.patchValue({ file: _file });
  }

  get attachmentIds() {
    return this.messageForm.get('attachmentIds')?.value;
  }

  set attachmentIds(ids: string) {
    this.messageForm.patchValue({ attachmentIds: ids });
  }

  public textControl = new FormControl();
  public search: string = '';
  public searchTextSubscription: Subscription = new Subscription();
  public unfilteredUsers: IContact[] = [];
  public users: IContact[] = [];
  public usersSubscription: Subscription;
  public selected$: Observable<IContact>;
  public received$: Observable<IMessage[]>;
  public endOfMessages$: Observable<boolean>;
  public connectionStatus$: Observable<string>;
  public upload: Upload | null = null;
  public download: Download | null = null;
  public download$: Observable<Download> | null = null;
  public selectedToDownload: number = -1;
  private uploadSubscription: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private rxStompService: RxStompService,
    private messagesService: MessagesService,
    private store: Store<AppState>
  ) {
    this.connectionStatus$ = rxStompService.connectionState$.pipe(
      map((state) => {
        return RxStompState[state];
      })
    );
    this.searchTextSubscription = this.textControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        map((value) => value.trim().toLowerCase()),
        distinctUntilChanged(),
        tap((value) => {
          this.users = this.unfilteredUsers.filter((user) => {
            return user.name.concat(user.email).toLowerCase().includes(value);
          });
          this.search = value;
        })
      )
      .subscribe();
    this.usersSubscription = this.store
      .pipe(
        select((state) => state.ws.users),
        tap((users) => {
          this.unfilteredUsers = users;
          this.users = users.filter((user) =>
            user.name.concat(user.email).toLowerCase().includes(this.search)
          );
        })
      )
      .subscribe();

    this.selected$ = this.store.pipe(select((state) => state.ws.selected));
    this.received$ = this.store.pipe(select((state) => state.ws.received));
    this.endOfMessages$ = this.store.pipe(
      select((state) => state.ws.endOfMessages)
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.uploadSubscription?.unsubscribe();
    this.searchTextSubscription?.unsubscribe();
    //TODO: make call to service to delete file if not sent
  }

  onFileInput(files: FileList | null): void {
    if (files) {
      this.file = files.item(0);
      if (this.file) {
        this.uploadSubscription = this.messagesService
          .upload(this.file)
          .subscribe(
            (data: Upload) => {
              this.upload = data;
              if (data.state == 'DONE' && data.id.length) {
                this.attachmentIds += this.attachmentIds.length
                  ? ','.concat(data.id)
                  : data.id;
              }
            },
            (error) => {
              console.log(error);
            }
          );
      }
    }
  }
  remove() {}

  onSendMessage(event: Event) {
    console.log(event);
    event.stopPropagation();
    if (!this.text.length && !this.attachmentIds.length) return;
    let message: SendDTO = {
      text: this.text,
      user: '',
      attachmentIds: this.attachmentIds,
    };
    const sub = this.selected$
      .pipe(take(1))
      .subscribe((selected) => (message.user = selected.email));
    sub.unsubscribe();
    this.store.dispatch(WsActions.sendMessage({ message }));

    this.messageForm.reset({
      text: '',
      bold: false,
      italic: false,
      strikethrough: false,
      file: null,
      attachmentIds: '',
    });
    this.upload = null;
  }

  selectUser(user: IContact) {
    this.store.dispatch(WsActions.select({ selection: user }));
  }

  loadMore() {
    this.store.dispatch(WsActions.loadNextPageStart());
  }

  downloadStart(id: string, filename: string, i: number) {
    const downloadSubscription = this.messagesService
      .download(id, filename)
      .pipe(takeWhile((value) => value.state !== 'DONE'))
      .subscribe((data) => (this.download = data));
    downloadSubscription.unsubscribe;
    this.selectedToDownload = i;
  }

  removeMessage(message: IMessage) {}

  editMessage(message: IMessage) {}
}
