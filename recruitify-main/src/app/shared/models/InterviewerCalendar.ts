import { Candidate } from './Candidate';
export interface InterviewerCalendar {
  id: number;
  name: string;
  skill: string;
  calendar: Calendar[];
}

export interface Calendar {
  day: Date;
  timetable: Timetable[];
}

export interface Timetable {
  time: number;
  isAvaliable: boolean;
  isAssigned: boolean;
  candidate: Candidate[];
}
