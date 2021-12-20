import { Component, Input, OnInit } from '@angular/core';
import { RxStompService, StompHeaders } from '@stomp/ng2-stompjs';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { RxStompState } from '@stomp/rx-stomp';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css'],
})
export class StatusComponent {
  @Input() public status: string | null = '';
  public loading = false;

  constructor(public rxStompService: RxStompService) {}

  async deactivate() {
    this.loading = true;
    await this.rxStompService.deactivate();
    this.loading = false;
  }
}
