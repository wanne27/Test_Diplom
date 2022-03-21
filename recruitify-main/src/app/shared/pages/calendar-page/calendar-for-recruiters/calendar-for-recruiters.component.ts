import { SkillsTabsetComponent } from './../skills-tabset/skills-tabset.component';
import { LocalStorageService } from './../../../../services/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EmailService } from './../email.service';
import { CalendarPageFacade } from './../calendar-page.facade';
import { CalendarService } from './../../../services/calendar.service';
import { Component, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { swager } from '../constants';

@Component({
  selector: 'app-calendar-for-recruiters',
  templateUrl: './calendar-for-recruiters.component.html',
  styleUrls: ['./calendar-for-recruiters.component.scss'],
})
export class CalendarForRecruitersComponent implements OnInit {
  datepickerValue!: Date;
  isBtnSaveVisible: boolean = false;
  candidatesToSendEmail: any;
  currentProjectId: string = '';

  constructor(
    public calendarService: CalendarService,
    private calendarPageFacade: CalendarPageFacade,
    private emailService: EmailService,
    private message: NzMessageService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private lsService: LocalStorageService // private skillsTabsetComponent: SkillsTabsetComponent
  ) {}

  timeTable: string[] = [];

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.currentProjectId = params.id;
    });

    this.emailService.candidatesToSendEmail$.subscribe((repsonse) => {
      repsonse.length > 0
        ? this.calendarPageFacade.isSaveBtnVisible$.next(true)
        : this.calendarPageFacade.isSaveBtnVisible$.next(false);
    });

    this.calendarPageFacade.datepickerValue$.subscribe((response) => {
      this.datepickerValue = response;
    });

    this.emailService.candidatesToSendEmail$.subscribe(
      (response) => (this.candidatesToSendEmail = response)
    );

    this.calendarPageFacade.isSaveBtnVisible$.subscribe(
      (response) => (this.isBtnSaveVisible = response)
    );

    // установить все ячейки рекрутера доступными для перетягивания канидата
    this.calendarService.getInterviewersTimeTable().subscribe((resp: any) => {
      this.timeTable = resp[0].calendar[0].timetable.map((item: any) => {
        const currentDay = dayjs(this.datepickerValue).format('YYYY-MM-DD');
        const time = dayjs(item.time).format('HH:mm');
        const resultDate = dayjs(`${currentDay} ${time}`).toISOString();
        return resultDate;
      });

      this.http
        .put(`https://${swager}.herokuapp.com/api/schedules`, this.timeTable)
        .subscribe(
          (r) => {
            // console.log(r);
          },
          (err) => {
            if (err.status === 500) {
              console.log('all days are avaliable');
            }
          }
        );
    });
  }

  onNextDayButtonClick() {
    this.calendarPageFacade.getNextDay();
    this.isBtnSaveVisible = false;

    this.calendarService.getInterviewersTimeTable().subscribe((resp: any) => {
      this.timeTable = resp[0].calendar[0].timetable.map((item: any) => {
        const currentDay = dayjs(this.datepickerValue).format('YYYY-MM-DD');
        const time = dayjs(item.time).format('HH:mm');
        const resultDate = dayjs(`${currentDay} ${time}`).toISOString();
        return resultDate;
      });
      // console.log(this.timeTable);

      this.http
        .put(`https://${swager}.herokuapp.com/api/schedules`, this.timeTable)
        .subscribe(
          (r) => console.log(r),
          (err) => {
            if (err.status === 500) {
              console.log('all days are avaliable');
            }
          }
        );

      this.http
        .get(
          `https://${swager}.herokuapp.com/api/schedules/current_user?date=${this.datepickerValue.toISOString()}&daysNum=${1}`
        )
        .subscribe((resp: any) => {
          this.calendarPageFacade.recruiterScheduleSlots$.next(
            resp.scheduleSlots
          );
          // console.log(resp);
        });
    });
  }

  onPreviousDayButtonClick() {
    this.calendarPageFacade.getPreviuosDay();
    this.isBtnSaveVisible = false;
  }

  onCalendarDateChange(event: Date) {
    this.calendarPageFacade.setPickedDay(event);
    this.isBtnSaveVisible = false;
  }

  onSaveConfirm() {
    this.http
      .get(
        `https://${swager}.herokuapp.com/api/schedules/current_user?date=${this.datepickerValue.toISOString()}&daysNum=${1}`
      )
      .subscribe((resp: any) => {
        // console.log(resp);

        const candidatesToSend = this.candidatesToSendEmail.map((item: any) => {
          const objToSend = {
            userId: resp.userId,
            candidateId: item.id,
            appoitmentDateTime: item.time,
            isAppointment: true,
          };
          return objToSend;
        });

        this.http
          .put(
            `https://${swager}.herokuapp.com/api/schedules/bulk/update_assigned_interviews?projectId=${this.currentProjectId}`,
            candidatesToSend
          )
          .subscribe((r) => console.log(r));
        // console.log(candidatesToSend);
      });

    this.message.success('Email was succesfuly sent');
  }
}
