import { CalendarPageFacade } from './calendar-page.facade';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  candidatesToSendEmail$: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor() {}

  sendEmails() {
    this.candidatesToSendEmail$.subscribe((response) => {
      response.forEach((candidate: any) => {
        // console.log(`Email succefuly sent to ${candidate.email}`);
      });
    });
  }
}
