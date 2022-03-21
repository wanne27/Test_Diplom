import { CalendarPageFacade } from './../calendar-page.facade';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.scss'],
})
export class TimeLineComponent implements OnInit {
  time = this.calendarPageFacade.timeLine;

  constructor(private calendarPageFacade: CalendarPageFacade) {}

  ngOnInit(): void {}
}
