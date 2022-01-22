import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  readonly pageSizes: number[] = [10, 25, 50, 100];
  selected: number = this.pageSizes[0];
  currentPage: number = 0;

  constructor() {}

  ngOnInit() {}

  decrementPage() {
    this.currentPage--;
  }
  incrementPage() {
    this.currentPage++;
  }
}
