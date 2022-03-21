import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Candidate } from '../models/Candidate';
import { ApiService } from './api.service';

const CANDIDATE_API = '/candidates';
@Injectable()
export class CandidateService extends ApiService {
  constructor(private httpClient: HttpClient) {
    super(httpClient, CANDIDATE_API, CandidateService.name);
  }

  getCandidateById(id: string, projectId: string): Observable<Candidate> {
    return super.get({ path: '/' + id + '/' + projectId });
  }
  getPrevProjects$(id: string): Observable<any[]> {
    return of([]);
  }
}
