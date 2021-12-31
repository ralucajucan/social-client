import { Component, OnDestroy, OnInit } from '@angular/core';
import { RxStompService, StompHeaders } from '@stomp/ng2-stompjs';
import { RxStompState } from '@stomp/rx-stomp';
import { Message } from '@stomp/stompjs';
import { Observable, pipe, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SnackbarService } from '../snackbar.service';
import { IMessage } from './messages.model';
import { MessagesService } from './messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, OnDestroy {
  private selectedUser: string = '';
  private page: number = 0;
  private principal: string = '';
  public receivedMessages: IMessage[] = [];
  public users: string[] = [];
  public connectionStatus$: Observable<string>;
  private conversationSubscription: Subscription = new Subscription();
  private usersSubscription: Subscription = new Subscription();
  private connectedSubscribtion: Subscription = new Subscription();
  private errorSubscribtion: Subscription = new Subscription();

  constructor(
    private rxStompService: RxStompService,
    private snackbarService: SnackbarService,
    private messagesService: MessagesService
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
    this.rxStompService.serverHeaders$.pipe(
      tap(async (headers: StompHeaders) => {
        if (!headers.hasOwnProperty('user-name')) {
          this.rxStompService.stompClient.forceDisconnect();
        }
        this.principal = headers['user-name'];
      })
    );
  }

  ngOnInit() {
    this.usersSubscription = this.rxStompService
      .watch('/user/queue/list')
      .subscribe((message: Message) => {
        this.users = message.body
          .slice(2, message.body.length - 2)
          .split('","');
      });
    this.conversationSubscription = this.rxStompService
      .watch('/user/queue/conv-' + this.selectedUser)
      .subscribe((message: Message) => {
        if (message.body.includes(this.principal))
          this.receivedMessages.push(JSON.parse(message.body));
      });
    this.errorSubscribtion = this.rxStompService
      .watch('/user/queue/error')
      .subscribe((error: Message) => {
        console.log(error);
        this.snackbarService.error(error.body);
      });
  }

  ngOnDestroy() {
    this.conversationSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
    this.connectedSubscribtion.unsubscribe();
    this.errorSubscribtion.unsubscribe();
  }

  onSendGeneratedMessage() {
    const message: SendDTO = {
      text: `Message generated at ${new Date()}`,
      receiver: this.selectedUser,
    };
    this.rxStompService.publish({
      destination: '/api/message',
      body: JSON.stringify(message),
    });
  }

  onSendMessage(text: string) {
    const message: SendDTO = {
      text: text,
      receiver: this.selectedUser,
    };
    this.rxStompService.publish({
      destination: '/api/message',
      body: JSON.stringify(message),
    });
  }

  selectUser(user: string) {
    this.page = 0;
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
          this.snackbarService.success(
            `Retrieved conversation with ${this.selectedUser}`
          );
          console.log(data);
          this.receivedMessages = data.concat(this.receivedMessages);
        },
        (error) => {
          this.snackbarService.error(error.error);
        }
      );
  }
}

interface SendDTO {
  text: string;
  receiver: string;
}
