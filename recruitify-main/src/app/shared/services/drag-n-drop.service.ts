import { EmailService } from './../pages/calendar-page/email.service';
import { CalendarPageFacade } from './../pages/calendar-page/calendar-page.facade';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DragNDropService {
  subs = new Subscription();
  candidatesTimeTable: any = [];
  dragedCandidate: any;
  assignedCandidates: any = [];

  constructor(
    private dragulaService: DragulaService,
    private calendarPageFacade: CalendarPageFacade,
    private emailService: EmailService
  ) {
    calendarPageFacade.displayedCandidates$.subscribe((responce) => {
      this.candidatesTimeTable = responce;
    });

    dragulaService.createGroup('calendar', {
      revertOnSpill: true,
    });

    this.subs.add(
      dragulaService
        .dropModel('calendar')
        .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
          this.calendarPageFacade.displayedCandidates$.next(sourceModel);
        })
    );

    this.subs.add(
      dragulaService.drag('calendar').subscribe(({ el }) => {
        this.onCandidateDrag(el);
      })
    );

    this.subs.add(
      dragulaService.over('calendar').subscribe(({ container }) => {
        this.onCandidateOverAvaliableContainer(container);
      })
    );

    this.subs.add(
      dragulaService.out('calendar').subscribe(({ container }) => {
        this.onCandidateOutOfAvaliableContainer(container);
      })
    );

    this.subs.add(
      dragulaService.drop('calendar').subscribe(({ el, target }) => {
        this.onCandidateDrop(el, target);
      })
    );

    this.subs.add(
      dragulaService.cancel('calendar').subscribe(() => {
        this.onCandidateDragCancel();
      })
    );
  }

  onCandidateDrag(el: Element) {
    this.dragedCandidate = this.candidatesTimeTable.find((item: any) => {
      if (typeof item.id === 'string') {
        return item.id === el.id;
      } else {
        return +item.id === +el.id;
      }
    });
    this.calendarPageFacade.dragedCandidate$.next(this.dragedCandidate);
  }

  onCandidateDrop(el: Element, target: Element) {
    if (target.classList.contains('markedByInterviewer')) {
      el.classList.add('d-none');
      this.assignedCandidates = [
        ...this.assignedCandidates,
        { ...this.dragedCandidate, time: target.id },
      ];

      this.emailService.candidatesToSendEmail$.next(this.assignedCandidates);
    }
    this.calendarPageFacade.dragedCandidate$.next({});
  }

  onCandidateDragCancel() {
    this.calendarPageFacade.dragedCandidate$.next({});
  }

  onCandidateOverAvaliableContainer(container: Element) {
    if (container.classList.contains('markedByInterviewer')) {
      container.classList.add('over');
    }
  }

  onCandidateOutOfAvaliableContainer(container: Element) {
    container.classList.remove('over');
  }
}
