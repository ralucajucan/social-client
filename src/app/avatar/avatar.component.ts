import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  @Input() name: string = '';
  @Input() size: number = 40;
  @Input() badge: boolean = false;
  @Input() online: boolean = false;

  constructor() {}

  ngOnInit() {}
}
