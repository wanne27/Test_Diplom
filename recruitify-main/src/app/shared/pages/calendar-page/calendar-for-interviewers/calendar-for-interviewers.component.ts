import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EmailService } from './../email.service';
import { LocalStorageService } from './../../../../services/local-storage.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CalendarPageFacade } from '../calendar-page.facade';
import { Component, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { swager } from '../constants';

@Component({
  selector: 'app-calendar-for-interviewers',
  templateUrl: './calendar-for-interviewers.component.html',
  styleUrls: ['./calendar-for-interviewers.component.scss'],
})
export class CalendarForInterviewersComponent implements OnInit {
  public readonly USER_KEY = 'user';
  interviewersName = this.lsService.getItem(this.USER_KEY).name;

  today = new Date();
  isBtnSaveVisible: boolean = false;
  isWorkingWeekends!: boolean;
  countOfDisplayedDays!: number;
  displayedWeekDays!: Date[];

  constructor(
    private calendarPageFacade: CalendarPageFacade,
    private popMessage: NzMessageService,
    private lsService: LocalStorageService,
    private http: HttpClient
  ) {}

  scheduleSlots$ = new BehaviorSubject([]);
  dateArrToSend$: BehaviorSubject<any> = new BehaviorSubject([]);
  datesToSend!: string[];

  currMonday = this.calendarPageFacade.nearestMonday;

  ngOnInit(): void {
    // console.log(this.currMonday);
    // console.log(new Date(this.currMonday.getTime() + 24 * 7 * 60 * 60 * 1000));

    this.getInterviewersSchedule(this.currMonday);

    this.dateArrToSend$.subscribe((resp) => {
      this.datesToSend = resp;
    });

    this.calendarPageFacade.isSaveBtnVisible$.subscribe(
      (response) => (this.isBtnSaveVisible = response)
    );

    this.calendarPageFacade.isWorkingWeekends$.subscribe((response) => {
      this.isWorkingWeekends = response;

      const countOfDays = response ? 7 : 5;

      this.displayedWeekDays =
        this.calendarPageFacade.getCurrentWeekDays(countOfDays);
    });
  }

  getInterviewersSchedule(startDate: Date, daysNum: number = 8) {
    const dateToSend = startDate.toISOString();

    this.http
      .get(
        `https://${swager}.herokuapp.com/api/schedules/current_user?date=${dateToSend}&daysNum=${daysNum}`
      )
      .subscribe((response: any) => {
        // console.log(response.scheduleSlots);
        this.scheduleSlots$.next(response.scheduleSlots);

        this.dateArrToSend$.next(
          response.scheduleSlots.map((item: any) => {
            return dayjs(item.availableTime).toJSON();
          })
        );
      });
  }

  onNextBtnClick(): void {
    this.currMonday = new Date(
      this.currMonday.getTime() + 24 * 7 * 60 * 60 * 1000
    );
    // const nextMonday = new Date(
    //   this.currMonday.getTime() + 24 * 7 * 60 * 60 * 1000
    // );
    this.getInterviewersSchedule(this.currMonday);

    this.displayedWeekDays = this.calendarPageFacade.getNextWeekDays(
      this.displayedWeekDays
    );
    this.calendarPageFacade.isSaveBtnVisible$.next(false);
  }

  onPreviousBtnClick(): void {
    this.currMonday = new Date(
      this.currMonday.getTime() - 24 * 7 * 60 * 60 * 1000
    );
    // const prevMonday = new Date(
    //   this.currMonday.getTime() - 24 * 7 * 60 * 60 * 1000
    // );
    this.getInterviewersSchedule(this.currMonday);

    this.displayedWeekDays = this.calendarPageFacade.getPreviousWeekDays(
      this.displayedWeekDays
    );
    this.calendarPageFacade.isSaveBtnVisible$.next(false);
  }

  onSaveBtnClick(): void {
    this.http
      .put(`https://${swager}.herokuapp.com/api/schedules`, [
        ...this.datesToSend,
      ])
      .subscribe((r) => console.log(r));

    this.popMessage.success('Changes saved');
    this.calendarPageFacade.isSaveBtnVisible$.next(false);
    this.dateArrToSend$.next([]);
  }

  printWeekends() {
    this.calendarPageFacade.isWorkingWeekends$.next(this.isWorkingWeekends);
  }
}
