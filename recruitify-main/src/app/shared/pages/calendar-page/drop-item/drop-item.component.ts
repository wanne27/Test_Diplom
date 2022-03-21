import { SkillsTabsetComponent } from './../skills-tabset/skills-tabset.component';
import { EmailService } from './../email.service';
import { CandidateCalendar } from './../../../models/CandidateCalendar';
import { InterviewerCalendar } from './../../../models/InterviewerCalendar';
import { CalendarPageFacade } from './../calendar-page.facade';
import { Component, Input, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-drop-item',
  templateUrl: './drop-item.component.html',
  styleUrls: ['./drop-item.component.scss'],
})
export class DropItemComponent implements OnInit {
  @Input() timetableTime: any;
  @Input() currentInterviewer: any;

  isPopVisible = false;

  displayedInterviewers!: InterviewerCalendar[];
  displayedCandidates: any;

  assignedCandidate!: any;
  dragedCandidate!: CandidateCalendar;

  assignedCandidatesToSendEmail: any;

  datePickerValue!: Date;

  isAssigned: boolean = false;
  assignedCandidateFromBack!: any;

  constructor(
    private calendarPageFacade: CalendarPageFacade,
    private emailService: EmailService,
    private skillsTabsetComponent: SkillsTabsetComponent
  ) {}

  timeIdForItem: string = '';

  ngOnInit(): void {
    const itemTime = dayjs(this.timetableTime.time).format('HH:mm');
    const currentDay = dayjs(this.datePickerValue).format('YYYY-MM-DD');
    const resultDate = dayjs(`${currentDay} ${itemTime}`).toISOString();
    this.timeIdForItem = resultDate;
    // console.log(resultDate);

    this.calendarPageFacade.datepickerValue$.subscribe((response) => {
      this.datePickerValue = response;
    });

    this.calendarPageFacade.assignedCandidate$.subscribe((response) => {
      if (Object.keys(response).length !== 0) {
        this.assignedCandidate = response;
      }
    });

    this.calendarPageFacade.displayedInterviewers$.subscribe((response) => {
      this.displayedInterviewers = response;
    });

    this.calendarPageFacade.displayedCandidates$.subscribe((response) => {
      this.displayedCandidates = response;
    });

    this.calendarPageFacade.dragedCandidate$.subscribe((response) => {
      this.dragedCandidate = response;
    });

    this.emailService.candidatesToSendEmail$.subscribe((response) => {
      // console.log(response);
      this.assignedCandidatesToSendEmail = response;
    });

    // this.skillsTabsetComponent.recruiterScheduleSlots$.subscribe((resp) => {
    this.calendarPageFacade.recruiterScheduleSlots$.subscribe((resp) => {
      // console.log(resp);
      let time: any = resp.find((item: any) => {
        return dayjs(resultDate).isSame(dayjs(item.availableTime));
      });

      if (time && time.scheduleCandidateInfo !== null) {
        this.assignedCandidateFromBack = time.scheduleCandidateInfo;
        this.isAssigned = true;
      } else {
        this.assignedCandidateFromBack = '';
        this.isAssigned = false;
      }
    });
  }

  setDragulaValue(assignedCandidateArr: any): string {
    const isCandidateAssigned = !assignedCandidateArr.length;
    return isCandidateAssigned && !this.isAssigned ? 'calendar' : '';
  }

  setIsAvaliableToDrop(interviewerTime: number, dragedCandidateTime: number[]) {
    if (dragedCandidateTime) {
      const isTimeIncludes = dragedCandidateTime.includes(
        new Date(interviewerTime).getHours()
      );
      return isTimeIncludes;
    } else {
      return null;
    }
  }

  setPopTrigger(candidate: any) {
    return candidate || this.isAssigned ? 'click' : null;
  }

  onItemClick(candidate: any, time: number, interviewerId: number) {
    const assignedDate = new Date(time);
    const assignedCandidateData = {
      ...candidate,
      assignedDate,
      interviewerId,
    };
    if (candidate) {
      this.calendarPageFacade.assignedCandidate$.next(assignedCandidateData);
    }
  }

  onRemoveBtnClick(assignedCandiate: any) {
    const interviewer = this.displayedInterviewers.find(
      (interviewer) => interviewer.id === assignedCandiate.interviewerId
    );
    interviewer?.calendar[0].timetable.forEach((item) => {
      this.isPopVisible = false;

      if (item.candidate[0] && item.candidate[0].id === assignedCandiate.id) {
        const result = this.assignedCandidatesToSendEmail.filter(
          (item: any) => {
            return item.id !== assignedCandiate.id;
          }
        );
        this.emailService.candidatesToSendEmail$.next(result);
        item.candidate.pop();
        this.calendarPageFacade.displayedCandidates$.next([
          ...this.displayedCandidates,
          assignedCandiate,
        ]);
      }
    });
  }
}
