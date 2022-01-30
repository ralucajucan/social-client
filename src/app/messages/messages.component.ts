import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { RxStompService } from '@stomp/ng2-stompjs';
import { RxStompState } from '@stomp/rx-stomp';
import { Observable, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  takeWhile,
  tap,
} from 'rxjs/operators';
import { AppState } from '../store/app.state';
import { IContact, IFile, IMessage, SendDTO } from './models/messages.model';
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
    files: this.formBuilder.array([]),
    attachmentIds: '',
  });
  get text() {
    return this.messageForm.get('text')?.value;
  }

  get files() {
    return this.messageForm.controls['files'] as FormArray;
  }

  set file(_file: IFile | null) {
    const file = this.formBuilder.control(_file);
    this.files.push(file);
  }

  get attachmentIds() {
    return this.messageForm.get('attachmentIds')?.value;
  }

  set attachmentIds(ids: string) {
    this.messageForm.patchValue({ attachmentIds: ids });
  }

  public textControl = new FormControl();
  public editMessageControl = new FormControl();
  public editMessageIndex: number = -1;
  public search: string = '';
  public unfilteredUsers: IContact[] = [];
  public users: IContact[] = [];
  public selected: IContact | null = null;
  public upload: Upload | null = null;
  public download: Download | null = null;
  public selectedToDownload: number = -1;
  public received$: Observable<IMessage[]>;
  public endOfMessages$: Observable<boolean>;
  public connectionStatus$: Observable<string>;
  public wsError$: Observable<string>;
  public usersSubscription: Subscription;
  public selectedSubscription: Subscription;
  public searchTextSubscription: Subscription;
  private draftSubscription: Subscription;
  private uploadSubscription: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private rxStompService: RxStompService,
    private messagesService: MessagesService,
    private store: Store<AppState>,
    private cdRef: ChangeDetectorRef
  ) {
    this.connectionStatus$ = rxStompService.connectionState$.pipe(
      map((state) => {
        return RxStompState[state];
      })
    );
    this.wsError$ = this.store.pipe(select((state) => state.ws.error));
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

    this.selectedSubscription = this.store
      .pipe(
        select((state) => state.ws.selected),
        tap((contact) => (this.selected = contact))
      )
      .subscribe();
    this.received$ = this.store.pipe(select((state) => state.ws.received));
    this.endOfMessages$ = this.store.pipe(
      select((state) => state.ws.endOfMessages)
    );
    this.draftSubscription = this.store
      .pipe(
        select((state) => state.ws.draft),
        tap((draft) => {
          this.messageForm.patchValue({
            text: draft.text,
            bold: false,
            italic: false,
            strikethrough: false,
            attachmentIds: draft.attachmentIds,
          });
          this.files.clear();
          draft.attachments?.forEach((file) => (this.file = file));
        })
      )
      .subscribe();
  }

  ngOnInit() {
    if (this.selected?.email.length) {
      this.store.dispatch(WsActions.select({ selection: this.selected }));
      this.cdRef.detectChanges();
    }
  }

  ngOnDestroy() {
    this.uploadSubscription?.unsubscribe();
    this.searchTextSubscription?.unsubscribe();
    this.selectedSubscription?.unsubscribe();
    this.draftSubscription?.unsubscribe();
    if (this.selected) {
      const message: SendDTO = {
        text: this.text,
        user: this.selected?.email || '',
      };
      this.upload = null;
      this.messageForm.reset({
        text: '',
        bold: false,
        italic: false,
        strikethrough: false,
        attachmentIds: '',
      });
      this.store.dispatch(WsActions.saveDraft({ message }));
    }
  }

  onFileInput(files: FileList | null): void {
    if (files) {
      const cFile = files.item(0);
      const idxFile = this.files.length;
      if (cFile) {
        this.file = {
          id: '',
          name: cFile?.name || '',
          type: cFile?.type || '',
          size: cFile?.size || 0,
          file: cFile,
        };
        this.uploadSubscription = this.messagesService
          .upload(
            this.files.controls[idxFile].value.file,
            this.selected?.email || ''
          )
          .subscribe(
            (data: Upload) => {
              this.upload = data;
              if (data.state == 'DONE' && data.id.length) {
                this.attachmentIds += this.attachmentIds.length
                  ? ','.concat(data.id)
                  : data.id;
                this.files.controls[idxFile].patchValue({
                  ...this.files.controls[idxFile].value,
                  id: data.id,
                });
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
    if (!this.text.length && !this.attachmentIds.length) return;
    const message: SendDTO = {
      text: this.text,
      user: this.selected?.email || '',
    };
    this.store.dispatch(WsActions.sendMessage({ message }));
    this.messageForm.reset({
      text: '',
      bold: false,
      italic: false,
      strikethrough: false,
      attachmentIds: '',
    });
    this.files.clear();
    this.upload = null;
  }

  selectUser(user: IContact) {
    const message: SendDTO = {
      text: this.text,
      user: this.selected?.email || '',
    };
    this.upload = null;
    this.messageForm.reset({
      text: '',
      bold: false,
      italic: false,
      strikethrough: false,
      attachmentIds: '',
    });
    this.files.clear();
    this.store.dispatch(WsActions.select({ selection: user }));
    this.store.dispatch(WsActions.saveDraft({ message }));
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

  removeAttachment(file: IFile, idx: number, isEditMode = false): void {
    if (!file.id.length) {
      return;
    }
    if (isEditMode) {
      this.store.dispatch(
        WsActions.removeAttachmentStart({
          attachmentId: file.id,
          messageId: idx,
        })
      );
      this.editMessageControl.reset();
      this.editMessageIndex = -1;
    } else {
      this.messagesService.removeAttachment(file.id).subscribe(
        (value) => this.files.removeAt(idx),
        (error) => console.log(error)
      );
    }
  }

  removeMessage(id: number) {
    if (!this.selected?.email) return;
    this.store.dispatch(
      WsActions.removeMessageStart({ email: this.selected.email, id: id })
    );
  }

  editMessage(message: IMessage, index: number) {
    this.editMessageIndex = index;
    this.editMessageControl.patchValue(message.text);
  }

  onSendEditMessage(id: number) {
    console.log('BEEN HERE!!!');
    const message: SendDTO = {
      text: this.editMessageControl.value,
      user: this.selected?.email || '',
    };
    this.store.dispatch(WsActions.editMessageStart({ message, id: id }));
    this.editMessageControl.reset();
    this.editMessageIndex = -1;
  }
}
