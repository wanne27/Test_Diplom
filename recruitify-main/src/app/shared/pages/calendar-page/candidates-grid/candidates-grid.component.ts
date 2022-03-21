import { Component, OnInit } from '@angular/core';
import { CalendarService } from './../../../services/calendar.service';
import { CalendarPageFacade } from './../calendar-page.facade';

@Component({
  selector: 'app-candidates-grid',
  templateUrl: './candidates-grid.component.html',
  styleUrls: ['./candidates-grid.component.scss'],
})
export class CandidatesGridComponent implements OnInit {
  currentProjectId: string = '';
  displayedCandidates: any;
  candidatePrimarySkillName: string = '';
  displayedInterviewerIsRecruiter!: boolean;

  constructor(
    private calendarPageFacade: CalendarPageFacade,
    public calendarService: CalendarService
  ) {}

  ngOnInit(): void {
    this.calendarPageFacade.displayedCandidates$.subscribe((response) => {
      this.displayedCandidates = response;
    });

    this.calendarPageFacade.displayedInterviewers$.subscribe((response) => {
      if (response.length) {
        this.displayedInterviewerIsRecruiter =
          response[0].skill === 'Recruiter';
      }
    });
  }
}
