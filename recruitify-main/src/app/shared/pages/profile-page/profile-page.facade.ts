import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Candidate } from '../../models/Candidate';
import { CandidateService } from '../../services/candidate.service';

@Injectable()
export class ProfilePageFacade implements OnDestroy {
  subs: Subscription | null = null;
  candidateData$ = new Subject<Candidate>();

  constructor(private candidateService: CandidateService) {}

  getCandidateById(id: string, projectId: string) {
    this.subs = this.candidateService
      .getCandidateById(id, projectId)
      .subscribe((candidate) => {
        this.candidateData$.next(candidate);
      });
  }

  getPrevProjects$(id: string): Observable<any[]> {
    return this.candidateService.getPrevProjects$(id);
  }
  ngOnDestroy() {
    this.subs?.unsubscribe();
  }
}
