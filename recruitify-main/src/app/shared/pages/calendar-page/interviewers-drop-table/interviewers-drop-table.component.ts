import { UserService } from 'src/app/shared/services/user.service';
import { LocalStorageService } from './../../../../services/local-storage.service';
import { CalendarPageFacade } from './../calendar-page.facade';
import { InterviewerCalendar } from './../../../models/InterviewerCalendar';
import { DragNDropService } from './../../../services/drag-n-drop.service';
import { Component, DoCheck, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-interviewers-drop-table',
  templateUrl: './interviewers-drop-table.component.html',
  styleUrls: ['./interviewers-drop-table.component.scss'],
})
export class InterviewersDropTableComponent implements OnInit, DoCheck {
  public readonly USER_KEY = 'user';
  recruiterName = this.lsService.getItem(this.USER_KEY).name;
  isRecruiter!: boolean;

  isWeekDay!: boolean;

  displayedInterviewers!: InterviewerCalendar[];

  constructor(
    private dragNDropService: DragNDropService,
    private calendarPageFacade: CalendarPageFacade,
    private lsService: LocalStorageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.calendarPageFacade.displayedInterviewers$.subscribe((resp: any) => {
      this.displayedInterviewers = resp;
      if (resp.length) {
        this.isRecruiter = resp[0].skill === 'Recruiter';
      }
    });
  }

  ngDoCheck(): void {
    this.isWeekDay = !this.calendarPageFacade.checkDayIsWeekend();
  }
}
