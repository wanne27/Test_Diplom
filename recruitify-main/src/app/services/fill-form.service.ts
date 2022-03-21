import { CandidateService } from './../shared/services/candidate.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Candidate } from '../shared/models/Candidate';
import { PrimarySkill } from '../shared/models/PrimarySkills';
import { ApiService } from '../shared/services/api.service';

const FILLFORM_API = 'assets/';
@Injectable()
export class FillFormServices extends ApiService {
  constructor(
    private httpClient: HttpClient // private candidateService: CandidateService
  ) {
    super(httpClient, FILLFORM_API, FillFormServices.name);
  }

  addCandidate(candidate: Candidate): Observable<boolean> {
    return of(true);
  }

  primarySkills(): Observable<PrimarySkill[]> {
    return of([
      {
        id: 'aeb0e468-3774-11ec-83d4-97dbf3c3f8eb',
        name: '.Net',
        description: 'OOP, Design patterns, SQL, ASP.NET',
        testLink: 'https://exadel.com/tests/net',
      },
      {
        id: '9ff9ab3e-3775-11ec-92f5-134491be8f5a',
        name: 'QA',
        description: 'CSS, HTML, Java Script',
        testLink: 'https://exadel.com/tests/qa',
      },
    ]);
  }
}
