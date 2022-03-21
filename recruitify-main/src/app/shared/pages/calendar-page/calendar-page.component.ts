import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss'],
})
export class CalendarPageComponent implements OnInit {
  constructor(private userService: UserService) {}

  isInterviewer = this.userService.isInterviewer();
  isRecruiter = this.userService.isRecruiter();

  ngOnInit(): void {}
}
