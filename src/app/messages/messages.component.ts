import { Component, OnDestroy, OnInit } from '@angular/core';
import { RxStompService, StompHeaders } from '@stomp/ng2-stompjs';
import { RxStompState } from '@stomp/rx-stomp';
import { Message } from '@stomp/stompjs';
import { Observable, pipe, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, OnDestroy {
  private selectedUser: string = '';
  private principal: string = '';
  public receivedMessages: string[] = [];
  public users: string[] = [];
  public connectionStatus$: Observable<string>;
  private userQueueSubscription: Subscription = new Subscription();
  private usersSubscription: Subscription = new Subscription();
  private connectedSubscribtion: Subscription = new Subscription();

  constructor(private rxStompService: RxStompService) {
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
    this.userQueueSubscription = this.rxStompService
      .watch('/user/queue/greetings')
      .subscribe((message: Message) => {
        if (message.body.includes(this.principal))
          this.receivedMessages.push(message.body);
      });
  }

  ngOnDestroy() {
    this.userQueueSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
    this.connectedSubscribtion.unsubscribe();
  }

  onSendMessage() {
    const message: SendDTO = {
      text: `Message generated at ${new Date()}`,
      receiver: this.selectedUser,
    };
    this.rxStompService.publish({
      destination: '/api/message',
      body: JSON.stringify(message),
    });
  }

  selectUser(user: string) {
    this.selectedUser = user;
  }
}

interface SendDTO {
  text: string;
  receiver: string;
}
