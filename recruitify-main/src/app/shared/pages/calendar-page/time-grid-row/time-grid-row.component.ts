import { CalendarService } from './../../../services/calendar.service';
import { CalendarPageFacade } from './../calendar-page.facade';
import { Component, Input, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-time-grid-row',
  templateUrl: './time-grid-row.component.html',
  styleUrls: ['./time-grid-row.component.scss'],
})
export class TimeGridRowComponent implements OnInit {
  @Input() day!: Date;
  time: string[] = this.calendarPageFacade.timeLine;
  workingWeekends!: boolean;

  interviewerTimeTable = [];

  constructor(private calendarPageFacade: CalendarPageFacade) {}

  ngOnInit(): void {
    this.calendarPageFacade.isWorkingWeekends$.subscribe(
      (response) => (this.workingWeekends = response)
    );
  }
}
