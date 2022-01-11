import { Component, Input } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';

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
