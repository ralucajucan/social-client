import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RxStompService } from '@stomp/ng2-stompjs';
import { RxStompState } from '@stomp/rx-stomp';
import { IFrame, Message } from '@stomp/stompjs';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { SnackbarService } from '../snackbar.service';
import { IContact, IMessage, SendDTO } from './models/messages.model';
import { MessagesService } from './services/messages.service';
import { Download } from './utils/download';
import { Upload } from './utils/upload';

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

  private page: number = 0;
  private principal: string = '';
  public selectedUser: string = '';
  public endOfConversation: boolean = false;
  public receivedMessages: IMessage[] = [];
  public users: IContact[] = [];
  public connectionStatus$: Observable<string>;
  public upload: Upload | null = null;
  public download$: Observable<Download> | null = null;
  public selectedToDownload: number = -1;
  private conversationSubscription: Subscription = new Subscription();
  private usersSubscription: Subscription = new Subscription();
  private connectedSubscription: Subscription = new Subscription();
  private stompErrorsSubscription: Subscription = new Subscription();
  private uploadSubscription: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private rxStompService: RxStompService,
    private snackbarService: SnackbarService,
    private messagesService: MessagesService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.connectionStatus$ = rxStompService.connectionState$.pipe(
      map((state) => {
        if (state === 1) {
          this.rxStompService.publish({
            destination: '/api/refresh-connected',
          });
        }
        if (state === 3) {
          this.users = [];
        }
        return RxStompState[state];
      })
    );
  }

  ngOnInit() {
    this.usersSubscription = this.rxStompService
      .watch('/user/queue/list')
      .subscribe((message: Message) => {
        this.users = JSON.parse(message.body);
      });
    this.conversationSubscription = this.rxStompService
      .watch('/user/queue/conv-' + this.selectedUser)
      .subscribe((message: Message) => {
        if (message.body.includes(this.principal))
          this.receivedMessages.push(JSON.parse(message.body));
      });
    this.stompErrorsSubscription = this.rxStompService.stompErrors$.subscribe(
      (frame: IFrame) => this.snackbarService.error(frame.headers['message'])
    );
  }

  ngOnDestroy() {
    this.conversationSubscription?.unsubscribe();
    this.usersSubscription?.unsubscribe();
    this.connectedSubscription?.unsubscribe();
    this.stompErrorsSubscription?.unsubscribe();
    this.uploadSubscription?.unsubscribe();
  }

  onFileInput(files: FileList | null): void {
    if (files) {
      this.file = files.item(0);
      if (this.file) {
        this.uploadSubscription = this.messagesService
          .upload(this.file)
          .subscribe((data: Upload) => {
            this.upload = data;
            if (data.state == 'DONE' && data.id.length) {
              this.attachmentIds += this.attachmentIds.length
                ? ','.concat(data.id)
                : data.id;
            }
          });
      }
    }
  }

  onSendGeneratedMessage() {
    const message: SendDTO = {
      text: `Message generated at ${new Date()}`,
      user: this.selectedUser,
      attachmentIds: this.attachmentIds,
    };
    this.rxStompService.publish({
      destination: '/api/message',
      body: JSON.stringify(message),
    });
  }

  onSendMessage() {
    console.log(this.messageForm.value);
    if (!this.text.length && !this.attachmentIds.length) return;
    const message: SendDTO = {
      text: this.text,
      user: this.selectedUser,
      attachmentIds: this.attachmentIds,
    };
    this.rxStompService.publish({
      destination: '/api/message',
      body: JSON.stringify(message),
    });

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

  selectUser(user: string) {
    this.page = 0;
    this.endOfConversation = false;
    this.receivedMessages = [];
    this.selectedUser = user;
    this.conversationSubscription.unsubscribe();
    this.conversationSubscription = this.rxStompService
      .watch('/user/queue/conv-' + this.selectedUser)
      .subscribe((message: Message) => {
        if (message.body.includes(this.principal))
          this.receivedMessages.push(JSON.parse(message.body));
      });
    this.messagesService
      .getConversation(this.selectedUser, this.page)
      .subscribe(
        (data) => {
          this.receivedMessages = data.reverse().concat(this.receivedMessages);
          if (data.length < 10) {
            this.endOfConversation = true;
          }
        },
        (error) => {
          this.snackbarService.error(error.error);
        }
      );
  }

  loadMore() {
    this.page++;
    this.messagesService
      .getConversation(this.selectedUser, this.page)
      .subscribe(
        (data) => {
          this.receivedMessages = data.reverse().concat(this.receivedMessages);
          if (data.length < 10) {
            this.endOfConversation = true;
          }
        },
        (error) => {
          this.snackbarService.error(error.error);
        }
      );
  }

  download(id: string, filename: string, i: number) {
    this.download$ = this.messagesService.download(id, filename);
    this.selectedToDownload = i;
  }
}
