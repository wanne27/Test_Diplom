import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class CalendarPageFacade {
  isSaveBtnVisible$ = new BehaviorSubject(false);
  isWorkingWeekends$ = new BehaviorSubject(false);
  clickedDay$ = new BehaviorSubject(new Date());

  assignedCandidate$ = new BehaviorSubject({});
  dragedCandidate$: BehaviorSubject<any> = new BehaviorSubject<any>({});

  displayedCandidates$: BehaviorSubject<any> = new BehaviorSubject([]);
  displayedInterviewers$: BehaviorSubject<any> = new BehaviorSubject([]);

  datepickerValue$ = new BehaviorSubject(new Date());

  isMouseDown$ = new BehaviorSubject(false);

  recruiterScheduleSlots$ = new BehaviorSubject([]);

  timeLine = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
  ];

  today = new Date();
  nearestMonday = new Date(
    this.today.setDate(this.today.getDate() - this.today.getDay() + 1)
  );

  constructor() {}

  getCurrentWeekDays(daysCount: number) {
    const daysArr = [this.nearestMonday];
    for (let i = 2; i <= daysCount; i++) {
      let nextDay = new Date(
        new Date().setDate(new Date().getDate() - new Date().getDay() + i)
      );
      daysArr.push(nextDay);
    }
    return daysArr;
  }

  getNextWeekDays(weekdaysArr: Date[]) {
    return weekdaysArr.map(
      (item) => new Date(item.getTime() + 24 * 7 * 60 * 60 * 1000)
    );
  }

  getPreviousWeekDays(weekdaysArr: Date[]) {
    return weekdaysArr.map(
      (item) => new Date(item.getTime() - 24 * 7 * 60 * 60 * 1000)
    );
  }

  setPickedDay(newValue: Date) {
    this.datepickerValue$.next(newValue);
  }

  getNextDay() {
    let nextDay = new Date(
      this.datepickerValue$.value.getTime() + 24 * 60 * 60 * 1000
    );
    this.datepickerValue$.next(nextDay);
  }

  getPreviuosDay() {
    let nextDay = new Date(
      this.datepickerValue$.value.getTime() - 24 * 60 * 60 * 1000
    );
    this.datepickerValue$.next(nextDay);
  }

  checkDayIsWeekend() {
    const dayNumber = this.datepickerValue$.value.getDay();
    return dayNumber === 6 || dayNumber === 0;
  }
}
