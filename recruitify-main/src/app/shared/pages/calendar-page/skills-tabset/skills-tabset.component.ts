import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';
import { CalendarPageFacade } from './../calendar-page.facade';
import { CalendarService } from './../../../services/calendar.service';
import { Component, OnInit } from '@angular/core';
import { swager } from '../constants';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-skills-tabset',
  templateUrl: './skills-tabset.component.html',
  styleUrls: ['./skills-tabset.component.scss'],
})
export class SkillsTabsetComponent implements OnInit {
  interviewersTimeTable: any = [];
  candidatesTimeTable: any = [];
  datepickerValue: any;

  recruiterScheduleSlots$ = new BehaviorSubject([]);

  constructor(
    private calendarService: CalendarService,
    private calendarPageFacade: CalendarPageFacade,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.calendarPageFacade.datepickerValue$.subscribe((resp) => {
      this.datepickerValue = resp;
    });

    this.route.params.subscribe((params) => {
      this.http
        .get(
          `https://${swager}.herokuapp.com/odata/Schedules/GetCandidatesPassedTest?projectId=${params.id}`
        )
        .pipe(map((d: any) => d.value))
        .subscribe((resp) => {
          this.candidatesTimeTable = resp;
          this.calendarPageFacade.displayedCandidates$.next(resp);
        });
    });

    // this.calendarService.getCandidatesTimeTable().subscribe((response) => {
    //   this.candidatesTimeTable = response;
    // });

    this.calendarService.getInterviewersTimeTable().subscribe((response) => {
      this.interviewersTimeTable = response;
      this.setRecruiterAndAllCandidates();
    });
  }

  setTabNames() {
    const interviewersSkills = this.interviewersTimeTable.map(
      (item: any) => item.skill
    );
    const interviewersSkillsWithoutDuplicates = [
      ...new Set(interviewersSkills),
    ];
    const resultArrWithoutRecruiter =
      interviewersSkillsWithoutDuplicates.filter(
        (item) => item !== 'Recruiter'
      );

    return resultArrWithoutRecruiter;
  }

  setRecruiterAndAllCandidates() {
    this.calendarPageFacade.displayedInterviewers$.next(
      this.interviewersTimeTable.filter(
        (interviewer: any) => interviewer.skill === 'Recruiter'
      )
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

    this.route.params.subscribe((params) => {
      this.http
        .get(
          `https://${swager}.herokuapp.com/odata/Schedules/GetCandidatesPassedTest?projectId=${params.id}`
        )
        .pipe(map((d: any) => d.value))
        .subscribe((resp) => {
          this.calendarPageFacade.displayedCandidates$.next(resp);
        });
    });
  }

  setInterviewersAndCandidatesBySkill(tabName: any) {
    this.calendarService.getCandidatesTimeTable().subscribe((response: any) => {
      this.calendarPageFacade.displayedCandidates$.next(
        response.filter((candidate: any) => candidate.skill === tabName)
      );
    });
    const interviewers = this.interviewersTimeTable.filter(
      (interviewer: any) => interviewer.skill === tabName
    );

    this.calendarPageFacade.displayedInterviewers$.next(interviewers);
    this.calendarPageFacade.recruiterScheduleSlots$.next([]);
  }
}
