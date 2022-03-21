import { CalendarForInterviewersComponent } from './../calendar-for-interviewers/calendar-for-interviewers.component';
import { HttpClient } from '@angular/common/http';
import { CalendarPageFacade } from './../calendar-page.facade';
import { Component, Input, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-time-grid-item',
  templateUrl: './time-grid-item.component.html',
  styleUrls: ['./time-grid-item.component.scss'],
})
export class TimeGridItemComponent implements OnInit {
  @Input() day!: Date;
  @Input() time!: string;

  scheduleSlots!: any;

  today = new Date();
  yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
  isFuture!: boolean;

  isMarked: boolean = false;
  isAssigned: boolean = false;
  assignedCandidate: any;

  isMouseDown: boolean = false;

  constructor(
    private calendarPageFacade: CalendarPageFacade,
    private calendarForInterviewersComponent: CalendarForInterviewersComponent
  ) {}

  ngOnInit(): void {
    this.calendarForInterviewersComponent.scheduleSlots$.subscribe((resp) => {
      this.scheduleSlots = resp;

      this.setMarkedItems();

      this.setAssignedItem();
    });

    this.calendarForInterviewersComponent.dateArrToSend$.subscribe((resp) => {
      this.dateArrToSend = resp;
    });

    this.calendarPageFacade.isMouseDown$.subscribe((resp) => {
      this.isMouseDown = resp;
    });

    const currDate = dayjs();
    const currHour = currDate.hour();

    const itemTimeArr = this.time.split(':');
    const itemHour = +itemTimeArr[0];

    const itemDate = dayjs(this.day);
    this.isFuture = itemDate.isSame(dayjs(), 'day') && currHour + 1 > itemHour;
  }

  setMarkedItems() {
    const itemDate = dayjs(this.day).format('MM.DD.YYYY');
    const itemTime = this.time;
    const resultItemDate = dayjs(`${itemDate} ${itemTime}`);

    const avaliableTime = this.scheduleSlots.map((item: any) => {
      return dayjs(item.availableTime);
    });

    avaliableTime.forEach((item: any) => {
      if (resultItemDate.isSame(item)) {
        this.isMarked = true;
      }
    });
  }

  setAssignedItem() {
    const itemDate = dayjs(this.day).format('MM.DD.YYYY');
    const itemTime = this.time;
    const resultItemDate = dayjs(`${itemDate} ${itemTime}`);

    const avaliableTime = this.scheduleSlots.find((item: any) => {
      return resultItemDate.isSame(item.availableTime);
    });
    if (avaliableTime && avaliableTime.scheduleCandidateInfo) {
      this.assignedCandidate = avaliableTime.scheduleCandidateInfo;
      // console.log(this.assignedCandidate);
      this.isAssigned = true;
    }
  }

  dateArrToSend: any[] = [];

  setDatesToSend() {
    // const itemDate = dayjs(this.day).format('MM.DD.YYYY');
    // const itemTime = this.time;
    // const resultItemDate = dayjs(`${itemDate} ${itemTime}`);
    // this.dateArrToSend.push(resultItemDate.toJSON());
    // this.calendarForInterviewersComponent.dateArrToSend$.next(
    //   this.dateArrToSend
    // );
    // console.log(this.dateArrToSend);
  }

  setPopTrigger() {
    return this.isAssigned ? 'click' : null;
  }

  onMouseDown(event: any) {
    this.calendarPageFacade.clickedDay$.next(this.day);

    if (!this.isAssigned && !this.isMarked && event.which === 1) {
      const itemDate = dayjs(this.day).format('MM.DD.YYYY');
      const itemTime = this.time;
      const resultItemDate = dayjs(`${itemDate} ${itemTime}`);

      this.dateArrToSend.push(resultItemDate.toJSON());

      this.calendarForInterviewersComponent.dateArrToSend$.next(
        this.dateArrToSend
      );

      // console.log(this.dateArrToSend);
    }
  }

  onMouseOver() {
    if (!this.isAssigned && !this.isMarked && this.isMouseDown) {
      const itemDate = dayjs(this.day).format('MM.DD.YYYY');
      const itemTime = this.time;
      const resultItemDate = dayjs(`${itemDate} ${itemTime}`);

      this.dateArrToSend.push(resultItemDate.toJSON());

      this.calendarForInterviewersComponent.dateArrToSend$.next(
        this.dateArrToSend
      );

      // console.log(this.dateArrToSend);
    }
  }

  onContextMenu() {
    const itemDate = dayjs(this.day).format('MM.DD.YYYY');
    const itemTime = this.time;
    const resultItemDate = dayjs(`${itemDate} ${itemTime}`);

    const result = this.dateArrToSend.filter((item) => {
      return !dayjs(item).isSame(resultItemDate);
    });

    this.calendarForInterviewersComponent.dateArrToSend$.next(result);
  }
}
