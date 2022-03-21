import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor(private http: HttpClient) {}

  getInterviewersTimeTable() {
    return this.http.get('assets/interviewer-calendar.json');
  }

  getCandidatesTimeTable() {
    return this.http.get('assets/candidates-contact-time.json');
  }
}
