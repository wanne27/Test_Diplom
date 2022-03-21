import { UserService } from './../../../shared/services/user.service';
import { Component, OnInit } from '@angular/core';
import { AppFacade } from 'src/app/app.facade';
import { User } from 'src/app/shared/models/User';
import { UserRole } from 'src/app/shared/models/UserRole';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isAdmin: boolean = this.userService.isAdmin();
  isInterviewer: boolean = this.userService.isInterviewer();

  user: User | undefined;
  constructor(private appFacade: AppFacade, private userService: UserService) {}

  onLogoutBtnClick() {
    this.appFacade.logout();
  }

  ngOnInit(): void {
    this.appFacade.getUser$().subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }
}
