import { Component, OnInit } from '@angular/core';
import { MainLayoutFacade } from './main-layout.facade';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  constructor(public fc: MainLayoutFacade) {}

  ngOnInit(): void {}
}
